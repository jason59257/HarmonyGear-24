# 调试 Token 权限问题

## 问题
导入分类时出现 403 Forbidden 错误，说明 token 中的 role 不是 'admin'。

## 调试步骤

### 1. 检查当前 Token

在浏览器控制台运行：

```javascript
// 获取 token
const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
console.log('Token:', token);

// 解码 token（JWT 格式：header.payload.signature）
if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
        // 解码 payload（第二部分）
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token payload:', payload);
        console.log('Role in token:', payload.role);
        console.log('Email in token:', payload.email);
    }
}
```

### 2. 检查 Token 中的 Role

如果 `payload.role` 不是 `'admin'`，需要重新登录。

### 3. 重新登录

如果 role 不对，请：
1. 清除所有认证信息
2. 重新登录

在控制台运行：

```javascript
// 清除认证信息
localStorage.clear();

// 跳转到登录页面
window.location.href = '/admin/login.html';
```

然后使用管理员账号登录：
- Email: `admin@harmonygear24.com`
- Password: `admin123`

### 4. 验证登录后的 Token

登录后，再次运行步骤 1 的代码，检查 `payload.role` 应该是 `'admin'`。

---

## 如果问题仍然存在

可能是 API Worker 的问题。请检查：
1. `wrangler.toml` 中的 `JWT_SECRET` 是否正确
2. API Worker 是否正确部署
3. Token 验证逻辑是否正确
