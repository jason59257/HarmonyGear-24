// Frontend API Client
// This file provides API calls for the frontend pages

const API_BASE_URL = 'https://coupon-api.jason59257.workers.dev';

// Helper function to make API request
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
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
            return { success: false, error: error.message, data: [] };
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
            return { success: false, error: error.message, data: [] };
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
            return { success: false, error: error.message, data: [] };
        }
    }
};

// Export to global scope for non-module scripts
if (typeof window !== 'undefined') {
    window.StoreAPI = StoreAPI;
    window.CouponAPI = CouponAPI;
    window.ProductAPI = ProductAPI;
}
