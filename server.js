// Simple Image Upload Server
// Run with: node server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only images
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
        success: true,
        data: {
            url: fileUrl,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Upload server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Image upload server running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`\nTo use the upload feature:`);
    console.log(`1. Make sure this server is running`);
    console.log(`2. Update admin/js/api.js to use: http://localhost:${PORT}/api/upload`);
});
