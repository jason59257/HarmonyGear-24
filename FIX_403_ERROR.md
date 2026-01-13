# 修复 403 Forbidden 错误

## 问题
导入分类时出现 403 Forbidden 错误，说明当前 token 没有 admin 权限。

## 解决方案

### 步骤 1：检查当前 Token 的 Role

在浏览器控制台（F12）运行：

```javascript
// 检查 token 中的 role
const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token Role:', payload.role);
        console.log('Token Email:', payload.email);
        console.log('Full Payload:', payload);
        
        if (payload.role !== 'admin') {
            console.error('❌ Token role is not "admin"! Current role:', payload.role);
            console.log('→ Solution: Please logout and login again with admin account');
        } else {
            console.log('✅ Token role is correct');
        }
    }
} else {
    console.error('❌ No token found!');
}
```

### 步骤 2：重新登录（推荐）

如果 role 不是 'admin'，请重新登录：

```javascript
// 清除所有认证信息
localStorage.clear();

// 跳转到登录页面
window.location.href = '/admin/login.html';
```

然后使用**管理员账号**登录：
- **Email**: `admin@harmonygear24.com`
- **Password**: `admin123`

### 步骤 3：验证登录成功

登录后，再次运行步骤 1 的代码，确认 `payload.role` 是 `'admin'`。

### 步骤 4：重新尝试导入

确认 role 正确后，再次点击导入按钮。

---

## 如果问题仍然存在

可能是以下原因：

1. **Token 过期**：Token 有效期是 7 天，如果过期需要重新登录
2. **API Worker 配置问题**：检查 `wrangler.toml` 中的 `JWT_SECRET` 是否正确
3. **Token 生成问题**：检查登录时是否正确生成了 admin token

---

## 快速修复脚本

在控制台运行这个完整检查：

```javascript
// 完整检查和修复
async function checkAndFix() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    
    if (!token) {
        console.error('❌ No token found. Please login.');
        localStorage.clear();
        window.location.href = '/admin/login.html';
        return;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
        console.error('❌ Invalid token format');
        return;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('Current token role:', payload.role);
    
    if (payload.role !== 'admin') {
        console.error('❌ Token role is not "admin". Clearing and redirecting to login...');
        localStorage.clear();
        setTimeout(() => {
            window.location.href = '/admin/login.html';
        }, 1000);
    } else {
        console.log('✅ Token is valid with admin role');
        console.log('You can now try importing categories again.');
    }
}

checkAndFix();
```
