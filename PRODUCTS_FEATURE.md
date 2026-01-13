# Products (Top Price Drops) 功能说明

## 功能概述

为"Top Price Drops"功能创建了独立的产品管理页面，可以添加、编辑、删除产品。产品不关联店铺，直接展示商品信息。

## ✅ 已完成的功能

### 1. 后台管理页面 (`admin/products.html`)

#### 功能特点
- ✅ 完整的产品CRUD功能（增删改查）
- ✅ 产品图片上传功能
- ✅ 分类管理
- ✅ 搜索和筛选功能
- ✅ 价格和节省金额自动计算

#### 产品字段
1. **Product Title（产品标题）** - 必填
2. **Category（分类）** - 必填，从分类列表选择
3. **Price（价格）** - 必填，当前售价
4. **Original Price（原价）** - 可选，用于计算节省金额
5. **Redirect/Purchase Link（跳转/购买链接）** - 必填，用户点击购买后跳转的链接
6. **Product Image（产品图片）** - 支持上传
7. **Description（描述）** - 可选
8. **Status（状态）** - Active/Inactive

#### 自动计算功能
- 如果填写了 Original Price，系统会自动计算：
  - `savings_amount` = original_price - price
  - `savings_percent` = (savings_amount / original_price) × 100

### 2. API 接口 (`admin/js/api.js`)

#### ProductAPI
- `getAll()` - 获取所有产品
- `getById(id)` - 获取单个产品
- `create(productData)` - 创建产品
- `update(id, productData)` - 更新产品
- `delete(id)` - 删除产品

### 3. 前端展示

#### 首页展示 (`index.html`)
- "Top Price Drops" 区域显示产品
- 每个产品卡片包含：
  - 产品图片
  - 产品标题
  - 价格
  - 节省金额和百分比
  - "View Product" 按钮（点击跳转到购买链接）

## 📝 使用说明

### 添加产品

1. 进入后台管理：http://localhost:8000/admin/login.html
2. 点击侧边栏的 "Products"
3. 点击 "Add Product" 按钮
4. 填写表单：
   - **Product Title**: 产品标题
   - **Category**: 选择分类
   - **Price**: 当前售价（如：29.99）
   - **Original Price**: 原价（如：39.99，可选）
   - **Redirect/Purchase Link**: 购买链接（必填）
   - **Product Image**: 上传产品图片
   - **Description**: 产品描述（可选）
   - **Status**: Active/Inactive
5. 点击 "Add Product" 保存

### 编辑产品

1. 在产品列表中点击编辑按钮
2. 修改信息
3. 点击 "Update Product" 保存

### 删除产品

1. 在产品列表中点击删除按钮
2. 确认删除

## 🎯 产品数据结构

```javascript
{
    id: 1,
    title: "Product Title",
    category: "Electronics",
    price: 29.99,
    original_price: 39.99,  // 可选
    savings_amount: 10.00,   // 自动计算
    savings_percent: 25,     // 自动计算
    image_url: "/uploads/product-image.jpg",
    redirect_url: "https://store.com/product?ref=harmonygear24",
    description: "Product description",
    is_active: true,
    created_at: "2024-01-13T10:00:00Z"
}
```

## 🔄 前端集成

### 首页展示

在 `index.html` 的 "Top Price Drops" 区域，产品会动态显示：

```javascript
// 在实际应用中，从API加载产品
async function loadProducts() {
    const response = await fetch('/api/products?limit=6&sort=price_drop');
    const products = await response.json();
    
    products.forEach(product => {
        // 创建产品卡片
        const card = createProductCard(product);
        // 绑定跳转事件
        card.querySelector('.product-btn').onclick = () => 
            redirectToProduct(product.redirect_url);
    });
}
```

### 跳转功能

产品卡片上的 "View Product" 按钮会调用：

```javascript
function redirectToProduct(redirectUrl) {
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
}
```

## 📊 数据库设计

```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    savings_amount DECIMAL(10,2),
    savings_percent INT,
    image_url VARCHAR(500),
    redirect_url VARCHAR(500) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## 🎨 前端展示样式

产品卡片显示：
- **Badge**: "Best Price" 或 "Good Deal"（根据节省百分比）
- **产品图片**: 200x200 像素
- **产品标题**: 完整标题
- **价格**: 当前价格（大号字体）
- **节省信息**: "Save X% ($Y.YY)"
- **按钮**: "View Product"（点击跳转）

## 📝 注意事项

1. **不关联店铺**: 产品是独立的，不关联到任何店铺
2. **分类必填**: 每个产品必须选择一个分类
3. **跳转链接必填**: 用户点击购买必须跳转到指定链接
4. **图片上传**: 支持拖拽上传，最大5MB
5. **价格计算**: 如果填写原价，系统会自动计算节省金额

## 🚀 后续优化建议

1. **批量导入**: 支持CSV批量导入产品
2. **价格跟踪**: 自动跟踪价格变化
3. **库存状态**: 添加库存状态（有货/缺货）
4. **多图片**: 支持产品多图展示
5. **产品详情页**: 创建独立的产品详情页面
6. **价格历史**: 记录价格变化历史
7. **推荐算法**: 根据用户浏览历史推荐产品

## 📁 相关文件

- `admin/products.html` - 产品管理页面
- `admin/js/api.js` - ProductAPI 接口
- `js/redirect.js` - 跳转工具函数
- `index.html` - 首页产品展示区域
