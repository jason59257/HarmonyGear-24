# 修复认证错误指南

## 问题
如果遇到 "Failed to load categories: Unauthorized" 错误，可能是以下原因：

1. **Token 过期**：登录 token 已过期
2. **Token 丢失**：localStorage 中的 token 被清除
3. **Token 名称不匹配**：使用了错误的 token 名称

## 解决方案

### 方法一：重新登录（推荐）

1. **退出登录**
   - 点击后台右上角的 "Logout" 按钮
   - 或清除浏览器缓存和 localStorage

2. **重新登录**
   - 访问 `/admin/login.html`
   - 使用管理员账号登录：
     - Email: `admin@harmonygear24.com`
     - Password: `admin123`

3. **验证登录**
   - 登录成功后，应该会自动跳转到 Dashboard
   - 检查浏览器控制台（F12）确认没有错误

### 方法二：检查 Token

1. **打开浏览器控制台**（F12）
2. **检查 localStorage**
   ```javascript
   console.log('authToken:', localStorage.getItem('authToken'));
   console.log('adminToken:', localStorage.getItem('adminToken'));
   console.log('adminLoggedIn:', localStorage.getItem('adminLoggedIn'));
   ```

3. **如果 token 存在但仍有错误**
   - 可能是 token 已过期
   - 重新登录获取新 token

### 方法三：清除并重新登录

在浏览器控制台运行：

```javascript
// 清除所有认证信息
localStorage.removeItem('authToken');
localStorage.removeItem('adminToken');
localStorage.removeItem('adminLoggedIn');
localStorage.removeItem('adminEmail');

// 跳转到登录页面
window.location.href = '/admin/login.html';
```

然后重新登录。

---

## 已修复的问题

1. ✅ **Token 名称兼容性**：现在支持 `authToken` 和 `adminToken` 两种名称
2. ✅ **自动重定向**：如果 token 过期，会自动跳转到登录页面
3. ✅ **错误处理**：更好的错误提示和自动处理

---

## 如果问题仍然存在

1. **检查 API Worker 是否正常运行**
   - 访问：`https://coupon-api.jason59257.workers.dev/api/categories`
   - 应该返回 JSON 响应（可能需要认证）

2. **检查网络连接**
   - 确保可以访问 Cloudflare Workers

3. **检查浏览器控制台**
   - 查看完整的错误信息
   - 检查网络请求的响应

4. **联系支持**
   - 提供完整的错误信息
   - 包括浏览器控制台的截图

---

## 预防措施

- **定期重新登录**：如果长时间未使用，建议重新登录
- **不要清除 localStorage**：除非遇到问题，否则不要手动清除
- **使用同一个浏览器**：避免在不同浏览器间切换导致 token 丢失
