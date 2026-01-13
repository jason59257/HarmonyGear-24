// Script to add all categories from homepage to database
// Run this in browser console on the admin categories page

const categories = [
    { name: 'Travel & Vacations', slug: 'travel', icon: '✈️', description: 'Travel deals and vacation packages', sort_order: 1 },
    { name: 'Clothing', slug: 'clothing', icon: '👕', description: 'Fashion and apparel', sort_order: 2 },
    { name: 'Beauty & Wellness', slug: 'beauty', icon: '💄', description: 'Beauty products and wellness services', sort_order: 3 },
    { name: 'Accessories', slug: 'accessories', icon: '👜', description: 'Fashion accessories', sort_order: 4 },
    { name: 'Auto & Tires', slug: 'auto', icon: '🚗', description: 'Automotive and tire deals', sort_order: 5 },
    { name: 'Baby & Toddler', slug: 'baby', icon: '👶', description: 'Baby and toddler products', sort_order: 6 },
    { name: 'Banking & Finance Tools', slug: 'banking', icon: '💳', description: 'Banking and financial services', sort_order: 7 },
    { name: 'Business Supplies & Services', slug: 'business', icon: '💼', description: 'Business supplies and services', sort_order: 8 },
    { name: 'Digital Services & Streaming', slug: 'digital', icon: '📱', description: 'Digital services and streaming platforms', sort_order: 9 },
    { name: 'Electronics', slug: 'electronics', icon: '📺', description: 'Electronics and tech products', sort_order: 10 },
    { name: 'Events & Entertainment', slug: 'events', icon: '🎭', description: 'Events and entertainment tickets', sort_order: 11 },
    { name: 'Food, Drinks & Restaurants', slug: 'food', icon: '🍔', description: 'Food, drinks and restaurant deals', sort_order: 12 },
    { name: 'Gifts, Flowers & Parties', slug: 'gifts', icon: '🎁', description: 'Gifts, flowers and party supplies', sort_order: 13 },
    { name: 'Home & Garden', slug: 'home', icon: '🏠', description: 'Home and garden products', sort_order: 14 },
    { name: 'Pets', slug: 'pets', icon: '🐾', description: 'Pet supplies and services', sort_order: 15 },
    { name: 'Shoes', slug: 'shoes', icon: '👟', description: 'Footwear and shoes', sort_order: 16 },
    { name: 'Sports, Outdoors & Fitness', slug: 'sports', icon: '⚽', description: 'Sports, outdoor and fitness equipment', sort_order: 17 },
    { name: 'Subscription Boxes & Services', slug: 'subscription', icon: '📦', description: 'Subscription boxes and services', sort_order: 18 },
    { name: 'Toys & Games', slug: 'toys', icon: '🎮', description: 'Toys and games', sort_order: 19 }
];

// Function to add all categories
async function addAllCategories() {
    const { CategoryAPI } = await import('/admin/js/api-real.js');
    
    console.log('Starting to add categories...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const category of categories) {
        try {
            const result = await CategoryAPI.create(category);
            if (result.success) {
                console.log(`✅ Added: ${category.name}`);
                successCount++;
            } else {
                console.error(`❌ Failed to add ${category.name}:`, result.error);
                errorCount++;
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`❌ Error adding ${category.name}:`, error);
            errorCount++;
        }
    }
    
    console.log(`\n✅ Completed! Success: ${successCount}, Errors: ${errorCount}`);
    alert(`Categories added! Success: ${successCount}, Errors: ${errorCount}`);
}

// Export for use in browser console
window.addAllCategories = addAllCategories;

console.log('Category import script loaded. Run addAllCategories() to import all categories.');
