# 跳转链接功能总结

## ✅ 已完成

### 1. 后台管理功能

#### Stores（商店）
- ✅ 添加了 **Redirect/Affiliate Link** 字段（必填）
- ✅ 表单验证：确保是有效的URL
- ✅ 数据保存：redirect_url 保存到数据库

#### Coupons（优惠券）
- ✅ 添加了 **Redirect/Affiliate Link** 字段（必填）
- ✅ 表单验证：确保是有效的URL
- ✅ 数据保存：redirect_url 保存到数据库

### 2. 前端跳转功能

#### JavaScript 工具函数
- ✅ `js/redirect.js` - 创建了跳转工具函数
  - `redirectToStore()` - 商店跳转
  - `redirectToCoupon()` - 优惠券跳转
  - `copyCodeAndRedirect()` - 复制代码并跳转

#### 页面更新
- ✅ `coupon-detail.html` - 更新"去购物"按钮
- ✅ `coupons.html` - 更新优惠券卡片按钮
- ✅ `stores.html` - 添加跳转功能示例

### 3. API 更新
- ✅ `admin/js/api.js` - 更新模拟数据，包含 redirect_url 字段

## 📝 使用说明

### 后台添加商店时

1. 填写 **Website URL**（商店官网，用于展示）
2. 填写 **Redirect/Affiliate Link**（用户点击后跳转的链接，必填）
   - 示例：`https://amazon.com/?ref=harmonygear24&tag=your-tag-20`
3. 其他字段...

### 后台添加优惠券时

1. 填写优惠券信息
2. 填写 **Redirect/Affiliate Link**（用户领取优惠券后跳转的链接，必填）
   - 示例：`https://target.com/coupons/SAVE10?ref=harmonygear24&code=SAVE10`
3. 其他字段...

### 前端使用

#### 商店跳转
```javascript
redirectToStore('https://amazon.com/?ref=harmonygear24', 'Amazon');
```

#### 优惠券跳转（推荐）
```javascript
copyCodeAndRedirect('SAVE10', 'https://target.com/?code=SAVE10');
```

## 🔄 实际应用集成

当前前端页面是静态的，在实际应用中需要：

1. **从API加载数据**
   ```javascript
   const stores = await fetch('/api/stores').then(r => r.json());
   stores.forEach(store => {
       // 使用 store.redirect_url
   });
   ```

2. **动态绑定跳转事件**
   ```javascript
   card.onclick = () => redirectToStore(store.redirect_url, store.name);
   ```

3. **添加统计跟踪**
   ```javascript
   // 在跳转前发送统计事件
   gtag('event', 'store_click', { store_name: storeName });
   ```

## 📚 相关文档

- `REDIRECT_FEATURE.md` - 详细功能说明
- `js/redirect.js` - 跳转工具函数源码

## 🎯 下一步建议

1. 在实际应用中，将所有商店和优惠券卡片改为从API动态加载
2. 添加点击统计功能
3. 测试所有跳转链接
4. 考虑添加链接有效性检查
