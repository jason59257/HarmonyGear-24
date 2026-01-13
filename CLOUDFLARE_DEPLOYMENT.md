# Cloudflare 免费部署指南

本指南将详细说明如何使用 Cloudflare 的免费服务部署优惠券网站的前台和后台系统。

## 目录
1. [准备工作](#准备工作)
2. [部署前台系统](#部署前台系统)
3. [部署后台系统](#部署后台系统)
4. [配置图片上传功能](#配置图片上传功能)
5. [域名配置](#域名配置)
6. [常见问题](#常见问题)

---

## 准备工作

### 1. 注册 Cloudflare 账号
- 访问 [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
- 使用邮箱注册免费账号
- 验证邮箱地址

### 2. 准备代码仓库
- 在 GitHub 上创建新仓库（如果还没有）
- 将项目代码推送到 GitHub

**如果没有 GitHub 账号：**
1. 访问 [https://github.com/signup](https://github.com/signup) 注册
2. 创建新仓库（例如：`coupon-website`）
3. 在项目目录执行：

```bash
cd /Users/mac/Desktop/coupon-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/coupon-website.git
git push -u origin main
```

---

## 部署前台系统

### 步骤 1: 创建 Cloudflare Pages 项目

1. 登录 Cloudflare Dashboard
2. 点击左侧菜单 **"Workers & Pages"**
3. 点击 **"Create application"**
4. 选择 **"Pages"** 标签
5. 点击 **"Connect to Git"**
6. 授权 Cloudflare 访问你的 GitHub 账号
7. 选择你的仓库 `coupon-website`

### 步骤 2: 配置构建设置

在配置页面填写：

- **Project name**: `coupon-website-frontend`（或你喜欢的名称）
- **Production branch**: `main`
- **Build command**: 留空（静态网站不需要构建）
- **Build output directory**: `.`（根目录）

**重要：** 由于前台文件在根目录，输出目录设置为 `.`

### 步骤 3: 环境变量（可选）

如果需要，可以添加环境变量，但前台系统目前不需要。

### 步骤 4: 部署

1. 点击 **"Save and Deploy"**
2. 等待部署完成（通常 1-2 分钟）
3. 部署完成后，你会得到一个 URL，例如：
   `https://coupon-website-frontend.pages.dev`

### 步骤 5: 自定义域名（可选）

1. 在 Pages 项目页面，点击 **"Custom domains"**
2. 输入你的域名（如果有）
3. Cloudflare 会自动配置 DNS

---

## 部署后台系统

### 方法一：作为子目录部署（推荐）

由于后台系统在 `admin/` 目录下，我们可以：

#### 选项 A: 使用同一个 Pages 项目

前台和后台可以部署在同一个 Pages 项目中，因为：
- 前台文件在根目录（`index.html`, `stores.html` 等）
- 后台文件在 `admin/` 目录（`admin/dashboard.html` 等）

访问方式：
- 前台：`https://你的域名.com/`
- 后台：`https://你的域名.com/admin/`

**这是最简单的方法，只需要部署一次！**

#### 选项 B: 创建单独的 Pages 项目

如果你想将后台部署到单独的域名：

1. 在 Cloudflare Pages 中创建新项目
2. 选择同一个 GitHub 仓库
3. 配置：
   - **Project name**: `coupon-website-admin`
   - **Build output directory**: `admin`
4. 部署

访问方式：
- 前台：`https://frontend.pages.dev`
- 后台：`https://admin.pages.dev`

---

## 配置图片上传功能

由于 Cloudflare Pages 是静态托管，无法直接处理文件上传。我们需要使用 **Cloudflare R2**（对象存储）来存储图片。

### 步骤 1: 创建 R2 存储桶

1. 在 Cloudflare Dashboard，点击 **"R2"**
2. 点击 **"Create bucket"**
3. 输入存储桶名称：`coupon-images`
4. 选择位置（选择离你最近的区域）
5. 点击 **"Create bucket"**

### 步骤 2: 创建 R2 API Token

1. 在 R2 页面，点击 **"Manage R2 API Tokens"**
2. 点击 **"Create API token"**
3. 配置：
   - **Token name**: `coupon-upload-token`
   - **Permissions**: 选择 **"Object Read & Write"**
   - **TTL**: 留空（永久有效）
   - **Bucket access**: 选择 `coupon-images`
4. 点击 **"Create API Token"**
5. **重要：** 复制并保存以下信息：
   - Access Key ID
   - Secret Access Key

### 步骤 3: 创建 Cloudflare Worker 处理上传

我们需要创建一个 Worker 来处理图片上传请求。

1. 在项目根目录创建 `workers/upload-handler.js`：

```javascript
// workers/upload-handler.js
export default {
  async fetch(request, env) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // 获取上传的文件
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Invalid file type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 验证文件大小（5MB 限制）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return new Response(JSON.stringify({ error: 'File too large' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 生成唯一文件名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomStr}.${extension}`;

      // 上传到 R2
      const arrayBuffer = await file.arrayBuffer();
      await env.COUPON_IMAGES.put(fileName, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      // 返回文件 URL
      const fileUrl = `https://你的R2域名/${fileName}`;
      // 或者使用自定义域名：
      // const fileUrl = `https://images.你的域名.com/${fileName}`;

      return new Response(JSON.stringify({ 
        success: true, 
        url: fileUrl,
        fileName: fileName 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      return new Response(JSON.stringify({ error: 'Upload failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
```

2. 创建 `wrangler.toml` 配置文件：

```toml
# wrangler.toml
name = "coupon-upload-handler"
main = "workers/upload-handler.js"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "COUPON_IMAGES"
bucket_name = "coupon-images"
```

### 步骤 4: 部署 Worker

1. 安装 Wrangler CLI（Cloudflare 的命令行工具）：

```bash
npm install -g wrangler
```

2. 登录 Cloudflare：

```bash
wrangler login
```

3. 部署 Worker：

```bash
cd /Users/mac/Desktop/coupon-website
wrangler deploy
```

4. 部署完成后，你会得到一个 Worker URL，例如：
   `https://coupon-upload-handler.你的用户名.workers.dev`

### 步骤 5: 配置 R2 公共访问（用于显示图片）

1. 在 R2 存储桶页面，点击 **"Settings"**
2. 找到 **"Public Access"** 部分
3. 点击 **"Allow Access"**
4. 配置自定义域名（可选）：
   - 点击 **"Connect Domain"**
   - 输入子域名，例如：`images.你的域名.com`
   - Cloudflare 会自动配置 DNS

### 步骤 6: 更新前端代码

修改 `admin/js/api.js` 中的上传 URL：

```javascript
// 在 ImageAPI.upload 函数中
async upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('https://coupon-upload-handler.你的用户名.workers.dev', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const result = await response.json();
        return { success: true, url: result.url };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
    }
}
```

---

## 域名配置

### 步骤 1: 添加域名到 Cloudflare

1. 在 Cloudflare Dashboard，点击 **"Add a Site"**
2. 输入你的域名
3. 选择免费计划（Free plan）
4. Cloudflare 会扫描你的 DNS 记录
5. 按照提示更新你的域名服务器（Nameservers）

### 步骤 2: 配置 DNS 记录

1. 在 Cloudflare Dashboard，选择你的域名
2. 点击 **"DNS"**
3. 添加记录：
   - **Type**: CNAME
   - **Name**: `@` 或 `www`
   - **Target**: `你的Pages项目.pages.dev`
   - **Proxy status**: Proxied（橙色云朵）

### 步骤 3: 配置 Pages 自定义域名

1. 在 Pages 项目页面，点击 **"Custom domains"**
2. 点击 **"Set up a custom domain"**
3. 输入你的域名
4. Cloudflare 会自动配置 SSL 证书（免费）

---

## 完整部署流程总结

### 快速部署步骤：

1. **准备代码**
   ```bash
   cd /Users/mac/Desktop/coupon-website
   git add .
   git commit -m "Prepare for Cloudflare deployment"
   git push
   ```

2. **部署前台和后台（一次性）**
   - 在 Cloudflare Pages 创建项目
   - 连接 GitHub 仓库
   - 构建输出目录：`.`
   - 部署

3. **设置图片上传**
   - 创建 R2 存储桶
   - 创建 Worker 处理上传
   - 更新 `admin/js/api.js` 中的上传 URL

4. **配置域名（可选）**
   - 添加域名到 Cloudflare
   - 配置 DNS 记录
   - 在 Pages 中设置自定义域名

---

## 常见问题

### Q1: 图片上传后无法显示？
**A:** 确保：
- R2 存储桶已启用公共访问
- Worker 返回的 URL 正确
- 检查浏览器控制台的错误信息

### Q2: 后台登录后无法保存状态？
**A:** 由于是静态网站，登录状态保存在 localStorage。刷新页面不会丢失，但清除浏览器数据会。

### Q3: 如何更新网站内容？
**A:** 
1. 修改本地代码
2. 提交到 GitHub：`git push`
3. Cloudflare Pages 会自动重新部署（通常 1-2 分钟）

### Q4: 免费额度够用吗？
**A:** Cloudflare 免费计划包括：
- Pages: 无限请求，500 次构建/月
- Workers: 100,000 次请求/天
- R2: 10GB 存储，100 万次读取/月
对于中小型网站完全够用。

### Q5: 如何查看部署日志？
**A:** 在 Cloudflare Pages 项目页面，点击 **"Deployments"**，选择任意部署查看日志。

### Q6: 如何回滚到之前的版本？
**A:** 在 **"Deployments"** 页面，找到之前的部署，点击 **"Retry deployment"**。

---

## 安全建议

1. **保护后台系统**
   - 考虑使用 Cloudflare Access（免费版有限制）
   - 或添加简单的密码保护

2. **限制上传文件类型和大小**
   - 已在 Worker 代码中实现
   - 可以根据需要调整

3. **使用环境变量存储敏感信息**
   - Worker 的 R2 绑定会自动处理
   - 不要在代码中硬编码密钥

---

## 下一步

部署完成后，你可以：
1. 测试前台和后台功能
2. 上传一些测试图片
3. 配置自定义域名
4. 设置 Cloudflare 的缓存规则（可选）

如有问题，请查看 Cloudflare 官方文档或联系支持。
