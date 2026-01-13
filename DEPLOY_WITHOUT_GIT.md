# 不使用 GitHub 的 Cloudflare 部署方法

## 📋 两种部署方式对比

### 方式一：通过 Git（GitHub/GitLab/Bitbucket）
**优点：**
- ✅ 自动部署：每次推送代码自动重新部署
- ✅ 版本控制：可以回滚到任意历史版本
- ✅ 预览部署：为每个 Pull Request 创建预览环境
- ✅ 团队协作：多人协作更方便
- ✅ 持续集成：可以设置自动测试

**缺点：**
- ❌ 需要 Git 仓库账号
- ❌ 需要学习基本的 Git 命令

### 方式二：直接上传文件（不使用 Git）
**优点：**
- ✅ 不需要 Git 账号
- ✅ 操作简单：直接上传文件
- ✅ 适合个人项目或一次性部署

**缺点：**
- ❌ 需要手动上传每次更新
- ❌ 无法自动部署
- ❌ 无法回滚到历史版本
- ❌ 无法创建预览环境

---

## 🚀 方法一：使用 Wrangler CLI 直接上传（推荐）

这是不使用 Git 的最佳方式，通过命令行工具直接上传。

### 步骤 1: 安装 Wrangler

```bash
npm install -g wrangler
```

### 步骤 2: 登录 Cloudflare

```bash
wrangler login
```

浏览器会自动打开，点击授权即可。

### 步骤 3: 创建 Pages 项目

1. 在 Cloudflare Dashboard：
   - 访问：https://dash.cloudflare.com
   - 点击 **Workers & Pages**
   - 点击 **Create application** → **Pages**
   - 选择 **Upload assets**（不是 Connect to Git）
   - 输入项目名称：`coupon-website`
   - 点击 **Create project**

2. 或者使用命令行创建：
   ```bash
   wrangler pages project create coupon-website
   ```

### 步骤 4: 上传文件

在项目目录执行：

```bash
cd /Users/mac/Desktop/coupon-website
wrangler pages deploy . --project-name=coupon-website
```

**注意：** 第一次上传可能需要几分钟。

### 步骤 5: 访问网站

上传完成后，你会得到一个 URL，例如：
`https://coupon-website.pages.dev`

- 前台：`https://coupon-website.pages.dev/`
- 后台：`https://coupon-website.pages.dev/admin/`

### 更新网站内容

每次修改后，重新执行上传命令：

```bash
wrangler pages deploy . --project-name=coupon-website
```

---

## 🌐 方法二：通过 Cloudflare Dashboard 上传

### 步骤 1: 创建 Pages 项目

1. 访问：https://dash.cloudflare.com
2. **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Upload assets**
4. 输入项目名称
5. 点击 **Create project**

### 步骤 2: 准备文件

你需要将项目文件打包成 ZIP 文件：

```bash
cd /Users/mac/Desktop/coupon-website
zip -r coupon-website.zip . -x "*.git*" -x "node_modules/*" -x "uploads/*"
```

### 步骤 3: 上传 ZIP 文件

1. 在 Pages 项目页面
2. 点击 **Upload assets**
3. 选择 ZIP 文件
4. 点击 **Deploy**

### 步骤 4: 访问网站

部署完成后访问提供的 URL。

### 更新网站

每次更新都需要：
1. 重新打包 ZIP 文件
2. 重新上传

---

## 📊 详细对比表

| 特性 | Git 集成 | 直接上传 |
|------|---------|---------|
| **需要账号** | GitHub/GitLab/Bitbucket | 只需要 Cloudflare |
| **部署方式** | 自动（git push） | 手动（wrangler deploy） |
| **版本控制** | ✅ 完整历史 | ❌ 无 |
| **回滚功能** | ✅ 支持 | ❌ 不支持 |
| **预览环境** | ✅ 支持 | ❌ 不支持 |
| **更新速度** | 快（自动） | 慢（手动） |
| **适合场景** | 团队项目、持续开发 | 个人项目、一次性部署 |
| **学习成本** | 中等（需要 Git） | 低（直接上传） |

---

## 🎯 推荐方案

### 如果你：
- **只是测试或一次性部署** → 使用 **Wrangler CLI 直接上传**
- **需要经常更新** → 使用 **Git 集成**（即使只用 GitHub 免费账号）
- **团队协作** → 必须使用 **Git 集成**
- **不想学习 Git** → 使用 **Wrangler CLI**

---

## 💡 为什么推荐 Git 集成？

虽然可以直接上传，但 Git 集成有以下优势：

1. **自动化**：修改代码 → 推送 → 自动部署（无需手动操作）
2. **历史记录**：可以查看每次修改的内容
3. **回滚**：出问题时可以快速回滚
4. **免费**：GitHub 免费账号完全够用
5. **备份**：代码自动备份在云端

**Git 学习成本很低**，只需要 3 个命令：
```bash
git add .           # 添加文件
git commit -m "..."  # 提交
git push            # 推送
```

---

## 🔧 使用 Wrangler 的完整示例

### 首次部署

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录
wrangler login

# 3. 创建项目（可选，也可以在 Dashboard 创建）
wrangler pages project create coupon-website

# 4. 部署
cd /Users/mac/Desktop/coupon-website
wrangler pages deploy . --project-name=coupon-website
```

### 更新网站

```bash
# 修改文件后，重新部署
wrangler pages deploy . --project-name=coupon-website
```

### 查看部署历史

```bash
wrangler pages deployment list --project-name=coupon-website
```

---

## ⚠️ 注意事项

### 直接上传的限制

1. **文件大小限制**：单次上传不超过 25MB（压缩后）
2. **更新麻烦**：每次修改都需要重新上传
3. **无版本控制**：无法查看历史版本
4. **无预览**：无法为修改创建预览环境

### 建议

即使不使用 Git 集成，也建议：
- 在本地保留代码备份
- 使用版本控制工具（即使不上传到 GitHub）
- 定期备份重要文件

---

## 🎓 快速学习 Git（可选）

如果你决定使用 Git，只需要 5 分钟：

```bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 在 GitHub 创建仓库后，连接
git remote add origin https://github.com/用户名/仓库名.git
git push -u origin main
```

之后每次更新：
```bash
git add .
git commit -m "Update"
git push
```

就这么简单！

---

## 📝 总结

**不使用 GitHub 完全可以！**

- ✅ 使用 **Wrangler CLI** 直接上传（推荐）
- ✅ 通过 **Dashboard** 上传 ZIP 文件
- ⚠️ 但会失去自动部署、版本控制等便利功能

**建议：**
- 如果只是测试 → 直接上传
- 如果需要经常更新 → 使用 Git（学习成本很低）

两种方式都是免费的，选择适合你的即可！
