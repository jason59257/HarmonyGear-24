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

            // Protected routes (require authentication)
            const authResult = await requireAuth(request, env);
            if (authResult.error) {
                return errorResponse(authResult.error, authResult.status);
            }

            // User routes
            if (path === '/api/stores' && method === 'GET') {
                return await handleGetStores(env);
            }
            
            if (path === '/api/stores' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleCreateStore(request, env);
            }
            
            if (path.startsWith('/api/stores/') && method === 'GET') {
                const id = path.split('/')[3];
                return await handleGetStore(id, env);
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
            if (path === '/api/coupons' && method === 'GET') {
                return await handleGetCoupons(env);
            }
            
            if (path === '/api/coupons' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
                return await handleCreateCoupon(request, env);
            }
            
            if (path.startsWith('/api/coupons/') && method === 'GET') {
                const id = path.split('/')[3];
                return await handleGetCoupon(id, env);
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
            if (path === '/api/categories' && method === 'GET') {
                return await handleGetCategories(env);
            }
            
            if (path === '/api/categories' && method === 'POST') {
                const adminResult = await requireAdmin(request, env);
                if (adminResult.error) {
                    return errorResponse(adminResult.error, adminResult.status);
                }
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

            // Products routes
            if (path === '/api/products' && method === 'GET') {
                return await handleGetProducts(env);
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
    const stores = await env.DB.prepare(
        'SELECT * FROM stores WHERE status = ? ORDER BY created_at DESC'
    ).bind('active').all();

    return jsonResponse({ success: true, data: stores.results || [] });
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
    const body = await request.json();
    const { name, category, cashback, website_url, redirect_url, logo_url, description, status } = body;

    if (!name) {
        return errorResponse('Store name is required', 400);
    }

    const result = await env.DB.prepare(
        'INSERT INTO stores (name, category, cashback, website_url, redirect_url, logo_url, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(name, category || '', cashback || 0, website_url || '', redirect_url || '', logo_url || '', description || '', status || 'active').run();

    const newStore = await env.DB.prepare(
        'SELECT * FROM stores WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return jsonResponse({ success: true, data: newStore }, 201);
}

async function handleUpdateStore(id, request, env) {
    const body = await request.json();
    const { name, category, cashback, website_url, redirect_url, logo_url, description, status } = body;

    const result = await env.DB.prepare(
        'UPDATE stores SET name = ?, category = ?, cashback = ?, website_url = ?, redirect_url = ?, logo_url = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(name, category, cashback, website_url, redirect_url, logo_url, description, status, id).run();

    if (result.meta.changes === 0) {
        return errorResponse('Store not found', 404);
    }

    const updatedStore = await env.DB.prepare(
        'SELECT * FROM stores WHERE id = ?'
    ).bind(id).first();

    return jsonResponse({ success: true, data: updatedStore });
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
    const coupons = await env.DB.prepare(
        'SELECT c.*, s.name as store_name FROM coupons c LEFT JOIN stores s ON c.store_id = s.id WHERE c.is_active = 1 ORDER BY c.created_at DESC'
    ).all();

    return jsonResponse({ success: true, data: coupons.results || [] });
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
    const { store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active, is_featured } = body;

    if (!title || !store_id) {
        return errorResponse('Title and store_id are required', 400);
    }

    const result = await env.DB.prepare(
        'INSERT INTO coupons (store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(store_id, title, short_description || '', code || '', discount_type || 'percentage', discount_value || 0, min_purchase || 0, max_discount || 0, expiry_date || null, redirect_url || '', description || '', is_active ? 1 : 0, is_featured ? 1 : 0).run();

    const newCoupon = await env.DB.prepare(
        'SELECT c.*, s.name as store_name FROM coupons c LEFT JOIN stores s ON c.store_id = s.id WHERE c.id = ?'
    ).bind(result.meta.last_row_id).first();

    return jsonResponse({ success: true, data: newCoupon }, 201);
}

async function handleUpdateCoupon(id, request, env) {
    const body = await request.json();
    const { store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active, is_featured } = body;

    const result = await env.DB.prepare(
        'UPDATE coupons SET store_id = ?, title = ?, short_description = ?, code = ?, discount_type = ?, discount_value = ?, min_purchase = ?, max_discount = ?, expiry_date = ?, redirect_url = ?, description = ?, is_active = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(store_id, title, short_description, code, discount_type, discount_value, min_purchase, max_discount, expiry_date, redirect_url, description, is_active ? 1 : 0, is_featured ? 1 : 0, id).run();

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
    const body = await request.json();
    const { name, slug, icon, description, sort_order } = body;

    if (!name || !slug) {
        return errorResponse('Name and slug are required', 400);
    }

    const result = await env.DB.prepare(
        'INSERT INTO categories (name, slug, icon, description, sort_order) VALUES (?, ?, ?, ?, ?)'
    ).bind(name, slug, icon || '', description || '', sort_order || 0).run();

    const newCategory = await env.DB.prepare(
        'SELECT * FROM categories WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return jsonResponse({ success: true, data: newCategory }, 201);
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
