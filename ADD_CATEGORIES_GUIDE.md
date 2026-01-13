# 添加主页类别到后台系统

## 方法一：使用脚本批量添加（推荐）

1. **打开后台 Categories 页面**
   - 登录后台系统
   - 进入 Categories 页面
   - 打开浏览器控制台（F12）

2. **运行脚本**
   - 在控制台中运行以下代码：

```javascript
// 导入脚本
const script = document.createElement('script');
script.src = '/scripts/add-categories.js';
document.head.appendChild(script);

// 等待脚本加载后运行
setTimeout(() => {
    if (window.addAllCategories) {
        addAllCategories();
    } else {
        console.error('Script not loaded. Please check the path.');
    }
}, 1000);
```

或者直接复制以下代码到控制台：

```javascript
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
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`❌ Error adding ${category.name}:`, error);
            errorCount++;
        }
    }
    
    console.log(`\n✅ Completed! Success: ${successCount}, Errors: ${errorCount}`);
    alert(`Categories added! Success: ${successCount}, Errors: ${errorCount}`);
}

addAllCategories();
```

3. **等待完成**
   - 脚本会自动添加所有 19 个类别
   - 完成后会显示成功和错误的数量
   - 刷新页面查看结果

---

## 方法二：手动添加

1. **进入 Categories 页面**
2. **点击 "Add Category" 按钮**
3. **逐个添加每个类别**

---

## 类别列表

主页中包含以下 19 个类别：

1. Travel & Vacations (travel) ✈️
2. Clothing (clothing) 👕
3. Beauty & Wellness (beauty) 💄
4. Accessories (accessories) 👜
5. Auto & Tires (auto) 🚗
6. Baby & Toddler (baby) 👶
7. Banking & Finance Tools (banking) 💳
8. Business Supplies & Services (business) 💼
9. Digital Services & Streaming (digital) 📱
10. Electronics (electronics) 📺
11. Events & Entertainment (events) 🎭
12. Food, Drinks & Restaurants (food) 🍔
13. Gifts, Flowers & Parties (gifts) 🎁
14. Home & Garden (home) 🏠
15. Pets (pets) 🐾
16. Shoes (shoes) 👟
17. Sports, Outdoors & Fitness (sports) ⚽
18. Subscription Boxes & Services (subscription) 📦
19. Toys & Games (toys) 🎮

---

## 注意事项

- 如果类别已存在（相同的 slug），可能会报错
- 可以手动删除重复的类别，然后重新添加
- 编辑和删除功能现在已完全可用
