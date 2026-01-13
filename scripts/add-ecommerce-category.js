// Script to add E-commerce category to the database
// Run this in browser console on the admin categories page, or use it as a Node.js script

const categoryData = {
    name: 'E-commerce',
    slug: 'ecommerce',
    icon: '🛒',
    description: 'E-commerce platforms and online shopping',
    sort_order: 20
};

// For browser console usage:
async function addEcommerceCategory() {
    try {
        // Import the API (if running in browser)
        const { CategoryAPI } = await import('/admin/js/api-real.js');
        
        // Check if category already exists
        const allCategories = await CategoryAPI.getAll();
        if (allCategories.success && allCategories.data) {
            const exists = allCategories.data.some(c => c.slug === 'ecommerce');
            if (exists) {
                console.log('✅ E-commerce category already exists!');
                return;
            }
        }
        
        // Add category
        const result = await CategoryAPI.create(categoryData);
        if (result.success) {
            console.log('✅ E-commerce category added successfully!', result.data);
        } else {
            console.error('❌ Failed to add category:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// For Node.js usage (if needed):
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { categoryData, addEcommerceCategory };
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
    console.log('Run addEcommerceCategory() to add the E-commerce category');
}
