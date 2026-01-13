# 部署完成后的后续步骤

## 🎉 恭喜！你的网站已经部署到 Cloudflare！

---

## 📋 立即检查清单

### 1. 测试前台功能

访问你的网站前台，检查：

- [ ] 首页正常显示
- [ ] 商店列表页面正常
- [ ] 优惠券列表页面正常
- [ ] 优惠券详情页面正常
- [ ] 分类页面正常
- [ ] 所有链接可以点击

**前台 URL：** `https://你的项目名.pages.dev/`

### 2. 测试后台功能

访问后台管理页面：

- [ ] 后台登录页面可以访问
- [ ] 可以登录后台（使用 mock 数据）
- [ ] Dashboard 正常显示
- [ ] 可以查看商店列表
- [ ] 可以查看优惠券列表
- [ ] 可以查看用户列表
- [ ] 可以查看分类列表

**后台 URL：** `https://你的项目名.pages.dev/admin/`

---

## 🔧 可选配置

### 选项 1: 配置图片上传功能

如果你需要上传真实的图片（商店 logo、优惠券图片等），需要配置：

#### 步骤 1: 创建 R2 存储桶

1. Cloudflare Dashboard → **R2**
2. 点击 **Create bucket**
3. 名称：`coupon-images`
4. 选择位置
5. 点击 **Create bucket**

#### 步骤 2: 启用 R2 公共访问

1. 点击存储桶 `coupon-images`
2. **Settings** → **Public Access**
3. 点击 **Allow Access**
4. 复制公共域名（例如：`https://pub-xxxxx.r2.dev`）

#### 步骤 3: 部署上传 Worker

```bash
# 安装 Wrangler（如果还没有）
npm install -g wrangler

# 登录
wrangler login

# 进入项目目录
cd /Users/mac/Desktop/coupon-website

# 更新 wrangler.toml 中的 R2 公共 URL
# 编辑 wrangler.toml，将 R2_PUBLIC_URL 改为你的 R2 域名

# 部署 Worker
wrangler deploy
```

#### 步骤 4: 更新配置文件

1. 编辑 `admin/js/config.js`
2. 更新：
   ```javascript
   UPLOAD_WORKER_URL: 'https://你的WorkerURL.workers.dev',
   R2_PUBLIC_URL: 'https://你的R2域名',
   ```

3. 提交并推送：
   ```bash
   git add admin/js/config.js
   git commit -m "Update upload config"
   git push
   ```

4. Cloudflare Pages 会自动重新部署

#### 步骤 5: 测试上传

1. 登录后台
2. 进入 Stores 或 Coupons 管理
3. 尝试上传图片
4. 检查是否成功

---

### 选项 2: 配置自定义域名（可选）

如果你有自己的域名：

#### 步骤 1: 添加域名到 Cloudflare

1. Cloudflare Dashboard → **Add a Site**
2. 输入你的域名
3. 选择 **Free** 计划
4. 按照提示更新 Nameservers

#### 步骤 2: 配置 DNS

1. 选择你的域名
2. **DNS** → 添加 CNAME 记录：
   - **Name**: `@` 或 `www`
   - **Target**: `你的Pages项目.pages.dev`
   - **Proxy**: 开启（橙色云）

#### 步骤 3: 在 Pages 中绑定域名

1. Pages 项目 → **Custom domains**
2. **Set up a custom domain**
3. 输入域名
4. 等待 SSL 证书自动配置（几分钟）

---

## 📝 日常更新网站

### 更新流程（3 步）

每次修改代码后：

```bash
# 1. 进入项目目录
cd /Users/mac/Desktop/coupon-website

# 2. 添加修改的文件
git add .

# 3. 提交修改
git commit -m "描述你做了什么"

# 4. 推送到 GitHub
git push
```

**Cloudflare 会自动检测到更新并重新部署（1-2 分钟）**

### 更新示例

```bash
# 示例 1: 更新商店信息
git add .
git commit -m "更新商店列表"
git push

# 示例 2: 添加新功能
git add .
git commit -m "添加新优惠券"
git push

# 示例 3: 修复问题
git add .
git commit -m "修复图片显示问题"
git push
```

---

## 🔍 查看部署状态

### 在 Cloudflare Dashboard

1. **Workers & Pages** → 选择你的项目
2. 点击 **Deployments**
3. 查看所有部署历史
4. 点击任意部署查看详细日志

### 部署状态说明

- ✅ **Success** - 部署成功
- ⏳ **Building** - 正在构建
- ❌ **Failed** - 部署失败（查看日志）

---

## 🛠️ 常见操作

### 回滚到之前的版本

1. Cloudflare Dashboard → Pages 项目
2. **Deployments**
3. 找到之前的部署
4. 点击 **Retry deployment**

### 查看部署日志

1. **Deployments** → 选择任意部署
2. 查看 **Build Logs**
3. 检查是否有错误

### 手动触发部署

1. **Deployments** → **Retry deployment**
2. 或重新推送代码：`git push`

---

## 📊 监控和统计

### Cloudflare Analytics（免费）

1. Pages 项目页面
2. 查看 **Analytics** 标签
3. 可以看到：
   - 访问量
   - 请求数
   - 带宽使用

### 性能优化

Cloudflare 自动提供：
- ✅ CDN 加速
- ✅ SSL 证书（免费）
- ✅ DDoS 防护
- ✅ 全球分发

---

## ⚠️ 重要提示

### 1. 数据存储

**当前使用的是 Mock 数据（模拟数据）**

- 数据存储在浏览器的内存中
- 刷新页面会重置
- 这是为了演示和开发

**如果要使用真实数据，需要：**
- 连接真实数据库
- 或使用 Cloudflare D1（数据库服务）
- 或使用其他数据库服务

### 2. 后台登录

**当前是 Mock 登录**

- 不需要真实密码
- 任何用户名都可以登录
- 仅用于演示

**生产环境需要：**
- 实现真实的用户认证
- 使用 Cloudflare Access 或其他认证服务

### 3. 图片上传

**如果配置了 R2 上传：**
- 图片会存储在 Cloudflare R2
- 免费额度：10GB 存储
- 足够中小型网站使用

---

## 🎯 下一步建议

### 优先级 1: 测试功能

- [ ] 测试前台所有页面
- [ ] 测试后台所有功能
- [ ] 检查移动端显示

### 优先级 2: 配置图片上传（如果需要）

- [ ] 创建 R2 存储桶
- [ ] 部署上传 Worker
- [ ] 更新配置文件
- [ ] 测试上传功能

### 优先级 3: 配置自定义域名（可选）

- [ ] 添加域名到 Cloudflare
- [ ] 配置 DNS 记录
- [ ] 绑定到 Pages 项目

### 优先级 4: 内容管理

- [ ] 添加真实的商店数据
- [ ] 添加真实的优惠券
- [ ] 配置分类
- [ ] 上传商店 logo

---

## 📚 相关文档

- `README_DEPLOY.md` - 部署指南
- `CLOUDFLARE_DEPLOYMENT.md` - 详细技术文档
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `GITHUB_DETAILED_GUIDE.md` - GitHub 使用指南

---

## ❓ 遇到问题？

### 网站无法访问？

1. 检查 Cloudflare Dashboard 中的部署状态
2. 查看部署日志是否有错误
3. 确认 URL 是否正确

### 图片无法显示？

1. 检查是否配置了 R2 上传
2. 检查 `config.js` 中的 URL 是否正确
3. 检查浏览器控制台是否有错误

### 更新后没有生效？

1. 等待 1-2 分钟（自动部署需要时间）
2. 清除浏览器缓存
3. 检查 GitHub 仓库是否有最新代码

---

## 🎉 完成！

你的网站已经成功部署并运行！

**记住：**
- 每次修改代码后，执行 `git push` 即可自动更新
- Cloudflare 会自动处理部署
- 所有服务都是免费的

**享受你的新网站吧！** 🚀
