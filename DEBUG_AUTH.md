# 调试认证问题

## 问题
收到 `{"error": "Unauthorized", "success": false}` 错误。

## 调试步骤

### 步骤 1：检查 Token 是否存在

在浏览器控制台（F12）运行：

```javascript
// 检查所有认证相关的 localStorage
console.log('=== Authentication Debug ===');
console.log('authToken:', localStorage.getItem('authToken'));
console.log('adminToken:', localStorage.getItem('adminToken'));
console.log('adminLoggedIn:', localStorage.getItem('adminLoggedIn'));
console.log('adminEmail:', localStorage.getItem('adminEmail'));
```

**如果所有值都是 `null`，说明没有登录，需要重新登录。**

---

### 步骤 2：测试 API 调用

在浏览器控制台运行：

```javascript
// 测试 API 调用
async function testAPICall() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    
    if (!token) {
        console.error('❌ No token found! Please login first.');
        return;
    }
    
    console.log('Token found:', token.substring(0, 20) + '...');
    
    try {
        const response = await fetch('https://coupon-api.jason59257.workers.dev/api/categories', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            console.log('✅ API call successful!');
        } else {
            console.error('❌ API call failed:', data);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAPICall();
```

---

### 步骤 3：重新登录

如果 token 不存在或无效，请重新登录：

```javascript
// 清除所有认证信息
localStorage.clear();

// 跳转到登录页面
window.location.href = '/admin/login.html';
```

然后使用以下凭据登录：
- **Email**: `admin@harmonygear24.com`
- **Password**: `admin123`

---

### 步骤 4：验证登录成功

登录后，在控制台运行：

```javascript
// 检查登录后的 token
const token = localStorage.getItem('authToken');
if (token) {
    console.log('✅ Login successful! Token:', token.substring(0, 20) + '...');
} else {
    console.error('❌ Login failed - no token saved');
}
```

---

### 步骤 5：如果问题仍然存在

1. **检查 API Worker 是否正常运行**
   - 访问：`https://coupon-api.jason59257.workers.dev/api/admin/login`
   - 应该返回 JSON（可能需要 POST 请求）

2. **检查网络请求**
   - 打开浏览器开发者工具
   - 进入 Network 标签
   - 尝试访问 Categories 页面
   - 查看 `/api/categories` 请求
   - 检查 Request Headers 中是否有 `Authorization: Bearer ...`
   - 检查 Response 的内容

3. **检查 JWT Secret**
   - 确保 `wrangler.toml` 中的 `JWT_SECRET` 与创建 admin 用户时使用的 secret 一致

---

## 快速修复脚本

如果以上步骤都正常，但仍然有问题，运行这个完整测试：

```javascript
// 完整认证测试
async function fullAuthTest() {
    console.log('=== Full Authentication Test ===\n');
    
    // 1. 检查 token
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    if (!token) {
        console.error('❌ Step 1: No token found');
        console.log('→ Solution: Please login first');
        return;
    }
    console.log('✅ Step 1: Token found');
    
    // 2. 测试 token 格式
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        console.error('❌ Step 2: Invalid token format');
        return;
    }
    console.log('✅ Step 2: Token format valid');
    
    // 3. 测试 API 调用
    try {
        const response = await fetch('https://coupon-api.jason59257.workers.dev/api/categories', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Step 3: API call successful');
            console.log('Data:', data);
        } else {
            const error = await response.json();
            console.error('❌ Step 3: API call failed');
            console.error('Status:', response.status);
            console.error('Error:', error);
            
            if (response.status === 401) {
                console.log('→ Solution: Token expired or invalid. Please login again.');
                localStorage.clear();
                window.location.href = '/admin/login.html';
            }
        }
    } catch (error) {
        console.error('❌ Step 3: Network error');
        console.error('Error:', error);
    }
}

fullAuthTest();
```

---

## 常见问题

### Q: Token 存在但仍然 Unauthorized
**A**: Token 可能已过期。JWT token 默认有效期是 7 天。请重新登录。

### Q: 登录后立即出现 Unauthorized
**A**: 可能是 JWT_SECRET 不匹配。检查 `wrangler.toml` 中的配置。

### Q: 网络请求显示 401
**A**: 检查 Request Headers 中是否正确包含 `Authorization: Bearer <token>`

---

## 如果所有方法都失败

请提供以下信息：
1. 浏览器控制台的完整错误信息
2. Network 标签中 `/api/categories` 请求的详细信息
3. localStorage 中的 token 值（前 20 个字符）
