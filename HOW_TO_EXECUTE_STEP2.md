# 第二步：初始化数据库表 - 详细操作指南

## 📍 在哪里执行命令？

### 方法 1: 使用 macOS 终端（Terminal）

#### 步骤 1.1: 打开终端

1. **按快捷键**：
   - 同时按 `Command + 空格键`
   - 输入 "Terminal"
   - 按回车

   或者

2. **从应用程序打开**：
   - 打开 **Finder**
   - 点击左侧的 **应用程序**
   - 找到 **实用工具** 文件夹
   - 双击 **终端**（Terminal）

#### 步骤 1.2: 确认终端已打开

你会看到一个窗口，显示类似这样的内容：
```
Last login: Mon Jan 13 09:45:23 on ttys000
mac@MacBook-Pro ~ %
```

这个 `%` 或 `$` 符号后面就是输入命令的地方。

---

## 📂 步骤 2: 进入项目目录

### 在终端中输入以下命令：

```bash
cd /Users/mac/Desktop/coupon-website
```

### 详细操作：

1. **在终端窗口中**：
   - 你会看到光标在闪烁
   - 直接输入：`cd /Users/mac/Desktop/coupon-website`
   - **注意**：不要包含 ```bash 标记，只输入命令本身

2. **按回车键**

3. **验证是否在正确目录**：
   - 输入：`pwd`
   - 按回车
   - 应该显示：`/Users/mac/Desktop/coupon-website`

**预期结果：**
```
mac@MacBook-Pro ~ % cd /Users/mac/Desktop/coupon-website
mac@MacBook-Pro coupon-website %
```

注意：提示符从 `~ %` 变成了 `coupon-website %`，说明已经在项目目录了。

---

## 🗄️ 步骤 3: 执行初始化数据库表的命令

### 在终端中输入以下命令：

```bash
npm run wrangler -- d1 execute coupon-db --file=./schema.sql
```

### 详细操作：

1. **确保在项目目录**（上一步已完成）

2. **输入命令**：
   - 在终端中输入：`npm run wrangler -- d1 execute coupon-db --file=./schema.sql`
   - **重要**：
     - 不要包含 ```bash 标记
     - 不要包含任何引号
     - 直接复制命令，粘贴到终端
     - 或者手动输入

3. **按回车键执行**

4. **等待执行完成**（可能需要几秒钟）

### 预期结果：

**如果成功，你会看到：**
```
> coupon-website@1.0.0 wrangler
> wrangler d1 execute coupon-db --file=./schema.sql

✅ Successfully executed 15 commands
```

**如果失败，可能会看到错误信息，例如：**
```
✘ [ERROR] Database not found
```
或
```
✘ [ERROR] syntax error
```

---

## 🔍 步骤 4: 验证表是否创建成功

### 执行验证命令：

```bash
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 详细操作：

1. **在同一个终端窗口中**
2. **输入上面的命令**
3. **按回车**

### 预期结果：

**如果成功，你会看到：**
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

应该看到 **8 个表名**。

---

## 📝 完整操作流程（复制粘贴版）

### 在终端中，按顺序执行：

```bash
# 1. 进入项目目录
cd /Users/mac/Desktop/coupon-website

# 2. 验证目录
pwd

# 3. 初始化数据库表
npm run wrangler -- d1 execute coupon-db --file=./schema.sql

# 4. 验证表创建成功
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🖼️ 操作示意图

### 终端窗口应该看起来像这样：

```
mac@MacBook-Pro ~ % cd /Users/mac/Desktop/coupon-website
mac@MacBook-Pro coupon-website % pwd
/Users/mac/Desktop/coupon-website
mac@MacBook-Pro coupon-website % npm run wrangler -- d1 execute coupon-db --file=./schema.sql

> coupon-website@1.0.0 wrangler
> wrangler d1 execute coupon-db --file=./schema.sql

✅ Successfully executed 15 commands

mac@MacBook-Pro coupon-website % npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"

> coupon-website@1.0.0 wrangler
> wrangler d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"

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

mac@MacBook-Pro coupon-website %
```

---

## ⚠️ 常见问题

### Q1: 找不到命令？

**错误信息：** `command not found: npm`

**解决方法：**
- 确保已安装 Node.js
- 检查：`node --version`
- 如果未安装，访问 https://nodejs.org 下载安装

### Q2: 找不到文件？

**错误信息：** `File not found: schema.sql`

**解决方法：**
1. 确认在正确目录：`pwd` 应该显示 `/Users/mac/Desktop/coupon-website`
2. 检查文件是否存在：`ls -la schema.sql`
3. 如果文件不存在，告诉我，我会重新创建

### Q3: 数据库不存在？

**错误信息：** `Database not found: coupon-db`

**解决方法：**
- 先创建数据库：`npm run wrangler -- d1 create coupon-db`
- 然后再执行初始化命令

### Q4: 权限错误？

**错误信息：** `Permission denied`

**解决方法：**
- 确保在正确的目录
- 检查文件权限：`ls -la schema.sql`

---

## 🎯 现在开始操作

### 第一步：打开终端
- 按 `Command + 空格键`
- 输入 "Terminal"
- 按回车

### 第二步：进入项目目录
- 在终端中输入：`cd /Users/mac/Desktop/coupon-website`
- 按回车

### 第三步：执行初始化命令
- 在终端中输入：`npm run wrangler -- d1 execute coupon-db --file=./schema.sql`
- 按回车
- 等待执行完成

### 第四步：验证结果
- 在终端中输入：`npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';"`
- 按回车
- 检查是否看到 8 个表

---

## ✅ 完成后的下一步

如果看到 8 个表，说明成功！

**告诉我：**
1. ✅ 是否看到 "Successfully executed 15 commands"
2. ✅ 是否看到 8 个表
3. ❌ 如果有任何错误，告诉我完整的错误信息

**然后我会继续帮你完成后续步骤！**
