// Admin API Interface - Real API Implementation
// This file provides real API calls to Cloudflare Worker

// Import configuration
import { CONFIG } from './config.js';

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to make API request
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
}

// Store API
export const StoreAPI = {
    async getAll() {
        try {
            const result = await apiRequest('/api/stores');
            return { success: true, data: result.data || [] };
        } catch (error) {
            console.error('StoreAPI.getAll error:', error);
            return { success: false, error: error.message };
        }
    },

    async getById(id) {
        try {
            const result = await apiRequest(`/api/stores/${id}`);
            return result;
        } catch (error) {
            console.error('StoreAPI.getById error:', error);
            return { success: false, error: error.message };
        }
    },

    async create(storeData) {
        try {
            const result = await apiRequest('/api/stores', {
                method: 'POST',
                body: JSON.stringify(storeData),
            });
            return result;
        } catch (error) {
            console.error('StoreAPI.create error:', error);
            return { success: false, error: error.message };
        }
    },

    async update(id, storeData) {
        try {
            const result = await apiRequest(`/api/stores/${id}`, {
                method: 'PUT',
                body: JSON.stringify(storeData),
            });
            return result;
        } catch (error) {
            console.error('StoreAPI.update error:', error);
            return { success: false, error: error.message };
        }
    },

    async delete(id) {
        try {
            const result = await apiRequest(`/api/stores/${id}`, {
                method: 'DELETE',
            });
            return result;
        } catch (error) {
            console.error('StoreAPI.delete error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Coupon API
export const CouponAPI = {
    async getAll() {
        try {
            const result = await apiRequest('/api/coupons');
            return { success: true, data: result.data || [] };
        } catch (error) {
            console.error('CouponAPI.getAll error:', error);
            return { success: false, error: error.message };
        }
    },

    async getById(id) {
        try {
            const result = await apiRequest(`/api/coupons/${id}`);
            return result;
        } catch (error) {
            console.error('CouponAPI.getById error:', error);
            return { success: false, error: error.message };
        }
    },

    async create(couponData) {
        try {
            const result = await apiRequest('/api/coupons', {
                method: 'POST',
                body: JSON.stringify(couponData),
            });
            return result;
        } catch (error) {
            console.error('CouponAPI.create error:', error);
            return { success: false, error: error.message };
        }
    },

    async update(id, couponData) {
        try {
            const result = await apiRequest(`/api/coupons/${id}`, {
                method: 'PUT',
                body: JSON.stringify(couponData),
            });
            return result;
        } catch (error) {
            console.error('CouponAPI.update error:', error);
            return { success: false, error: error.message };
        }
    },

    async delete(id) {
        try {
            const result = await apiRequest(`/api/coupons/${id}`, {
                method: 'DELETE',
            });
            return result;
        } catch (error) {
            console.error('CouponAPI.delete error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Category API
export const CategoryAPI = {
    async getAll() {
        try {
            const result = await apiRequest('/api/categories');
            return { success: true, data: result.data || [] };
        } catch (error) {
            console.error('CategoryAPI.getAll error:', error);
            return { success: false, error: error.message };
        }
    },

    async getById(id) {
        try {
            const categories = await this.getAll();
            const category = categories.data?.find(c => c.id === parseInt(id));
            return category ? { success: true, data: category } : { success: false, error: 'Category not found' };
        } catch (error) {
            console.error('CategoryAPI.getById error:', error);
            return { success: false, error: error.message };
        }
    },

    async create(categoryData) {
        try {
            const result = await apiRequest('/api/categories', {
                method: 'POST',
                body: JSON.stringify(categoryData),
            });
            return result;
        } catch (error) {
            console.error('CategoryAPI.create error:', error);
            return { success: false, error: error.message };
        }
    },

    async update(id, categoryData) {
        try {
            const result = await apiRequest(`/api/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify(categoryData),
            });
            return result;
        } catch (error) {
            console.error('CategoryAPI.update error:', error);
            return { success: false, error: error.message };
        }
    },

    async delete(id) {
        try {
            const result = await apiRequest(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            return result;
        } catch (error) {
            console.error('CategoryAPI.delete error:', error);
            return { success: false, error: error.message };
        }
    }
};

// User API
export const UserAPI = {
    async getAll() {
        try {
            const result = await apiRequest('/api/users');
            return { success: true, data: result.data || [] };
        } catch (error) {
            console.error('UserAPI.getAll error:', error);
            return { success: false, error: error.message };
        }
    },

    async getById(id) {
        try {
            const users = await this.getAll();
            const user = users.data?.find(u => u.id === parseInt(id));
            return user ? { success: true, data: user } : { success: false, error: 'User not found' };
        } catch (error) {
            console.error('UserAPI.getById error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Product API
export const ProductAPI = {
    async getAll() {
        try {
            const result = await apiRequest('/api/products');
            return { success: true, data: result.data || [] };
        } catch (error) {
            console.error('ProductAPI.getAll error:', error);
            return { success: false, error: error.message };
        }
    },

    async getById(id) {
        try {
            const products = await this.getAll();
            const product = products.data?.find(p => p.id === parseInt(id));
            return product ? { success: true, data: product } : { success: false, error: 'Product not found' };
        } catch (error) {
            console.error('ProductAPI.getById error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Analytics API (mock for now)
export const AnalyticsAPI = {
    async getStats() {
        // This would call a real analytics endpoint when implemented
        return {
            success: true,
            data: {
                totalStores: 0,
                totalCoupons: 0,
                totalUsers: 0,
                totalCashback: 0
            }
        };
    }
};

// Image API
export const ImageAPI = {
    async upload(file, entityType, entityId) {
        if (CONFIG.USE_MOCK_UPLOAD) {
            // Mock upload for development
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(file.name)}`;
            return { success: true, data: { url: mockUrl } };
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const token = getAuthToken();
            const response = await fetch(CONFIG.UPLOAD_WORKER_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    return { success: true, data: { url: result.url } };
                } else {
                    throw new Error(result.error || 'Upload failed');
                }
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
                throw new Error(errorData.error || 'Upload failed');
            }
        } catch (error) {
            console.error('ImageAPI.upload error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Admin Login API
export const AdminAuthAPI = {
    async login(email, password) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            
            if (result.success && result.token) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', result.user.email);
                return { success: true, user: result.user };
            } else {
                return { success: false, error: result.error || 'Login failed' };
            }
        } catch (error) {
            console.error('AdminAuthAPI.login error:', error);
            return { success: false, error: error.message };
        }
    },

    async logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
    }
};

// Export all APIs
export default {
    StoreAPI,
    CouponAPI,
    CategoryAPI,
    UserAPI,
    AnalyticsAPI,
    ImageAPI,
    ProductAPI,
    AdminAuthAPI
};
