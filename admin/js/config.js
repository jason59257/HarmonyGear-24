// Configuration file for Cloudflare deployment
// Production API configuration

export const CONFIG = {
    // Main API Worker URL
    API_BASE_URL: 'https://coupon-api.jason59257.workers.dev',
    
    // Cloudflare Worker URL for image uploads
    UPLOAD_WORKER_URL: 'https://coupon-api.jason59257.workers.dev/api/upload',
    
    // R2 Public URL for displaying images
    // Update this after configuring R2 public access
    R2_PUBLIC_URL: 'https://pub-xxxxx.r2.dev',
    
    // Use real API (not mock)
    USE_MOCK_UPLOAD: false,
    USE_MOCK_API: false,
};
