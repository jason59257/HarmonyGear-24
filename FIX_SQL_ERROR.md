# 修复 SQL 执行错误

## ❌ 错误原因

错误信息 `syntax error at offset 0: SQLITE_ERROR` 通常是因为：

1. **命令中包含 markdown 标记**：如果你复制了包含 `\`\`\`bash` 的命令，会导致错误
2. **SQL 文件格式问题**：文件可能有编码或格式问题

---

## ✅ 正确的执行方式

### 方法 1: 直接执行命令（推荐）

**不要复制 markdown 代码块标记！**

正确的命令（只复制这一行，不要包含 ```bash）：

```bash
npm run wrangler -- d1 execute coupon-db --file=./schema.sql
```

**操作步骤：**
1. 在终端中，直接输入或粘贴命令
2. **不要包含** `\`\`\`bash` 或 `\`\`\``
3. 按回车执行

### 方法 2: 使用相对路径

如果方法 1 不行，尝试：

```bash
cd /Users/mac/Desktop/coupon-website
npm run wrangler -- d1 execute coupon-db --file=schema.sql
```

注意：`--file=./schema.sql` 或 `--file=schema.sql` 都可以

### 方法 3: 使用绝对路径

```bash
npm run wrangler -- d1 execute coupon-db --file=/Users/mac/Desktop/coupon-website/schema.sql
```

---

## 🔍 检查文件是否存在

先确认文件存在：

```bash
cd /Users/mac/Desktop/coupon-website
ls -la schema.sql
```

**预期结果：**
```
-rw-r--r--  1 mac  staff  3456 Jan 13 16:30 schema.sql
```

如果文件不存在，告诉我，我会重新创建。

---

## 🛠️ 如果还是不行

### 方法 4: 逐条执行 SQL

如果文件执行有问题，可以逐条执行：

```bash
# 创建 users 表
npm run wrangler -- d1 execute coupon-db --command="CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT, role TEXT DEFAULT 'user', is_active INTEGER DEFAULT 1, total_cashback REAL DEFAULT 0, pending_cashback REAL DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
```

但这样太麻烦，建议使用方法 1-3。

---

## 📝 正确的完整流程

### 步骤 1: 确认在正确的目录

```bash
cd /Users/mac/Desktop/coupon-website
pwd
```

应该显示：`/Users/mac/Desktop/coupon-website`

### 步骤 2: 检查文件

```bash
ls -la schema.sql
```

### 步骤 3: 执行 SQL（只复制命令，不要包含 ```bash）

```bash
npm run wrangler -- d1 execute coupon-db --file=./schema.sql
```

---

## ⚠️ 常见错误

### 错误 1: 包含 markdown 标记

❌ **错误**：
```bash
```bash npm run wrangler -- d1 execute coupon-db --file=./schema.sql ```
```

✅ **正确**：
```bash
npm run wrangler -- d1 execute coupon-db --file=./schema.sql
```

### 错误 2: 文件路径错误

确保在项目根目录执行命令。

### 错误 3: 数据库不存在

如果提示数据库不存在，先创建：
```bash
npm run wrangler -- d1 create coupon-db
```

---

## 🎯 现在试试

1. **打开终端**
2. **进入项目目录**：
   ```bash
   cd /Users/mac/Desktop/coupon-website
   ```
3. **执行命令**（只复制这一行，不要包含 ```bash）：
   ```bash
   npm run wrangler -- d1 execute coupon-db --file=./schema.sql
   ```

如果还有错误，告诉我：
1. 完整的错误信息
2. 你执行的确切命令（复制粘贴给我看）
