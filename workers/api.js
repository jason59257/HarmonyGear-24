// Main API Worker for Coupon Website
import { generateToken, verifyToken, hashPassword, comparePassword, requireAuth, requireAdmin, getTokenFromRequest } from './auth.js';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

function errorResponse(message, status = 400) {
    return jsonResponse({ error: message, success: false }, status);
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Handle CORS preflight
        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Public routes (no authentication required)
            if (path === '/api/register' && method === 'POST') {
                return await handleRegister(request, env);
            }
            
            if (path === '/api/login' && method === 'POST') {
                return await handleLogin(request, env);
            }
            
            if (path === '/api/admin/login' && method === 'POST') {
                return await handleAdminLogin(request, env);
            }

            // Public routes (no authentication required)
            if (path === '/api/stores' && method === 'GET') {
                return await handleGetStores(env);
            }
            
            if (path.startsWith('/api/stores/') && method === 'GET') {
                const id = path.split('/')[3];
                return await handleGetStore(id, env);
            }
            
            if (path === '/api/coupons' && method === 'GET') {
                return await handleGetCoupons(env);
            }
            
            if (path.startsWith('/api/coupons/') && method === 'GET') {
                const id = path.split('/')[3];
                return await handleGetCoupon(id, env);
            }
            
            if (path === '/api/products' && method === 'GET') {
                return await handleGetProducts(env);
            }
            
            if (path.startsWith('/api/products/') && method === 'GET') {
                const id = path.split('/')[3];
                return await handleGetProduct(id, env);
            }
            
            if (path === '/api/categories' && method === 'GET') {
                return await handleGetCategories(env);
            }
            
            if (path === '/api/banners' && method === 'GET') {
                return await handleGetBanners(env);
            }

            // Protected routes (require authentication)
            const authResult = await requireAuth(request, env);
            if (authResult.error) {
                return errorResponse(authResult.error, authResult.status);
            }

            // User routes
            
            if (path === '/api/stores' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleCreateStore(request, env);
            }
            
            if (path.startsWith('/api/stores/') && method === 'PUT') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                const id = path.split('/')[3];
                return await handleUpdateStore(id, request, env);
            }
            
            if (path.startsWith('/api/stores/') && method === 'DELETE') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                const id = path.split('/')[3];
                return await handleDeleteStore(id, env);
            }

            // Coupons routes
            if (path === '/api/coupons' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleCreateCoupon(request, env);
            }
            
            if (path.startsWith('/api/coupons/') && method === 'PUT') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                const id = path.split('/')[3];
                return await handleUpdateCoupon(id, request, env);
            }
            
            if (path.startsWith('/api/coupons/') && method === 'DELETE') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                const id = path.split('/')[3];
                return await handleDeleteCoupon(id, env);
            }

            // Categories routes
            if (path === '/api/categories' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    // Log for debugging
                    console.log('Categories POST - Admin check failed:', adminResult.error, adminResult.status);
                    return errorResponse(adminResult.error, adminResult.status);
                }
                console.log('Categories POST - Admin check passed');
                return await handleCreateCategory(request, env);
            }

            // Users routes (admin only)
            if (path === '/api/users' && method === 'GET') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleGetUsers(env);
            }

            // Hero Banners routes (admin only)
            if (path === '/api/banners' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleCreateBanner(request, env);
            }
            
            if (path.startsWith('/api/banners/') && method === 'PUT') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                const id = path.split('/')[3];
                return await handleUpdateBanner(id, request, env);
            }
            
            if (path.startsWith('/api/banners/') && method === 'DELETE') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                const id = path.split('/')[3];
                return await handleDeleteBanner(id, env);
            }

            // Image upload route
            if (path === '/api/upload' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleImageUpload(request, env);
            }

            return errorResponse('Not found', 404);
        } catch (error) {
            console.error('API Error:', error);
            return errorResponse('Internal server error', 500);
        }
    }
};

// Handler functions

async function handleRegister(request, env) {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
        return errorResponse('Email and password required', 400);
    }

    // Check if user exists
    const existing = await env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
        return errorResponse('User already exists', 400);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await env.DB.prepare(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
    ).bind(email, passwordHash, name || '').run();

    // Generate token
    const token = await generateToken(result.meta.last_row_id, email, 'user', env);

    return jsonResponse({
        success: true,
        token,
        user: { id: result.meta.last_row_id, email, name: name || '' }
    });
}

async function handleLogin(request, env) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return errorResponse('Email and password required', 400);
    }

    // Find user
    const user = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
        return errorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
        return errorResponse('Invalid credentials', 401);
    }

    // Generate token
    const token = await generateToken(user.id, user.email, user.role, env);

    return jsonResponse({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
}

async function handleAdminLogin(request, env) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return errorResponse('Email and password required', 400);
    }

    // Find admin user
    const admin = await env.DB.prepare(
        'SELECT * FROM admin_users WHERE email = ?'
    ).bind(email).first();

    if (!admin) {
        return errorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
        return errorResponse('Invalid credentials', 401);
    }

    // Generate token
    const token = await generateToken(admin.id, admin.email, 'admin', env);

    return jsonResponse({
        success: true,
        token,
        user: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'admin'
        }
    });
}

async function handleGetStores(env) {
    try {
        // Get all stores, not just active ones (frontend will filter)
        const stores = await env.DB.prepare(
            'SELECT * FROM stores ORDER BY created_at DESC'
        ).all();

        console.log('handleGetStores - Found stores:', stores.results?.length || 0);
        return jsonResponse({ success: true, data: stores.results || [] });
    } catch (error) {
        console.error('handleGetStores error:', error);
        return errorResponse('Failed to fetch stores: ' + error.message, 500);
    }
}

async function handleGetStore(id, env) {
    const store = await env.DB.prepare(
        'SELECT * FROM stores WHERE id = ?'
    ).bind(id).first();

    if (!store) {
        return errorResponse('Store not found', 404);
    }

    return jsonResponse({ success: true, data: store });
}

async function handleCreateStore(request, env) {
    try {
        const body = await request.json();
        const { name, category, cashback, website_url, redirect_url, logo_url, description, status, is_popular, is_extra_cashback, popular_sort_order, extra_cashback_sort_order } = body;

        if (!name) {
            return errorResponse('Store name is required', 400);
        }

        console.log('handleCreateStore - Creating store:', {
            name,
            is_popular,
            is_extra_cashback,
            popular_sort_order,
            extra_cashback_sort_order
        });

        const result = await env.DB.prepare(
            'INSERT INTO stores (name, category, cashback, website_url, redirect_url, logo_url, description, status, is_popular, is_extra_cashback, popular_sort_order, extra_cashback_sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
            name, 
            category || '', 
            cashback || 0, 
            website_url || '', 
            redirect_url || '', 
            logo_url || '', 
            description || '', 
            status || 'active',
            is_popular || 0,
            is_extra_cashback || 0,
            popular_sort_order || 0,
            extra_cashback_sort_order || 0
        ).run();

        const newStore = await env.DB.prepare(
            'SELECT * FROM stores WHERE id = ?'
        ).bind(result.meta.last_row_id).first();

        console.log('handleCreateStore - Store created successfully');
        return jsonResponse({ success: true, data: newStore }, 201);
    } catch (error) {
        console.error('handleCreateStore - Error:', error);
        console.error('handleCreateStore - Error stack:', error.stack);
        return errorResponse('Failed to create store: ' + error.message, 500);
    }
}

async function handleUpdateStore(id, request, env) {
    try {
        const body = await request.json();
        const { name, category, cashback, website_url, redirect_url, logo_url, description, status, is_popular, is_extra_cashback, popular_sort_order, extra_cashback_sort_order } = body;

        console.log('handleUpdateStore - Updating store:', id, {
            name,
            is_popular,
            is_extra_cashback,
            popular_sort_order,
            extra_cashback_sort_order
        });

        const result = await env.DB.prepare(
            'UPDATE stores SET name = ?, category = ?, cashback = ?, website_url = ?, redirect_url = ?, logo_url = ?, description = ?, status = ?, is_popular = ?, is_extra_cashback = ?, popular_sort_order = ?, extra_cashback_sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(
            name, 
            category, 
            cashback, 
            website_url, 
            redirect_url, 
            logo_url, 
            description, 
            status,
            is_popular || 0,
            is_extra_cashback || 0,
            popular_sort_order || 0,
            extra_cashback_sort_order || 0,
            id
        ).run();

        if (result.meta.changes === 0) {
            return errorResponse('Store not found', 404);
        }

        const updatedStore = await env.DB.prepare(
            'SELECT * FROM stores WHERE id = ?'
        ).bind(id).first();

        console.log('handleUpdateStore - Store updated successfully');
        return jsonResponse({ success: true, data: updatedStore });
    } catch (error) {
        console.error('handleUpdateStore - Error:', error);
        console.error('handleUpdateStore - Error stack:', error.stack);
        return errorResponse('Failed to update store: ' + error.message, 500);
    }
}

async function handleDeleteStore(id, env) {
    const result = await env.DB.prepare(
        'DELETE FROM stores WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
        return errorResponse('Store not found', 404);
    }

    return jsonResponse({ success: true, message: 'Store deleted' });
}

async function handleGetCoupons(env) {
    try {
        // Get all coupons (frontend will filter active ones)
        const coupons = await env.DB.prepare(
            'SELECT * FROM coupons ORDER BY created_at DESC'
        ).all();

        console.log('handleGetCoupons - Found coupons:', coupons.results?.length || 0);
        return jsonResponse({ success: true, data: coupons.results || [] });
    } catch (error) {
        console.error('handleGetCoupons error:', error);
        return errorResponse('Failed to fetch coupons: ' + error.message, 500);
    }
}

async function handleGetCoupon(id, env) {
    const coupon = await env.DB.prepare(
        'SELECT c.*, s.name as store_name FROM coupons c LEFT JOIN stores s ON c.store_id = s.id WHERE c.id = ?'
    ).bind(id).first();

    if (!coupon) {
        return errorResponse('Coupon not found', 404);
    }

    return jsonResponse({ success: true, data: coupon });
}

async function handleCreateCoupon(request, env) {
    const body = await request.json();
    const { store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active, is_featured, is_deal_of_week, is_hot_deal, deal_of_week_sort_order, hot_deal_sort_order } = body;

    if (!title || !store_id) {
        return errorResponse('Title and store_id are required', 400);
    }

    const result = await env.DB.prepare(
        'INSERT INTO coupons (store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active, is_featured, is_deal_of_week, is_hot_deal, deal_of_week_sort_order, hot_deal_sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
        store_id, 
        title, 
        short_description || '', 
        code || '', 
        discount_type || 'percentage', 
        discount_value || 0, 
        min_purchase || 0, 
        max_discount || 0, 
        expiry_date || null, 
        redirect_url || '', 
        description || '', 
        is_active ? 1 : 0, 
        is_featured ? 1 : 0,
        is_deal_of_week || 0,
        is_hot_deal || 0,
        deal_of_week_sort_order || 0,
        hot_deal_sort_order || 0
    ).run();

    const newCoupon = await env.DB.prepare(
        'SELECT c.*, s.name as store_name FROM coupons c LEFT JOIN stores s ON c.store_id = s.id WHERE c.id = ?'
    ).bind(result.meta.last_row_id).first();

    return jsonResponse({ success: true, data: newCoupon }, 201);
}

async function handleUpdateCoupon(id, request, env) {
    const body = await request.json();
    const { store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active, is_featured, is_deal_of_week, is_hot_deal, deal_of_week_sort_order, hot_deal_sort_order } = body;

    const result = await env.DB.prepare(
        'UPDATE coupons SET store_id = ?, title = ?, short_description = ?, code = ?, discount_type = ?, discount_value = ?, min_purchase = ?, max_discount = ?, expiry_date = ?, redirect_url = ?, description = ?, is_active = ?, is_featured = ?, is_deal_of_week = ?, is_hot_deal = ?, deal_of_week_sort_order = ?, hot_deal_sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(
        store_id, 
        title, 
        short_description, 
        code, 
        discount_type, 
        discount_value, 
        min_purchase, 
        max_discount, 
        expiry_date, 
        redirect_url, 
        description, 
        is_active ? 1 : 0, 
        is_featured ? 1 : 0,
        is_deal_of_week || 0,
        is_hot_deal || 0,
        deal_of_week_sort_order || 0,
        hot_deal_sort_order || 0,
        id
    ).run();

    if (result.meta.changes === 0) {
        return errorResponse('Coupon not found', 404);
    }

    const updatedCoupon = await env.DB.prepare(
        'SELECT c.*, s.name as store_name FROM coupons c LEFT JOIN stores s ON c.store_id = s.id WHERE c.id = ?'
    ).bind(id).first();

    return jsonResponse({ success: true, data: updatedCoupon });
}

async function handleDeleteCoupon(id, env) {
    const result = await env.DB.prepare(
        'DELETE FROM coupons WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
        return errorResponse('Coupon not found', 404);
    }

    return jsonResponse({ success: true, message: 'Coupon deleted' });
}

async function handleGetCategories(env) {
    const categories = await env.DB.prepare(
        'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
    ).all();

    return jsonResponse({ success: true, data: categories.results || [] });
}

async function handleCreateCategory(request, env) {
    try {
        const body = await request.json();
        const { name, slug, icon, description, sort_order } = body;

        console.log('handleCreateCategory - Received data:', { name, slug, icon, description, sort_order });

        if (!name || !slug) {
            return errorResponse('Name and slug are required', 400);
        }

        // Check if slug already exists
        const existing = await env.DB.prepare(
            'SELECT id FROM categories WHERE slug = ?'
        ).bind(slug).first();

        if (existing) {
            console.log('handleCreateCategory - Slug already exists:', slug);
            return errorResponse('Category with this slug already exists', 409);
        }

        console.log('handleCreateCategory - Inserting category...');
        const result = await env.DB.prepare(
            'INSERT INTO categories (name, slug, icon, description, sort_order) VALUES (?, ?, ?, ?, ?)'
        ).bind(name, slug, icon || '', description || '', sort_order || 0).run();

        console.log('handleCreateCategory - Insert result:', result);

        if (!result.success) {
            console.error('handleCreateCategory - Insert failed:', result.error);
            return errorResponse('Failed to create category: ' + (result.error || 'Unknown error'), 500);
        }

        const newCategory = await env.DB.prepare(
            'SELECT * FROM categories WHERE id = ?'
        ).bind(result.meta.last_row_id).first();

        console.log('handleCreateCategory - Created category:', newCategory);
        return jsonResponse({ success: true, data: newCategory }, 201);
    } catch (error) {
        console.error('handleCreateCategory - Exception:', error);
        console.error('handleCreateCategory - Error stack:', error.stack);
        return errorResponse('Internal server error: ' + error.message, 500);
    }
}

async function handleGetUsers(env) {
    const users = await env.DB.prepare(
        'SELECT id, email, name, role, is_active, total_cashback, pending_cashback, created_at FROM users ORDER BY created_at DESC'
    ).all();

    return jsonResponse({ success: true, data: users.results || [] });
}

async function handleGetProducts(env) {
    const products = await env.DB.prepare(
        'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC'
    ).all();

    return jsonResponse({ success: true, data: products.results || [] });
}

async function handleGetProduct(id, env) {
    const product = await env.DB.prepare(
        'SELECT * FROM products WHERE id = ? AND is_active = 1'
    ).bind(id).first();

    if (!product) {
        return errorResponse('Product not found', 404);
    }

    return jsonResponse({ success: true, data: product });
}

async function handleImageUpload(request, env) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return errorResponse('No file provided', 400);
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return errorResponse('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 400);
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return errorResponse('File too large. Maximum size is 5MB.', 400);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomStr}.${extension}`;

        // Convert file to array buffer
        const arrayBuffer = await file.arrayBuffer();

        // Upload to R2
        await env.COUPON_IMAGES.put(fileName, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
        });

        // Get public URL
        const r2PublicUrl = env.R2_PUBLIC_URL || 'https://pub-xxxxx.r2.dev';
        const imageUrl = `${r2PublicUrl}/${fileName}`;

        console.log('Image uploaded successfully:', imageUrl);

        return jsonResponse({
            success: true,
            url: imageUrl,
            fileName: fileName
        }, 200);

    } catch (error) {
        console.error('Image upload error:', error);
        return errorResponse('Failed to upload image: ' + error.message, 500);
    }
}

// Hero Banners handlers
async function handleGetBanners(env) {
    try {
        const { results } = await env.DB.prepare(
            'SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC'
        ).all();
        
        return jsonResponse({ success: true, data: results || [] });
    } catch (error) {
        console.error('handleGetBanners error:', error);
        return errorResponse('Failed to fetch banners: ' + error.message, 500);
    }
}

async function handleCreateBanner(request, env) {
    try {
        const body = await request.json();
        const { title, subtitle, small_text, button_text, button_url, background_image_url, sort_order } = body;

        if (!title) {
            return errorResponse('Title is required', 400);
        }

        const result = await env.DB.prepare(
            'INSERT INTO hero_banners (title, subtitle, small_text, button_text, button_url, background_image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
            title,
            subtitle || '',
            small_text || '',
            button_text || '',
            button_url || '',
            background_image_url || '',
            sort_order || 0
        ).run();

        if (!result.success) {
            return errorResponse('Failed to create banner', 500);
        }

        const newBanner = await env.DB.prepare(
            'SELECT * FROM hero_banners WHERE id = ?'
        ).bind(result.meta.last_row_id).first();

        return jsonResponse({ success: true, data: newBanner }, 201);
    } catch (error) {
        console.error('handleCreateBanner error:', error);
        return errorResponse('Internal server error: ' + error.message, 500);
    }
}

async function handleUpdateBanner(id, request, env) {
    try {
        const body = await request.json();
        const { title, subtitle, small_text, button_text, button_url, background_image_url, sort_order, is_active } = body;

        if (!title) {
            return errorResponse('Title is required', 400);
        }

        const result = await env.DB.prepare(
            'UPDATE hero_banners SET title = ?, subtitle = ?, small_text = ?, button_text = ?, button_url = ?, background_image_url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(
            title,
            subtitle || '',
            small_text || '',
            button_text || '',
            button_url || '',
            background_image_url || '',
            sort_order || 0,
            is_active !== undefined ? (is_active ? 1 : 0) : 1,
            id
        ).run();

        if (!result.success) {
            return errorResponse('Failed to update banner', 500);
        }

        const updatedBanner = await env.DB.prepare(
            'SELECT * FROM hero_banners WHERE id = ?'
        ).bind(id).first();

        return jsonResponse({ success: true, data: updatedBanner });
    } catch (error) {
        console.error('handleUpdateBanner error:', error);
        return errorResponse('Internal server error: ' + error.message, 500);
    }
}

async function handleDeleteBanner(id, env) {
    try {
        const result = await env.DB.prepare(
            'DELETE FROM hero_banners WHERE id = ?'
        ).bind(id).run();

        if (!result.success) {
            return errorResponse('Failed to delete banner', 500);
        }

        return jsonResponse({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('handleDeleteBanner error:', error);
        return errorResponse('Internal server error: ' + error.message, 500);
    }
}
