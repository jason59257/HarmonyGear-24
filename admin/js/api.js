// Admin API Interface
// This file provides a mock API interface for the admin panel
// In production, replace these with actual API calls

// Import configuration
import { CONFIG } from './config.js';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (in production, this would be a database)
let mockStores = [
    { id: 1, name: 'Amazon', category: 'Electronics', cashback: 5, status: 'active', logo_url: '', website_url: 'https://amazon.com', redirect_url: 'https://amazon.com/?ref=harmonygear24', description: 'Online retailer' },
    { id: 2, name: 'Target', category: 'Retail', cashback: 3, status: 'active', logo_url: '', website_url: 'https://target.com', redirect_url: 'https://target.com/?ref=harmonygear24', description: 'Department store' },
    { id: 3, name: 'Walmart', category: 'Retail', cashback: 2, status: 'active', logo_url: '', website_url: 'https://walmart.com', redirect_url: 'https://walmart.com/?ref=harmonygear24', description: 'Supermarket chain' }
];

let mockCoupons = [
    { id: 1, store_id: 1, title: '20% OFF Electronics', short_description: 'Save 20% on all electronics items', code: 'SAVE20', discount_type: 'percentage', discount_value: 20, redirect_url: 'https://amazon.com/dp/B08N5WRWNW?ref=harmonygear24&code=SAVE20', expiry_date: '2024-12-31', is_active: true },
    { id: 2, store_id: 2, title: '$10 OFF $50+', short_description: 'Get $10 off when you spend $50 or more', code: 'SAVE10', discount_type: 'fixed', discount_value: 10, redirect_url: 'https://target.com/coupons/SAVE10?ref=harmonygear24', expiry_date: '2024-11-30', is_active: true },
    { id: 3, store_id: 3, title: 'Free Shipping', short_description: 'Free shipping on all orders', code: 'FREESHIP', discount_type: 'free_shipping', discount_value: 0, redirect_url: 'https://walmart.com/freeshipping?ref=harmonygear24', expiry_date: '2024-12-15', is_active: true }
];

let mockCategories = [
    { id: 1, name: 'Electronics', slug: 'electronics', icon: '📱', description: 'Electronic devices and gadgets' },
    { id: 2, name: 'Retail', slug: 'retail', icon: '🛍️', description: 'General retail stores' },
    { id: 3, name: 'Travel', slug: 'travel', icon: '✈️', description: 'Travel and booking services' }
];

let mockUsers = [
    { id: 1, email: 'user1@example.com', name: 'John Doe', total_cashback: 125.50, pending_cashback: 45.20, is_active: true, created_at: '2024-01-15' },
    { id: 2, email: 'user2@example.com', name: 'Jane Smith', total_cashback: 89.30, pending_cashback: 23.10, is_active: true, created_at: '2024-02-20' },
    { id: 3, email: 'user3@example.com', name: 'Bob Johnson', total_cashback: 234.80, pending_cashback: 67.50, is_active: true, created_at: '2024-03-10' }
];

// Store API
export const StoreAPI = {
    async getAll() {
        await delay(500);
        return { success: true, data: mockStores };
    },

    async getById(id) {
        await delay(300);
        const store = mockStores.find(s => s.id === parseInt(id));
        return store ? { success: true, data: store } : { success: false, error: 'Store not found' };
    },

    async create(storeData) {
        await delay(500);
        const newStore = {
            id: mockStores.length + 1,
            ...storeData,
            status: storeData.status || 'active',
            created_at: new Date().toISOString()
        };
        mockStores.push(newStore);
        return { success: true, data: newStore };
    },

    async update(id, storeData) {
        await delay(500);
        const index = mockStores.findIndex(s => s.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Store not found' };
        }
        mockStores[index] = { ...mockStores[index], ...storeData };
        return { success: true, data: mockStores[index] };
    },

    async delete(id) {
        await delay(500);
        const index = mockStores.findIndex(s => s.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Store not found' };
        }
        mockStores.splice(index, 1);
        return { success: true };
    }
};

// Coupon API
export const CouponAPI = {
    async getAll() {
        await delay(500);
        return { success: true, data: mockCoupons };
    },

    async getById(id) {
        await delay(300);
        const coupon = mockCoupons.find(c => c.id === parseInt(id));
        return coupon ? { success: true, data: coupon } : { success: false, error: 'Coupon not found' };
    },

    async create(couponData) {
        await delay(500);
        const newCoupon = {
            id: mockCoupons.length + 1,
            ...couponData,
            is_active: couponData.is_active !== undefined ? couponData.is_active : true,
            created_at: new Date().toISOString()
        };
        mockCoupons.push(newCoupon);
        return { success: true, data: newCoupon };
    },

    async update(id, couponData) {
        await delay(500);
        const index = mockCoupons.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Coupon not found' };
        }
        mockCoupons[index] = { ...mockCoupons[index], ...couponData };
        return { success: true, data: mockCoupons[index] };
    },

    async delete(id) {
        await delay(500);
        const index = mockCoupons.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Coupon not found' };
        }
        mockCoupons.splice(index, 1);
        return { success: true };
    }
};

// Category API
export const CategoryAPI = {
    async getAll() {
        await delay(500);
        return { success: true, data: mockCategories };
    },

    async getById(id) {
        await delay(300);
        const category = mockCategories.find(c => c.id === parseInt(id));
        return category ? { success: true, data: category } : { success: false, error: 'Category not found' };
    },

    async create(categoryData) {
        await delay(500);
        const newCategory = {
            id: mockCategories.length + 1,
            ...categoryData,
            created_at: new Date().toISOString()
        };
        mockCategories.push(newCategory);
        return { success: true, data: newCategory };
    },

    async update(id, categoryData) {
        await delay(500);
        const index = mockCategories.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Category not found' };
        }
        mockCategories[index] = { ...mockCategories[index], ...categoryData };
        return { success: true, data: mockCategories[index] };
    },

    async delete(id) {
        await delay(500);
        const index = mockCategories.findIndex(c => c.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Category not found' };
        }
        mockCategories.splice(index, 1);
        return { success: true };
    }
};

// User API
export const UserAPI = {
    async getAll() {
        await delay(500);
        return { success: true, data: mockUsers };
    },

    async getById(id) {
        await delay(300);
        const user = mockUsers.find(u => u.id === parseInt(id));
        return user ? { success: true, data: user } : { success: false, error: 'User not found' };
    },

    async update(id, userData) {
        await delay(500);
        const index = mockUsers.findIndex(u => u.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'User not found' };
        }
        mockUsers[index] = { ...mockUsers[index], ...userData };
        return { success: true, data: mockUsers[index] };
    },

    async delete(id) {
        await delay(500);
        const index = mockUsers.findIndex(u => u.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'User not found' };
        }
        mockUsers.splice(index, 1);
        return { success: true };
    }
};

// Analytics API
export const AnalyticsAPI = {
    async getStats(timeRange = 30) {
        await delay(500);
        return {
            success: true,
            data: {
                totalRevenue: 234567,
                totalClicks: 45678,
                activeUsers: 12345,
                conversionRate: 3.24
            }
        };
    },

    async getRevenueTrend(timeRange = 30) {
        await delay(500);
        // Generate mock trend data
        const labels = [];
        const data = [];
        const today = new Date();
        for (let i = timeRange - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString());
            data.push(Math.floor(Math.random() * 5000) + 5000);
        }
        return { success: true, data: { labels, values: data } };
    }
};

// Image Upload API
export const ImageAPI = {
    async upload(file, entityType, entityId) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('entityType', entityType);
            if (entityId) {
                formData.append('entityId', entityId);
            }

            // Try to use real upload server first
            const uploadUrl = 'http://localhost:3000/api/upload';
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Convert relative URL to absolute URL
                    const imageUrl = result.data.url.startsWith('http') 
                        ? result.data.url 
                        : `http://localhost:3000${result.data.url}`;
                    return { 
                        success: true, 
                        data: { 
                            url: imageUrl,
                            filename: result.data.filename 
                        } 
                    };
                } else {
                    throw new Error(result.error || 'Upload failed');
                }
            } else {
                // If server is not running, fall back to mock
                console.warn('Upload server not available, using mock upload');
                await delay(500);
                const mockUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(file.name)}`;
                return { success: true, data: { url: mockUrl } };
            }
        } catch (error) {
            console.error('Upload error:', error);
            // Fall back to mock if server is not available
            console.warn('Upload server not available, using mock upload');
            await delay(500);
            const mockUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(file.name)}`;
            return { success: true, data: { url: mockUrl } };
        }
    }
};

// Product API
let mockProducts = [
    { 
        id: 1, 
        title: 'Discraft\'s Bro-D Roach with Dark Horse Stamp', 
        category: 'Sports', 
        price: 7.01, 
        original_price: 7.59,
        savings_amount: 0.58,
        savings_percent: 8,
        image_url: 'https://via.placeholder.com/200x200?text=Product',
        redirect_url: 'https://example.com/product/1?ref=harmonygear24',
        description: 'Discraft disc golf disc',
        is_active: true,
        created_at: '2024-01-10'
    },
    { 
        id: 2, 
        title: 'Beck/Arnley 180-0720 Crank Position Sensor', 
        category: 'Auto', 
        price: 14.81, 
        original_price: 16.82,
        savings_amount: 2.01,
        savings_percent: 12,
        image_url: 'https://via.placeholder.com/200x200?text=Product',
        redirect_url: 'https://example.com/product/2?ref=harmonygear24',
        description: 'Auto parts sensor',
        is_active: true,
        created_at: '2024-01-11'
    },
    { 
        id: 3, 
        title: 'The Story of Us with Morgan Freeman', 
        category: 'Entertainment', 
        price: 21.99, 
        original_price: 25.88,
        savings_amount: 3.89,
        savings_percent: 15,
        image_url: 'https://via.placeholder.com/200x200?text=Product',
        redirect_url: 'https://example.com/product/3?ref=harmonygear24',
        description: 'Documentary DVD',
        is_active: true,
        created_at: '2024-01-12'
    }
];

export const ProductAPI = {
    async getAll() {
        await delay(500);
        return { success: true, data: mockProducts };
    },

    async getById(id) {
        await delay(300);
        const product = mockProducts.find(p => p.id === parseInt(id));
        return product ? { success: true, data: product } : { success: false, error: 'Product not found' };
    },

    async create(productData) {
        await delay(500);
        const newProduct = {
            id: mockProducts.length + 1,
            ...productData,
            is_active: productData.is_active !== undefined ? productData.is_active : true,
            created_at: new Date().toISOString()
        };
        mockProducts.push(newProduct);
        return { success: true, data: newProduct };
    },

    async update(id, productData) {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Product not found' };
        }
        mockProducts[index] = { ...mockProducts[index], ...productData };
        return { success: true, data: mockProducts[index] };
    },

    async delete(id) {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            return { success: false, error: 'Product not found' };
        }
        mockProducts.splice(index, 1);
        return { success: true };
    }
};

// Export all APIs
export {
    StoreAPI,
    CouponAPI,
    CategoryAPI,
    UserAPI,
    AnalyticsAPI,
    ImageAPI,
    ProductAPI
};

// Also export as default for convenience
export default {
    StoreAPI,
    CouponAPI,
    CategoryAPI,
    UserAPI,
    AnalyticsAPI,
    ImageAPI,
    ProductAPI
};
