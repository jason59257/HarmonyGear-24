# 图片上传服务器设置指南

## 概述

现在项目支持真实的图片上传功能！需要启动一个简单的Node.js服务器来处理图片上传。

## 快速开始

### 1. 安装依赖

```bash
cd /Users/mac/Desktop/coupon-website
npm install
```

### 2. 启动上传服务器

```bash
npm start
```

或者：

```bash
node server.js
```

服务器将在 `http://localhost:3000` 启动。

### 3. 启动网站服务器

在另一个终端窗口：

```bash
# 启动网站服务器（用于预览网站）
python3 -m http.server 8000
```

## 使用说明

### 启动顺序

1. **先启动上传服务器**（必须）：
   ```bash
   npm start
   ```
   看到以下信息表示启动成功：
   ```
   🚀 Image upload server running on http://localhost:3000
   📁 Upload directory: /Users/mac/Desktop/coupon-website/uploads
   ```

2. **再启动网站服务器**：
   ```bash
   python3 -m http.server 8000
   ```

3. **访问网站**：
   - 网站: http://localhost:8000
   - 后台管理: http://localhost:8000/admin/login.html

### 上传功能

- **上传位置**: 图片会保存到 `uploads/` 目录
- **访问图片**: 上传后的图片可以通过 `http://localhost:3000/uploads/文件名` 访问
- **文件限制**: 
  - 最大文件大小: 5MB
  - 支持格式: JPEG, JPG, PNG, GIF, WebP

### 如果上传服务器未运行

如果上传服务器未运行，系统会自动降级到模拟上传模式（使用占位图片），不会报错。

## 服务器配置

### 修改端口

如果需要修改上传服务器端口，编辑 `server.js`：

```javascript
const PORT = 3000; // 改为你想要的端口
```

然后更新 `admin/js/api.js` 中的 `uploadUrl`：

```javascript
const uploadUrl = 'http://localhost:YOUR_PORT/api/upload';
```

### 修改上传目录

编辑 `server.js`：

```javascript
const uploadsDir = path.join(__dirname, 'uploads'); // 改为你想要的目录
```

### 修改文件大小限制

编辑 `server.js`：

```javascript
limits: {
    fileSize: 5 * 1024 * 1024 // 改为你想要的大小（字节）
}
```

## 项目结构

```
coupon-website/
├── server.js              # 上传服务器
├── package.json           # Node.js 依赖
├── uploads/               # 上传的图片存储目录（自动创建）
├── admin/
│   └── js/
│       └── api.js         # API接口（已更新支持真实上传）
└── ...
```

## 故障排除

### 问题：npm install 失败

**解决方案**：
- 确保已安装 Node.js（版本 14+）
- 检查网络连接
- 尝试使用 `npm install --legacy-peer-deps`

### 问题：端口被占用

**解决方案**：
- 修改 `server.js` 中的 `PORT` 变量
- 或关闭占用端口的其他程序

### 问题：上传失败

**检查清单**：
1. 上传服务器是否正在运行？
2. 文件大小是否超过5MB？
3. 文件格式是否支持？
4. 浏览器控制台是否有错误信息？

### 问题：图片无法显示

**解决方案**：
- 确保上传服务器正在运行
- 检查图片URL是否正确
- 检查 `uploads/` 目录权限

## 生产环境部署

在生产环境中，建议：

1. **使用专业的文件存储服务**：
   - AWS S3
   - Google Cloud Storage
   - 阿里云OSS
   - 腾讯云COS

2. **添加身份验证**：
   - 在 `/api/upload` 端点添加JWT验证
   - 确保只有管理员可以上传

3. **添加图片处理**：
   - 自动压缩大图片
   - 生成缩略图
   - 图片格式转换

4. **使用CDN**：
   - 将图片上传到CDN
   - 提高图片加载速度

## 开发模式（自动重启）

如果安装了 `nodemon`，可以使用：

```bash
npm run dev
```

这样服务器会在代码更改时自动重启。

## 注意事项

1. **uploads目录**: 确保 `uploads/` 目录有写入权限
2. **文件安全**: 当前实现是基础版本，生产环境需要添加更多安全检查
3. **存储空间**: 定期清理不需要的图片文件
4. **备份**: 定期备份 `uploads/` 目录
