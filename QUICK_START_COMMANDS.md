# 快速开始命令清单

## 📋 按顺序执行以下命令

### 第一步：安装 Wrangler（本地安装）

```bash
cd /Users/mac/Desktop/coupon-website
npm install wrangler --save-dev
```

安装完成后，使用 `npx wrangler` 代替 `wrangler`。

---

### 第二步：登录 Cloudflare

```bash
npx wrangler login
```

**操作：**
1. 浏览器会自动打开
2. 点击 **Allow** 授权
3. 返回终端确认成功

---

### 第三步：创建 D1 数据库

```bash
npx wrangler d1 create coupon-db
```

**重要：** 复制返回的 `database_id`！

**预期输出：**
```
✅ Successfully created DB 'coupon-db'!

[[d1_databases]]
binding = "DB"
database_name = "coupon-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

### 第四步：初始化数据库表

```bash
npx wrangler d1 execute coupon-db --file=./schema.sql
```

**预期输出：**
```
✅ Successfully executed 15 commands
```

---

### 第五步：验证表创建成功

```bash
npx wrangler d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**预期输出：** 应该看到 8 个表名

---

### 第六步：生成 JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**重要：** 复制生成的密钥！

---

### 第七步：更新 wrangler.toml

编辑 `wrangler.toml`，填入：
- `database_id`（从第三步）
- `JWT_SECRET`（从第六步）

---

### 第八步：安装 JWT 库

```bash
npm install @tsndr/cloudflare-worker-jwt
```

---

## 🎯 完成以上步骤后告诉我

我会帮你：
1. 创建 API Worker 代码
2. 创建认证系统
3. 更新前端代码
4. 测试所有功能

---

## ⚠️ 注意事项

- 所有 `wrangler` 命令改为 `npx wrangler`
- 或者添加到 `package.json` 的 scripts 中
- 确保在项目目录执行命令
