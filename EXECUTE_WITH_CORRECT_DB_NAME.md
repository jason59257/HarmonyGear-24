# 使用正确的数据库名称执行命令

## ✅ 数据库名称已更新

你的数据库名称是：`harmonygear24`

我已经更新了 `wrangler.toml` 文件，使用正确的数据库名称。

---

## 📋 接下来的步骤

### 第一步：获取 database_id

在终端中执行（确保在项目目录）：

```bash
cd /Users/mac/Desktop/coupon-website
npm run wrangler -- d1 list
```

**预期结果：**
```
┌─────────────────────────────────────────────────────────────┐
│ name          │ id                                          │
├─────────────────────────────────────────────────────────────┤
│ harmonygear24 │ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx        │
└─────────────────────────────────────────────────────────────┘
```

**重要：** 复制 `id` 列的值（database_id）

---

### 第二步：更新 wrangler.toml

1. **打开文件**：`wrangler.toml`

2. **找到这一行**：
   ```toml
   database_id = "YOUR_DATABASE_ID_HERE"
   ```

3. **替换为你的 database_id**：
   ```toml
   database_id = "你从第一步复制的database_id"
   ```

4. **保存文件**

---

### 第三步：生成 JWT_SECRET

在终端中执行：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**复制生成的密钥**（64个字符的字符串）

---

### 第四步：更新 JWT_SECRET

1. **打开文件**：`wrangler.toml`

2. **找到这一行**：
   ```toml
   JWT_SECRET = "YOUR_JWT_SECRET_HERE"
   ```

3. **替换为生成的密钥**：
   ```toml
   JWT_SECRET = "你从第三步生成的密钥"
   ```

4. **保存文件**

---

### 第五步：初始化数据库表（使用正确的数据库名称）

在终端中执行：

```bash
npm run wrangler -- d1 execute harmonygear24 --file=./schema.sql --remote
```

**注意：**
- 数据库名称改为：`harmonygear24`（不是 `coupon-db`）
- 添加了 `--remote` 参数

**预期结果：**
```
✅ Successfully executed 15 commands
```

---

### 第六步：验证表创建成功

```bash
npm run wrangler -- d1 execute harmonygear24 --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

**预期结果：**
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

## 📝 完整命令清单（使用正确的数据库名称）

```bash
# 1. 进入项目目录
cd /Users/mac/Desktop/coupon-website

# 2. 获取 database_id
npm run wrangler -- d1 list

# 3. 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. 更新 wrangler.toml（手动编辑文件，填入 database_id 和 JWT_SECRET）

# 5. 初始化数据库表（注意：使用 harmonygear24）
npm run wrangler -- d1 execute harmonygear24 --file=./schema.sql --remote

# 6. 验证表创建
npm run wrangler -- d1 execute harmonygear24 --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

---

## ⚠️ 重要提示

1. **数据库名称**：使用 `harmonygear24`（不是 `coupon-db`）
2. **添加 --remote**：因为数据库在 Cloudflare 云端
3. **确保在项目目录**：执行命令前先 `cd /Users/mac/Desktop/coupon-website`

---

## 🎯 现在开始

### 第一步：获取 database_id

在终端中执行：

```bash
npm run wrangler -- d1 list
```

**告诉我：**
1. 是否看到 `harmonygear24` 数据库
2. 它的 `database_id` 是什么（复制给我，或稍后我帮你配置）

然后继续下一步！
