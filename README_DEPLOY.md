# 🚀 Cloudflare 部署完整指南

本指南将帮助你使用 Cloudflare 的**完全免费**服务部署优惠券网站。

## 📋 目录

1. [快速开始（5分钟）](#快速开始)
2. [详细部署步骤](#详细部署步骤)
3. [配置图片上传](#配置图片上传)
4. [常见问题](#常见问题)

---

## 快速开始

### 方式一：不使用 Git（最简单）⭐ 推荐新手

**只需 3 步，3 分钟完成！**

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **上传网站**
   ```bash
   cd /Users/mac/Desktop/coupon-website
   wrangler pages deploy . --project-name=coupon-website
   ```

**完成！** 你会得到 URL：`https://coupon-website.pages.dev`

**更新网站：** 修改后重新执行第 3 步命令即可。

---

### 方式二：使用 Git（推荐长期使用）

**优点：** 自动部署、版本控制、可回滚

1. **推送代码到 GitHub**
   ```bash
   cd /Users/mac/Desktop/coupon-website
   git init
   git add .
   git commit -m "Initial commit"
   # 在 GitHub 创建仓库后
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

2. **在 Cloudflare Pages 部署**
   - 访问：https://dash.cloudflare.com
   - Workers & Pages → Create application → Pages → Connect to Git
   - 选择仓库，配置：
     - Build output directory: `.`
     - Build command: 留空
   - 点击 Deploy

3. **完成！**
   - 前台：`https://你的项目.pages.dev/`
   - 后台：`https://你的项目.pages.dev/admin/`

**之后更新：** 只需 `git push`，自动部署！

---

**两种方式对比：**
- **不使用 Git**：简单快速，适合测试
- **使用 Git**：自动部署，适合长期使用

详细说明见：`DEPLOY_WITHOUT_GIT.md`

---

## 详细部署步骤

### 第一部分：部署前台和后台

#### 1. 准备 GitHub 仓库

如果没有 GitHub 账号：
- 访问 https://github.com/signup 注册
- 创建新仓库（例如：`coupon-website`）

推送代码：
```bash
cd /Users/mac/Desktop/coupon-website
git init
git add .
git commit -m "Prepare for Cloudflare deployment"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

#### 2. 创建 Cloudflare Pages 项目

1. **登录 Cloudflare**
   - 访问：https://dash.cloudflare.com
   - 如果没有账号，点击 Sign Up 注册（免费）

2. **创建 Pages 项目**
   - 左侧菜单：**Workers & Pages**
   - 点击：**Create application**
   - 选择：**Pages** 标签
   - 点击：**Connect to Git**

3. **授权 GitHub**
   - 点击 **Authorize Cloudflare**
   - 选择你的 GitHub 账号
   - 授权访问仓库

4. **选择仓库**
   - 在列表中选择 `coupon-website`（或你的仓库名）
   - 点击 **Begin setup**

5. **配置项目**
   - **Project name**: `coupon-website`（任意名称）
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: 留空（静态网站不需要构建）
   - **Build output directory**: `.`（点号，表示根目录）
   - **Root directory**: `/`（默认）

6. **环境变量**
   - 暂时不需要，留空

7. **部署**
   - 点击 **Save and Deploy**
   - 等待 1-2 分钟
   - 看到 "Success" 表示部署完成

8. **访问网站**
   - 你会得到一个 URL，例如：`https://coupon-website-xxx.pages.dev`
   - 前台：直接访问这个 URL
   - 后台：`https://coupon-website-xxx.pages.dev/admin/`

✅ **前台和后台已部署完成！**

---

### 第二部分：配置图片上传（可选）

图片上传需要 Cloudflare R2（对象存储）和 Workers。

#### 步骤 1: 创建 R2 存储桶

1. Cloudflare Dashboard → **R2**
2. 点击 **Create bucket**
3. 输入名称：`coupon-images`
4. 选择位置（选择离你最近的区域）
5. 点击 **Create bucket**

#### 步骤 2: 启用 R2 公共访问

1. 点击存储桶 `coupon-images`
2. 点击 **Settings** 标签
3. 找到 **Public Access** 部分
4. 点击 **Allow Access**
5. 复制公共域名（例如：`https://pub-xxxxx.r2.dev`）

#### 步骤 3: 部署上传 Worker

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```
   浏览器会自动打开，点击授权

3. **配置 Worker**
   
   编辑 `wrangler.toml`，更新 R2 公共 URL：
   ```toml
   [vars]
   R2_PUBLIC_URL = "https://pub-xxxxx.r2.dev"  # 替换为你的 R2 域名
   ```

4. **部署 Worker**
   ```bash
   cd /Users/mac/Desktop/coupon-website
   wrangler deploy
   ```

5. **复制 Worker URL**
   部署完成后会显示 URL，例如：
   `https://coupon-upload-handler.你的用户名.workers.dev`

#### 步骤 4: 更新前端配置

1. **编辑配置文件**
   
   打开 `admin/js/config.js`，更新：
   ```javascript
   export const CONFIG = {
       // 替换为你的 Worker URL
       UPLOAD_WORKER_URL: 'https://coupon-upload-handler.你的用户名.workers.dev',
       
       // 替换为你的 R2 公共 URL
       R2_PUBLIC_URL: 'https://pub-xxxxx.r2.dev',
       
       USE_MOCK_UPLOAD: false,
   };
   ```

2. **提交并推送**
   ```bash
   git add admin/js/config.js
   git commit -m "Configure Cloudflare upload"
   git push
   ```

3. **等待自动部署**
   Cloudflare Pages 会自动检测到代码更新并重新部署（1-2 分钟）

#### 步骤 5: 测试上传

1. 访问后台：`https://你的URL.pages.dev/admin/`
2. 登录后台
3. 进入 Stores 或 Coupons 管理
4. 尝试上传图片
5. 检查是否成功

---

### 第三部分：配置自定义域名（可选）

#### 步骤 1: 添加域名到 Cloudflare

1. Cloudflare Dashboard → **Add a Site**
2. 输入你的域名（例如：`example.com`）
3. 选择 **Free** 计划
4. Cloudflare 会扫描你的 DNS 记录
5. 按照提示更新你的域名服务器（Nameservers）

#### 步骤 2: 配置 DNS 记录

1. 选择你的域名
2. 点击 **DNS** 菜单
3. 添加 CNAME 记录：
   - **Type**: CNAME
   - **Name**: `@`（表示根域名）或 `www`
   - **Target**: `你的Pages项目.pages.dev`
   - **Proxy status**: Proxied（橙色云朵图标）
   - 点击 **Save**

#### 步骤 3: 在 Pages 中绑定域名

1. Pages 项目页面 → **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（例如：`example.com`）
4. Cloudflare 会自动配置 SSL 证书（免费，通常几分钟）

#### 步骤 4: 等待生效

- DNS 传播通常需要几分钟到几小时
- SSL 证书自动配置（免费）
- 完成后可以通过自定义域名访问

---

## 文件说明

### 重要文件

- **`QUICK_DEPLOY.md`** - 5分钟快速部署指南
- **`CLOUDFLARE_DEPLOYMENT.md`** - 详细技术文档
- **`DEPLOYMENT_CHECKLIST.md`** - 部署检查清单
- **`admin/js/config.js`** - 配置文件（需要更新）
- **`workers/upload-handler.js`** - 上传 Worker 代码
- **`wrangler.toml`** - Worker 配置文件

### 配置文件位置

```
coupon-website/
├── admin/
│   └── js/
│       ├── config.js          ← 更新 Worker URL 和 R2 URL
│       └── api.js             ← 已配置支持 Cloudflare
├── workers/
│   └── upload-handler.js      ← 上传处理 Worker
└── wrangler.toml              ← Worker 配置
```

---

## 常见问题

### Q1: 部署后页面显示 404？

**A:** 检查构建输出目录是否为 `.`（点号）

### Q2: 后台无法访问？

**A:** 确保访问 `/admin/` 路径，例如：
- ✅ `https://你的URL.pages.dev/admin/`
- ❌ `https://你的URL.pages.dev/admin`（缺少尾部斜杠）

### Q3: 图片上传失败？

**A:** 检查以下几点：
1. Worker 是否已部署（运行 `wrangler deploy`）
2. `config.js` 中的 URL 是否正确
3. R2 存储桶是否已启用公共访问
4. 浏览器控制台是否有错误信息

### Q4: 如何更新网站内容？

**A:** 
1. 修改本地代码
2. 提交到 GitHub：
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```
3. Cloudflare Pages 会自动重新部署（1-2 分钟）

### Q5: 免费额度够用吗？

**A:** 完全够用！Cloudflare 免费计划包括：
- **Pages**: 无限请求，500 次构建/月
- **Workers**: 100,000 次请求/天
- **R2**: 10GB 存储，1,000,000 次读取/月

对于中小型网站完全足够。

### Q6: 如何查看部署日志？

**A:** 
1. Cloudflare Dashboard → Pages
2. 选择你的项目
3. 点击 **Deployments**
4. 选择任意部署查看详细日志

### Q7: 如何回滚到之前的版本？

**A:** 
1. Pages 项目 → **Deployments**
2. 找到之前的部署
3. 点击 **Retry deployment**

### Q8: Worker 部署失败？

**A:** 检查：
1. 是否已登录：`wrangler login`
2. `wrangler.toml` 中的配置是否正确
3. R2 存储桶名称是否匹配

---

## 部署后检查清单

使用 `DEPLOYMENT_CHECKLIST.md` 确保所有步骤都已完成。

### 基本功能测试

- [ ] 前台首页正常显示
- [ ] 前台商店列表正常显示
- [ ] 前台优惠券列表正常显示
- [ ] 后台登录功能正常
- [ ] 后台 Dashboard 正常显示
- [ ] 后台可以管理商店
- [ ] 后台可以管理优惠券
- [ ] 图片上传功能正常（如果已配置）
- [ ] 上传的图片可以正常显示

---

## 获取帮助

1. **查看详细文档**: `CLOUDFLARE_DEPLOYMENT.md`
2. **Cloudflare 官方文档**: https://developers.cloudflare.com
3. **Cloudflare 社区**: https://community.cloudflare.com

---

## 下一步

部署完成后，你可以：
1. ✅ 测试所有功能
2. ✅ 上传一些测试数据
3. ✅ 配置自定义域名
4. ✅ 设置 Cloudflare 缓存规则（可选）
5. ✅ 配置 Cloudflare Analytics（免费）

**恭喜！你的网站已经成功部署到 Cloudflare！🎉**
