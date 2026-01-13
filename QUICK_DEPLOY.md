# Cloudflare 快速部署指南

## 🚀 5分钟快速部署

### 第一步：准备代码仓库

```bash
# 如果还没有 Git 仓库
cd /Users/mac/Desktop/coupon-website
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
# 1. 在 GitHub 创建新仓库
# 2. 执行以下命令（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 第二步：部署到 Cloudflare Pages

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 如果没有账号，先注册（免费）

2. **创建 Pages 项目**
   - 点击左侧菜单 **"Workers & Pages"**
   - 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**
   - 授权 GitHub 访问
   - 选择你的仓库

3. **配置项目**
   - **Project name**: `coupon-website`（任意名称）
   - **Production branch**: `main`
   - **Build command**: 留空
   - **Build output directory**: `.`（点号，表示根目录）

4. **部署**
   - 点击 **"Save and Deploy"**
   - 等待 1-2 分钟
   - 获得 URL：`https://coupon-website.pages.dev`

✅ **完成！前台和后台都已部署！**
- 前台：`https://你的URL.pages.dev/`
- 后台：`https://你的URL.pages.dev/admin/`

---

## 📸 配置图片上传（可选）

### 步骤 1: 创建 R2 存储桶

1. Cloudflare Dashboard → **R2**
2. **Create bucket** → 名称：`coupon-images`
3. 创建完成

### 步骤 2: 部署上传 Worker

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署 Worker
cd /Users/mac/Desktop/coupon-website
wrangler deploy
```

### 步骤 3: 配置 Worker URL

1. 部署完成后，复制 Worker URL（例如：`https://coupon-upload-handler.xxx.workers.dev`）

2. 编辑 `admin/js/config.js`：
   ```javascript
   UPLOAD_WORKER_URL: 'https://你的WorkerURL.workers.dev',
   ```

3. 提交并推送：
   ```bash
   git add admin/js/config.js
   git commit -m "Update upload config"
   git push
   ```

4. Cloudflare Pages 会自动重新部署

### 步骤 4: 启用 R2 公共访问

1. R2 → `coupon-images` → **Settings**
2. **Public Access** → **Allow Access**
3. 复制公共 URL 或配置自定义域名

4. 更新 `admin/js/config.js`：
   ```javascript
   R2_PUBLIC_URL: 'https://你的R2公共URL',
   ```

---

## 🌐 配置自定义域名（可选）

1. **添加域名到 Cloudflare**
   - Dashboard → **Add a Site**
   - 输入域名 → 选择免费计划
   - 按照提示更新 Nameservers

2. **配置 DNS**
   - DNS → 添加 CNAME 记录
   - Name: `@` 或 `www`
   - Target: `你的Pages项目.pages.dev`
   - Proxy: 开启（橙色云）

3. **在 Pages 中绑定域名**
   - Pages 项目 → **Custom domains**
   - **Set up a custom domain**
   - 输入域名
   - SSL 证书会自动配置

---

## 📝 重要文件说明

- `CLOUDFLARE_DEPLOYMENT.md` - 详细部署文档
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `admin/js/config.js` - 配置文件（需要更新）
- `workers/upload-handler.js` - 上传 Worker 代码
- `wrangler.toml` - Worker 配置

---

## ❓ 常见问题

**Q: 部署后无法访问？**
A: 检查构建输出目录是否为 `.`（根目录）

**Q: 图片上传失败？**
A: 
1. 确认 Worker 已部署
2. 确认 `config.js` 中的 URL 正确
3. 确认 R2 存储桶已启用公共访问

**Q: 如何更新网站？**
A: 修改代码后：
```bash
git add .
git commit -m "Update"
git push
```
Cloudflare 会自动重新部署

**Q: 免费额度够用吗？**
A: 完全够用！免费计划包括：
- Pages: 无限请求
- Workers: 10万次/天
- R2: 10GB 存储

---

## 🎉 完成！

现在你的网站已经部署到 Cloudflare 了！

- 前台：展示商店和优惠券
- 后台：管理内容
- 图片上传：使用 R2 存储

如有问题，查看 `CLOUDFLARE_DEPLOYMENT.md` 获取详细说明。
