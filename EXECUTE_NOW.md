# 🚀 立即执行的详细步骤

## ⚠️ 重要提示

由于某些操作需要浏览器交互，我会告诉你每一步该做什么，你按照步骤执行即可。

---

## 第一步：登录 Cloudflare（必须）

### 执行命令：

```bash
cd /Users/mac/Desktop/coupon-website
npm run wrangler -- login
```

### 详细操作：

1. **执行命令后**：
   - 浏览器会自动打开 Cloudflare 登录页面
   - 如果没有自动打开，会显示一个链接，复制到浏览器打开

2. **在浏览器中**：
   - 登录你的 Cloudflare 账号
   - 点击 **Allow** 或 **Authorize** 授权
   - 等待页面显示 "Successfully logged in"

3. **返回终端**：
   - 应该看到 "Successfully logged in" 或类似消息
   - 如果看到错误，告诉我具体错误信息

### 预期结果：

```
✅ Successfully logged in.
```

---

## 第二步：创建 D1 数据库

### 执行命令：

```bash
npm run wrangler -- d1 create coupon-db
```

### 详细操作：

1. **执行命令后**：
   - 等待几秒钟
   - 会返回数据库信息

2. **重要：复制 database_id**
   - 会显示类似这样的信息：
   ```
   [[d1_databases]]
   binding = "DB"
   database_name = "coupon-db"
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```
   - **复制这个 database_id**，稍后需要用到

### 预期结果：

```
✅ Successfully created DB 'coupon-db'!

[[d1_databases]]
binding = "DB"
database_name = "coupon-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## 第三步：初始化数据库表

### 执行命令：

```bash
npm run wrangler -- d1 execute coupon-db --file=./schema.sql
```

### 详细操作：

1. **执行命令后**：
   - 会读取 `schema.sql` 文件
   - 在数据库中创建所有表
   - 可能需要几秒钟

2. **检查结果**：
   - 应该看到 "Successfully executed" 消息
   - 如果看到错误，告诉我具体错误信息

### 预期结果：

```
✅ Successfully executed 15 commands
```

---

## 第四步：验证表创建成功

### 执行命令：

```bash
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 预期结果：

应该看到 8 个表：
- users
- stores
- coupons
- categories
- user_cashback
- coupon_usage
- products
- admin_users

---

## 第五步：生成 JWT_SECRET

### 执行命令：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 详细操作：

1. **执行命令后**：
   - 会生成一个随机字符串（64 个字符）
   - **复制这个字符串**，稍后需要用到

### 预期结果：

```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## 第六步：更新 wrangler.toml

### 操作：

1. **打开文件**：`wrangler.toml`

2. **更新以下内容**：

```toml
name = "coupon-api"
main = "workers/api.js"
compatibility_date = "2024-01-01"

# D1 database binding
[[d1_databases]]
binding = "DB"
database_name = "coupon-db"
database_id = "这里填入第二步复制的database_id"  # ⬅️ 替换这里

# R2 bucket binding
[[r2_buckets]]
binding = "COUPON_IMAGES"
bucket_name = "coupon-images"

# Environment variables
[vars]
R2_PUBLIC_URL = "https://pub-xxxxx.r2.dev"  # 稍后配置 R2 后更新
JWT_SECRET = "这里填入第五步生成的密钥"  # ⬅️ 替换这里
```

3. **保存文件**

---

## 第七步：安装 JWT 库

### 执行命令：

```bash
npm install @tsndr/cloudflare-worker-jwt
```

### 预期结果：

```
+ @tsndr/cloudflare-worker-jwt@2.0.0
added 1 package
```

---

## 📝 完成以上步骤后

**告诉我：**
1. ✅ 每一步是否成功
2. ❌ 如果有任何错误，告诉我具体错误信息
3. 📋 你复制的 `database_id` 和 `JWT_SECRET`（可以私信我，或稍后我会帮你配置）

**然后我会帮你：**
1. 创建完整的 API Worker 代码
2. 创建认证系统
3. 更新前端代码
4. 创建管理员账号脚本
5. 测试所有功能

---

## 🎯 快速命令清单

按顺序执行：

```bash
# 1. 登录
npm run wrangler -- login

# 2. 创建数据库
npm run wrangler -- d1 create coupon-db

# 3. 初始化表
npm run wrangler -- d1 execute coupon-db --file=./schema.sql

# 4. 验证表
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# 5. 生成密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 6. 安装 JWT 库
npm install @tsndr/cloudflare-worker-jwt
```

---

## ⚠️ 遇到问题？

**如果任何步骤失败：**
1. 复制完整的错误信息
2. 告诉我你在哪一步
3. 我会帮你解决

**现在开始第一步：执行登录命令！** 🚀
