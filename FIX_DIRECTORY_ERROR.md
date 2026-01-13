# 修复目录错误

## ❌ 问题

错误信息显示：`Could not read package.json: Error: ENOENT: no such file or directory, open '/Users/mac/package.json'`

**原因：** 你在错误的目录执行命令。当前在 `~` 目录（/Users/mac），而不是项目目录。

## ✅ 解决方案

### 步骤 1: 进入项目目录

在终端中输入：

```bash
cd /Users/mac/Desktop/coupon-website
```

**操作：**
1. 在终端中输入上面的命令
2. 按回车
3. 你会看到提示符变成 `coupon-website %`

### 步骤 2: 验证目录

输入：

```bash
pwd
```

**预期结果：**
```
/Users/mac/Desktop/coupon-website
```

如果显示这个路径，说明在正确目录了。

### 步骤 3: 验证文件存在

输入：

```bash
ls -la package.json
```

**预期结果：**
应该显示 package.json 文件的信息。

---

## 📝 正确的完整流程

### 在终端中，按顺序执行：

```bash
# 1. 进入项目目录（重要！）
cd /Users/mac/Desktop/coupon-website

# 2. 验证目录
pwd

# 3. 重新登录（如果需要）
npm run wrangler -- login

# 4. 获取 database_id
npm run wrangler -- d1 list

# 5. 生成 JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 6. 更新 wrangler.toml（手动编辑文件，填入 database_id 和 JWT_SECRET）

# 7. 初始化数据库表（注意添加 --remote）
npm run wrangler -- d1 execute coupon-db --file=./schema.sql --remote

# 8. 验证表创建
npm run wrangler -- d1 execute coupon-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

---

## 🎯 现在立即执行

### 第一步：进入项目目录

在终端中输入：

```bash
cd /Users/mac/Desktop/coupon-website
```

按回车。

### 第二步：验证

输入：

```bash
pwd
```

应该显示：`/Users/mac/Desktop/coupon-website`

### 第三步：然后继续执行其他命令

现在可以执行：
- `npm run wrangler -- login`
- `npm run wrangler -- d1 list`
- 等等

---

## ⚠️ 重要提示

**每次打开新终端窗口时，都需要先进入项目目录：**

```bash
cd /Users/mac/Desktop/coupon-website
```

**或者，你可以设置一个快捷方式：**

在 `~/.zshrc` 文件中添加：
```bash
alias coupon="cd /Users/mac/Desktop/coupon-website"
```

然后每次输入 `coupon` 就可以快速进入项目目录。

---

## ✅ 检查清单

执行命令前，确保：
- [ ] 在正确的目录：`/Users/mac/Desktop/coupon-website`
- [ ] 能看到 `package.json` 文件
- [ ] 能看到 `schema.sql` 文件
- [ ] 能看到 `wrangler.toml` 文件

如果这些都满足，就可以执行命令了！
