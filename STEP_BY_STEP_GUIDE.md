# 生产环境配置 - 详细步骤指南

本指南将详细说明每一步操作，从零开始配置生产环境。

---

## 📋 准备工作

### 检查工具

确保已安装以下工具：

```bash
# 检查 Node.js
node --version
# 应该显示 v16 或更高版本

# 检查 npm
npm --version

# 检查 Wrangler
wrangler --version
# 如果没有安装，执行：npm install -g wrangler
```

如果 Wrangler 未安装：
```bash
npm install -g wrangler
```

---

## 第一步：创建 Cloudflare D1 数据库

### 步骤 1.1: 登录 Cloudflare

```bash
# 在终端执行
wrangler login
```

**操作说明：**
1. 执行命令后，浏览器会自动打开
2. 点击 **Allow** 授权
3. 返回终端，看到 "Successfully logged in" 表示成功

**预期结果：**
```
Attempting to login via OAuth...
Opening a link in your browser...
Successfully logged in.
```

### 步骤 1.2: 创建 D1 数据库

```bash
# 在项目目录执行
cd /Users/mac/Desktop/coupon-website
wrangler d1 create coupon-db
```

**操作说明：**
1. 执行命令后，等待几秒钟
2. 会返回数据库信息，包括 `database_id`

**预期结果：**
```
✅ Successfully created DB 'coupon-db'!

[[d1_databases]]
binding = "DB"
database_name = "coupon-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**重要：** 复制 `database_id`，稍后会用到！

### 步骤 1.3: 查看数据库列表（验证）

```bash
wrangler d1 list
```

**预期结果：**
```
┌─────────────────────────────────────────────────────────────┐
│ name       │ id                                          │
├─────────────────────────────────────────────────────────────┤
│ coupon-db  │ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx        │
└─────────────────────────────────────────────────────────────┘
```

---

## 第二步：初始化数据库表结构

### 步骤 2.1: 确认 schema.sql 文件存在

```bash
# 检查文件是否存在
ls -la schema.sql
```

**预期结果：**
```
-rw-r--r--  1 mac  staff  3456 Jan 13 16:30 schema.sql
```

如果文件不存在，我已经创建了，应该存在。

### 步骤 2.2: 执行 SQL 创建表

```bash
# 执行 schema.sql 创建所有表
wrangler d1 execute coupon-db --file=./schema.sql
```

**操作说明：**
1. 这个命令会读取 `schema.sql` 文件
2. 在数据库中创建所有表
3. 可能需要几秒钟

**预期结果：**
```
✅ Successfully executed 15 commands
```

### 步骤 2.3: 验证表是否创建成功

```bash
# 查看所有表
wrangler d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**预期结果：**
```
┌─────────────────┐
│ name            │
├─────────────────┤
│ users           │
│ stores          │
│ coupons         │
│ categories      │
│ user_cashback   │
│ coupon_usage    │
│ products        │
│ admin_users     │
└─────────────────┘
```

如果看到这些表，说明创建成功！

---

## 第三步：配置 wrangler.toml

### 步骤 3.1: 查看当前的 wrangler.toml

```bash
cat wrangler.toml
```

### 步骤 3.2: 更新 wrangler.toml

编辑 `wrangler.toml` 文件，添加 D1 数据库配置：

```toml
name = "coupon-api"
main = "workers/api.js"
compatibility_date = "2024-01-01"

# D1 database binding
[[d1_databases]]
binding = "DB"
database_name = "coupon-db"
database_id = "你的database_id"  # 替换为步骤 1.2 中复制的 database_id

# R2 bucket binding (如果还没有创建，稍后添加)
[[r2_buckets]]
binding = "COUPON_IMAGES"
bucket_name = "coupon-images"

# Environment variables
[vars]
R2_PUBLIC_URL = "https://pub-xxxxx.r2.dev"  # 稍后配置 R2 后更新
JWT_SECRET = "生成一个随机密钥"  # 稍后生成
```

**重要：**
- 将 `database_id` 替换为步骤 1.2 中复制的实际 ID
- `JWT_SECRET` 稍后生成

### 步骤 3.3: 生成 JWT_SECRET

```bash
# 生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**操作说明：**
1. 执行命令后会生成一个随机字符串
2. 复制这个字符串
3. 更新到 `wrangler.toml` 的 `JWT_SECRET` 中

**预期结果：**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## 第四步：创建 R2 存储桶（图片存储）

### 步骤 4.1: 在 Cloudflare Dashboard 创建 R2 存储桶

1. **打开 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 登录你的账号

2. **进入 R2**
   - 左侧菜单点击 **R2**
   - 如果第一次使用，点击 **Get started**

3. **创建存储桶**
   - 点击 **Create bucket**
   - 输入名称：`coupon-images`
   - 选择位置（选择离你最近的区域）
   - 点击 **Create bucket**

### 步骤 4.2: 启用公共访问

1. **进入存储桶设置**
   - 点击存储桶 `coupon-images`
   - 点击 **Settings** 标签

2. **启用公共访问**
   - 找到 **Public Access** 部分
   - 点击 **Allow Access**
   - 复制显示的公共域名（例如：`https://pub-xxxxx.r2.dev`）

3. **更新 wrangler.toml**
   - 将 `R2_PUBLIC_URL` 更新为你的 R2 公共域名

### 步骤 4.3: 创建 R2 API Token（如果需要）

1. **创建 API Token**
   - R2 页面 → **Manage R2 API Tokens**
   - **Create API token**
   - 名称：`coupon-upload-token`
   - 权限：**Object Read & Write**
   - 存储桶：选择 `coupon-images`
   - 点击 **Create API Token**
   - **重要：** 复制 Access Key ID 和 Secret Access Key（只显示一次）

---

## 第五步：创建后端 API Worker

### 步骤 5.1: 安装依赖

```bash
# 在项目目录执行
cd /Users/mac/Desktop/coupon-website
npm init -y
npm install @tsndr/cloudflare-worker-jwt
```

**操作说明：**
1. `npm init -y` 会创建 `package.json`（如果还没有）
2. 安装 JWT 库用于认证

### 步骤 5.2: 创建认证工具文件

创建 `workers/auth.js`：

```bash
# 创建文件
touch workers/auth.js
```

然后我会帮你创建完整的代码。

### 步骤 5.3: 创建主 API Worker

创建 `workers/api.js`：

```bash
# 创建文件
touch workers/api.js
```

然后我会帮你创建完整的代码。

---

## 第六步：创建初始管理员账号

### 步骤 6.1: 创建管理员账号脚本

创建 `scripts/create-admin.js`：

```bash
mkdir -p scripts
touch scripts/create-admin.js
```

### 步骤 6.2: 执行脚本创建管理员

```bash
# 执行脚本（我会提供完整代码）
node scripts/create-admin.js
```

**操作说明：**
1. 脚本会提示输入管理员邮箱和密码
2. 密码会被哈希后存储到数据库
3. 创建成功后可以用于登录后台

---

## 第七步：部署 API Worker

### 步骤 7.1: 测试 Worker 配置

```bash
# 检查配置
wrangler whoami
```

**预期结果：**
```
👋 You are logged in as your-email@example.com
```

### 步骤 7.2: 部署 Worker

```bash
# 部署到 Cloudflare
wrangler deploy
```

**操作说明：**
1. 第一次部署可能需要 1-2 分钟
2. 部署成功后会显示 Worker URL

**预期结果：**
```
✨ Compiled Worker successfully
✨ Success!
Published coupon-api (X sec)
  https://coupon-api.your-username.workers.dev
```

**重要：** 复制这个 URL，稍后会用到！

---

## 第八步：更新前端代码

### 步骤 8.1: 更新 API 配置

编辑 `admin/js/config.js`：

```javascript
export const CONFIG = {
    // API 基础 URL（使用你的 Worker URL）
    API_BASE_URL: 'https://coupon-api.your-username.workers.dev',
    
    // 图片上传 Worker URL
    UPLOAD_WORKER_URL: 'https://coupon-upload-handler.your-username.workers.dev',
    
    // R2 公共 URL
    R2_PUBLIC_URL: 'https://pub-xxxxx.r2.dev',
    
    USE_MOCK_UPLOAD: false,
};
```

### 步骤 8.2: 更新 API 调用

更新 `admin/js/api.js`，将 Mock API 替换为真实 API 调用。

我会帮你创建完整的更新代码。

### 步骤 8.3: 更新登录页面

更新 `admin/login.html`，使用真实的登录 API。

---

## 第九步：测试所有功能

### 步骤 9.1: 测试用户注册

1. 访问前台注册页面
2. 输入邮箱和密码
3. 点击注册
4. 检查是否成功

### 步骤 9.2: 测试用户登录

1. 访问前台登录页面
2. 使用注册的账号登录
3. 检查是否成功

### 步骤 9.3: 测试管理员登录

1. 访问后台登录页面
2. 使用创建的管理员账号登录
3. 检查是否成功跳转到 Dashboard

### 步骤 9.4: 测试 CRUD 操作

1. **测试 Stores**
   - 添加商店
   - 编辑商店
   - 删除商店
   - 查看商店列表

2. **测试 Coupons**
   - 添加优惠券
   - 编辑优惠券
   - 删除优惠券
   - 查看优惠券列表

3. **测试图片上传**
   - 上传商店 Logo
   - 检查图片是否显示

---

## 第十步：数据迁移（可选）

### 步骤 10.1: 创建迁移脚本

创建 `scripts/migrate-data.js`，将 Mock 数据迁移到数据库。

### 步骤 10.2: 执行迁移

```bash
node scripts/migrate-data.js
```

---

## 📝 详细命令总结

### 一次性执行的命令

```bash
# 1. 登录 Cloudflare
wrangler login

# 2. 创建数据库
wrangler d1 create coupon-db

# 3. 初始化数据库表
wrangler d1 execute coupon-db --file=./schema.sql

# 4. 验证表创建
wrangler d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"

# 5. 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 6. 安装依赖
npm install @tsndr/cloudflare-worker-jwt

# 7. 部署 Worker
wrangler deploy
```

---

## ⚠️ 常见问题

### Q1: wrangler login 失败？

**A:** 
- 检查网络连接
- 尝试使用 `wrangler login --api-token`（需要先创建 API Token）

### Q2: 数据库创建失败？

**A:**
- 检查是否已登录：`wrangler whoami`
- 检查 Cloudflare 账号是否有 D1 访问权限

### Q3: SQL 执行失败？

**A:**
- 检查 `schema.sql` 文件是否存在
- 检查文件路径是否正确
- 查看错误信息

### Q4: Worker 部署失败？

**A:**
- 检查 `wrangler.toml` 配置是否正确
- 检查 `database_id` 是否正确
- 查看部署日志中的错误信息

---

## 🎯 下一步

完成以上步骤后，告诉我：
1. 哪一步完成了
2. 哪一步遇到问题
3. 需要我帮你创建哪些代码文件

我会根据你的进度继续帮你完成！
