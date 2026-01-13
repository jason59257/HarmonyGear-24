# 添加 E-commerce 分类

## 方法 1：通过后台界面添加（推荐）

1. 登录后台管理系统
2. 进入 **Categories** 页面
3. 点击 **"+ Add Category"** 按钮
4. 填写以下信息：
   - **Category Name**: `E-commerce`
   - **Slug**: `ecommerce`
   - **Description**: `E-commerce platforms and online shopping`
   - **Sort Order**: `20`
5. 点击 **Save** 保存

## 方法 2：通过浏览器控制台添加

1. 登录后台管理系统
2. 进入 **Categories** 页面
3. 打开浏览器开发者工具（F12 或 Cmd+Option+I）
4. 切换到 **Console** 标签
5. 复制并运行以下代码：

```javascript
(async function() {
    const { CategoryAPI } = await import('/admin/js/api-real.js');
    
    const categoryData = {
        name: 'E-commerce',
        slug: 'ecommerce',
        description: 'E-commerce platforms and online shopping',
        sort_order: 20
    };
    
    // Check if already exists
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
        alert('E-commerce category added successfully! Please refresh the page.');
        location.reload();
    } else {
        console.error('❌ Failed to add category:', result.error);
        alert('Failed to add category: ' + result.error);
    }
})();
```

## 完成

添加完成后：
- ✅ 前端分类下拉菜单中会显示 "E-commerce"
- ✅ 可以通过 `category.html?cat=ecommerce` 访问该分类页面
- ✅ 后台 Categories 页面会显示该分类
