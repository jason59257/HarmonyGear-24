# 跳转链接功能说明

## 功能概述

为 Stores（商店）和 Coupons（优惠券）添加了跳转链接功能，用户点击商店或领取优惠券后，会跳转到指定的购买页面（通常是联盟营销链接）。

## 已实现的功能

### 1. 后台管理 - Stores（商店）

#### 新增字段
- **Redirect/Affiliate Link（跳转/联盟链接）** - 必填字段
- 用户点击商店后跳转的链接
- 通常包含联盟营销参数（如 `?ref=harmonygear24`）

#### 使用方式
1. 进入后台管理：http://localhost:8000/admin/login.html
2. 进入 "Stores" 页面
3. 添加或编辑商店时，填写：
   - **Website URL**: 商店官网（用于展示）
   - **Redirect/Affiliate Link**: 用户点击后跳转的链接（必填）
   - 其他字段...

#### 示例
```
Website URL: https://amazon.com
Redirect/Affiliate Link: https://amazon.com/?ref=harmonygear24&tag=harmonygear-20
```

### 2. 后台管理 - Coupons（优惠券）

#### 新增字段
- **Redirect/Affiliate Link（跳转/联盟链接）** - 必填字段
- 用户领取优惠券后跳转的链接
- 通常包含优惠码和联盟参数

#### 使用方式
1. 进入后台管理：http://localhost:8000/admin/login.html
2. 进入 "Coupons" 页面
3. 添加或编辑优惠券时，填写：
   - **Redirect/Affiliate Link**: 用户领取优惠券后跳转的链接（必填）
   - 其他字段...

#### 示例
```
Redirect/Affiliate Link: https://target.com/coupons/SAVE10?ref=harmonygear24&code=SAVE10
```

## 前端跳转实现

### JavaScript 函数

已创建 `js/redirect.js` 文件，包含以下函数：

#### 1. `redirectToStore(redirectUrl, storeName)`
跳转到商店的购买页面

```javascript
redirectToStore('https://amazon.com/?ref=harmonygear24', 'Amazon');
```

#### 2. `redirectToCoupon(redirectUrl, couponCode, couponId)`
跳转到优惠券的购买页面

```javascript
redirectToCoupon('https://target.com/?code=SAVE10', 'SAVE10', '123');
```

#### 3. `copyCodeAndRedirect(code, redirectUrl)`
复制优惠码并跳转（推荐用于优惠券）

```javascript
copyCodeAndRedirect('SAVE10', 'https://target.com/?code=SAVE10');
```

### 前端页面集成

#### Stores 页面（stores.html）

在商店卡片上添加点击事件：

```html
<!-- 方式1: 使用 onclick -->
<div class="store-card" onclick="redirectToStore('https://amazon.com/?ref=harmonygear24', 'Amazon')">
    <!-- 商店内容 -->
</div>

<!-- 方式2: 使用 data 属性（推荐） -->
<div class="store-card" 
     data-redirect-url="https://amazon.com/?ref=harmonygear24"
     data-store-name="Amazon"
     onclick="redirectToStore(this.dataset.redirectUrl, this.dataset.storeName)">
    <!-- 商店内容 -->
</div>
```

#### Coupons 页面（coupons.html）

在优惠券卡片上添加点击事件：

```html
<!-- 复制代码并跳转 -->
<button class="btn btn-primary" 
        onclick="copyCodeAndRedirect('SAVE10', 'https://target.com/?code=SAVE10')">
    复制代码并去购物
</button>
```

#### Coupon Detail 页面（coupon-detail.html）

已更新"去购物"按钮：

```html
<button class="btn btn-primary btn-large" 
        onclick="copyCodeAndRedirect('SAVE10', 'https://target.com/?code=SAVE10')">
    去购物
</button>
```

## 数据库字段

### Stores 表
```sql
ALTER TABLE stores ADD COLUMN redirect_url VARCHAR(500) NOT NULL AFTER website_url;
```

### Coupons 表
```sql
ALTER TABLE coupons ADD COLUMN redirect_url VARCHAR(500) NOT NULL AFTER discount_value;
```

## 实际使用建议

### 1. 动态加载数据

在实际应用中，应该从API动态加载商店和优惠券数据：

```javascript
// 加载商店列表
async function loadStores() {
    const response = await fetch('/api/stores');
    const stores = await response.json();
    
    stores.forEach(store => {
        // 创建商店卡片，使用 store.redirect_url
        const card = createStoreCard(store);
        card.onclick = () => redirectToStore(store.redirect_url, store.name);
    });
}

// 加载优惠券列表
async function loadCoupons() {
    const response = await fetch('/api/coupons');
    const coupons = await response.json();
    
    coupons.forEach(coupon => {
        // 创建优惠券卡片，使用 coupon.redirect_url
        const card = createCouponCard(coupon);
        card.querySelector('.btn-primary').onclick = () => 
            copyCodeAndRedirect(coupon.code, coupon.redirect_url);
    });
}
```

### 2. 统计跟踪

可以在跳转函数中添加统计代码：

```javascript
function redirectToStore(redirectUrl, storeName) {
    // 发送统计事件
    if (typeof gtag !== 'undefined') {
        gtag('event', 'store_click', {
            'store_name': storeName,
            'redirect_url': redirectUrl
        });
    }
    
    // 跳转
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
}
```

### 3. 联盟链接格式

常见的联盟链接格式：

```
Amazon: https://amazon.com/?tag=your-tag-20
Target: https://target.com/?ref=your-ref
CJ Affiliate: https://www.anrdoezrs.net/links/your-id
ShareASale: https://www.shareasale.com/r.cfm?u=your-id&m=merchant-id
```

### 4. URL 参数

可以在跳转链接中添加参数来跟踪来源：

```
https://store.com/?ref=harmonygear24&source=coupon&coupon_id=123
https://store.com/?ref=harmonygear24&source=store&store_id=456
```

## 测试

### 测试商店跳转
1. 在后台添加商店，填写 redirect_url
2. 访问商店列表页面
3. 点击商店卡片
4. 应该在新标签页打开 redirect_url

### 测试优惠券跳转
1. 在后台添加优惠券，填写 redirect_url
2. 访问优惠券列表或详情页
3. 点击"去购物"或"复制代码并去购物"按钮
4. 应该先复制代码，然后在新标签页打开 redirect_url

## 注意事项

1. **安全性**: 确保 redirect_url 是有效的 URL，防止 XSS 攻击
2. **新标签页**: 使用 `window.open(..., '_blank')` 在新标签页打开，不影响用户浏览
3. **统计**: 建议添加点击统计，跟踪转化率
4. **联盟参数**: 确保联盟链接包含正确的跟踪参数
5. **测试**: 在生产环境部署前，测试所有跳转链接是否正常工作

## 文件更新清单

- ✅ `admin/stores.html` - 添加 redirect_url 字段
- ✅ `admin/coupons.html` - 添加 redirect_url 字段
- ✅ `admin/js/api.js` - 更新模拟数据，包含 redirect_url
- ✅ `js/redirect.js` - 创建跳转工具函数
- ✅ `coupon-detail.html` - 更新"去购物"按钮

## 下一步

在实际应用中，需要：
1. 更新前端页面，从API动态加载数据
2. 在所有商店和优惠券卡片上添加跳转功能
3. 添加点击统计
4. 测试所有跳转链接
