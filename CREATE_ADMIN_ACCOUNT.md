# 创建管理员账号

## 📋 步骤

### 方法 1: 使用脚本（推荐）

1. **运行脚本**：
   ```bash
   cd /Users/mac/Desktop/coupon-website
   node scripts/create-admin.js
   ```

2. **输入信息**：
   - Admin email: 输入管理员邮箱（例如：admin@harmonygear24.com）
   - Admin password: 输入管理员密码
   - Admin name: 输入管理员名称（可选）

3. **复制生成的 SQL 命令**

4. **执行 SQL**：
   ```bash
   npm run wrangler -- d1 execute harmonygear24 --command="INSERT INTO admin_users (email, password_hash, name, role) VALUES ('你的邮箱', '生成的密码哈希', '你的名字', 'admin');" --remote
   ```

### 方法 2: 直接执行 SQL

1. **生成密码哈希**：
   ```bash
   node -e "console.log(require('crypto').createHash('sha256').update('你的密码').digest('hex'))"
   ```

2. **执行 SQL**（替换邮箱、密码哈希和名字）：
   ```bash
   npm run wrangler -- d1 execute harmonygear24 --command="INSERT INTO admin_users (email, password_hash, name, role) VALUES ('admin@harmonygear24.com', '生成的密码哈希', 'Admin User', 'admin');" --remote
   ```

---

## ✅ 验证管理员账号

执行以下命令查看管理员列表：

```bash
npm run wrangler -- d1 execute harmonygear24 --command="SELECT id, email, name, role FROM admin_users;" --remote
```

应该看到你刚创建的管理员账号。

---

## 🎯 完成后

使用创建的管理员邮箱和密码登录后台系统！
