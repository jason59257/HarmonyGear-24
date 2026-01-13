# 修复 wrangler.toml 配置

## ❌ 问题

错误信息显示：`Couldn't find a D1 DB with the name or binding 'coupon-db' in your wrangler.toml file.`

这是因为 `wrangler.toml` 文件中缺少 D1 数据库配置。

## ✅ 解决方案

我已经更新了 `wrangler.toml` 文件，添加了 D1 数据库配置。

现在你需要：

### 步骤 1: 重新登录 Cloudflare

在终端中执行：

```bash
npm run wrangler -- login
```

**操作：**
1. 浏览器会自动打开
2. 登录 Cloudflare 账号
3. 点击 **Allow** 授权
4. 返回终端确认成功

### 步骤 2: 获取 database_id

登录成功后，执行：

```bash
npm run wrangler -- d1 list
```

**预期结果：**
```
┌─────────────────────────────────────────────────────────────┐
│ name       │ id                                          │
├─────────────────────────────────────────────────────────────┤
│ coupon-db  │ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx        │
└─────────────────────────────────────────────────────────────┘
```

**重要：** 复制 `id` 列的值（database_id）

### 步骤 3: 更新 wrangler.toml

1. **打开文件**：`wrangler.toml`

2. **找到这一行**：
   ```toml
   database_id = "YOUR_DATABASE_ID_HERE"
   ```

3. **替换为你的 database_id**：
   ```toml
   database_id = "你从步骤2复制的database_id"
   ```

4. **保存文件**

### 步骤 4: 生成 JWT_SECRET

在终端中执行：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**复制生成的密钥**（64个字符的字符串）

### 步骤 5: 更新 JWT_SECRET

1. **打开文件**：`wrangler.toml`

2. **找到这一行**：
   ```toml
   JWT_SECRET = "YOUR_JWT_SECRET_HERE"
   ```

3. **替换为生成的密钥**：
   ```toml
   JWT_SECRET = "你从步骤4生成的密钥"
   ```

4. **保存文件**

### 步骤 6: 再次执行初始化

现在可以执行初始化命令了：

```bash
npm run wrangler -- d1 execute coupon-db --file=./schema.sql --remote
```

**注意：** 添加了 `--remote` 参数，因为数据库在 Cloudflare 云端。

### 步骤 7: 验证表创建

```bash
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

---

## 📝 完整命令清单

按顺序执行：

```bash
# 1. 重新登录
npm run wrangler -- login

# 2. 获取 database_id
npm run wrangler -- d1 list

# 3. 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. 更新 wrangler.toml（手动编辑文件）

# 5. 初始化数据库表（注意添加 --remote）
npm run wrangler -- d1 execute coupon-db --file=./schema.sql --remote

# 6. 验证表创建
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

---

## ⚠️ 重要提示

1. **使用 --remote 参数**：因为数据库在 Cloudflare 云端，不是本地
2. **先登录**：确保已登录 Cloudflare
3. **更新配置**：确保 `wrangler.toml` 中的 `database_id` 和 `JWT_SECRET` 已更新

---

## 🎯 现在开始

1. 先执行：`npm run wrangler -- login`
2. 然后告诉我登录是否成功
3. 我会继续帮你完成后续步骤
