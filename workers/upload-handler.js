// Cloudflare Worker for handling image uploads to R2
// This worker receives file uploads and stores them in R2 bucket

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    try {
      // Get uploaded file
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ 
          error: 'Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return new Response(JSON.stringify({ 
          error: 'File too large. Maximum size is 5MB.' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `uploads/${timestamp}-${randomStr}.${extension}`;

      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      await env.COUPON_IMAGES.put(fileName, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      // Get R2 public URL
      // Configure R2_PUBLIC_URL in wrangler.toml or Cloudflare Dashboard
      // This should be your R2 public domain or custom domain
      // Example: https://pub-xxxxx.r2.dev or https://images.yourdomain.com
      const r2PublicUrl = env.R2_PUBLIC_URL 
        ? `${env.R2_PUBLIC_URL}/${fileName}`
        : `https://pub-xxxxx.r2.dev/${fileName}`; // Replace with your actual R2 domain
      
      // Note: You must:
      // 1. Enable R2 public access in bucket settings
      // 2. Set R2_PUBLIC_URL in wrangler.toml or Cloudflare Dashboard
      // See CLOUDFLARE_DEPLOYMENT.md for detailed instructions

      return new Response(JSON.stringify({ 
        success: true, 
        url: r2PublicUrl,
        fileName: fileName 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      return new Response(JSON.stringify({ 
        error: 'Upload failed',
        message: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
