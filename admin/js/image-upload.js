// Image Upload Component

class ImageUpload {
    constructor(options = {}) {
        this.maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
        this.allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.onUpload = options.onUpload || null;
        this.previewContainer = null;
    }

    // Create upload component
    createUploadComponent(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const uploadId = `upload-${Date.now()}`;
        const previewId = `preview-${Date.now()}`;

        container.innerHTML = `
            <div class="image-upload-wrapper">
                <input type="file" id="${uploadId}" accept="image/*" style="display: none;">
                <div class="image-upload-area" id="${previewId}">
                    <div class="image-upload-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p>Click to upload or drag and drop</p>
                        <span style="font-size: 12px; color: var(--admin-text-light);">PNG, JPG, GIF up to 5MB</span>
                    </div>
                </div>
                <button type="button" class="admin-btn admin-btn-primary" style="margin-top: 12px;" onclick="document.getElementById('${uploadId}').click()">
                    Choose Image
                </button>
            </div>
        `;

        const fileInput = document.getElementById(uploadId);
        const previewArea = document.getElementById(previewId);

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], previewArea, uploadId);
        });

        // Drag and drop
        previewArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            previewArea.classList.add('drag-over');
        });

        previewArea.addEventListener('dragleave', () => {
            previewArea.classList.remove('drag-over');
        });

        previewArea.addEventListener('drop', (e) => {
            e.preventDefault();
            previewArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files[0], previewArea, uploadId);
            }
        });

        this.previewContainer = previewArea;
    }

    // Handle file selection
    async handleFileSelect(file, previewArea, inputId) {
        if (!file) return;

        // Validate file type
        if (!this.allowedTypes.includes(file.type)) {
            showAdminNotification('Invalid file type. Please upload an image.', 'error');
            return;
        }

        // Validate file size
        if (file.size > this.maxSize) {
            showAdminNotification(`File size exceeds ${this.maxSize / 1024 / 1024}MB limit.`, 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewArea.innerHTML = `
                <div class="image-preview">
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="image-remove" onclick="this.closest('.image-upload-area').innerHTML = document.querySelector('.image-upload-placeholder').outerHTML; document.getElementById('${inputId}').value = '';">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);

        // Call upload callback if provided
        if (this.onUpload) {
            try {
                const result = await this.onUpload(file);
                if (result && result.url) {
                    // Store the uploaded URL in a hidden input or data attribute
                    previewArea.setAttribute('data-image-url', result.url);
                }
            } catch (error) {
                console.error('Upload error:', error);
                showAdminNotification('Error uploading image', 'error');
            }
        }
    }

    // Get uploaded image URL
    getImageUrl(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        const previewArea = container.querySelector('.image-upload-area');
        return previewArea ? previewArea.getAttribute('data-image-url') : null;
    }

    // Reset upload component
    reset(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const previewArea = container.querySelector('.image-upload-area');
        const fileInput = container.querySelector('input[type="file"]');
        if (previewArea) {
            previewArea.innerHTML = `
                <div class="image-upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Click to upload or drag and drop</p>
                    <span style="font-size: 12px; color: var(--admin-text-light);">PNG, JPG, GIF up to 5MB</span>
                </div>
            `;
        }
        if (fileInput) {
            fileInput.value = '';
        }
    }
}

// Export to global scope
window.ImageUpload = ImageUpload;
