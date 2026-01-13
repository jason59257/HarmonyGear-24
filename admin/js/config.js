// Configuration file for Cloudflare deployment
// Update these values after deploying to Cloudflare

export const CONFIG = {
    // Cloudflare Worker URL for image uploads
    // Replace with your actual Worker URL after deployment
    // Example: 'https://coupon-upload-handler.your-username.workers.dev'
    UPLOAD_WORKER_URL: 'https://coupon-upload-handler.your-username.workers.dev',
    
    // Or use your custom domain
    // UPLOAD_WORKER_URL: 'https://api.yourdomain.com/upload',
    
    // R2 Public URL for displaying images
    // Replace with your R2 public domain or custom domain
    // Example: 'https://images.yourdomain.com'
    R2_PUBLIC_URL: 'https://images.yourdomain.com',
    
    // Fallback to mock upload if Worker is not available (for local development)
    USE_MOCK_UPLOAD: false,
};
