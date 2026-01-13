# 快速开始 - 预览网站

## ⚠️ 重要提示

**不能直接双击 HTML 文件打开！** 必须使用 HTTP 服务器。

## 🎯 最简单的方式（推荐）

### 一键启动所有服务

```bash
cd /Users/mac/Desktop/coupon-website
./start-all.sh
```

这会同时启动：
- ✅ 图片上传服务器（端口 3000）- **支持在后台直接上传图片**
- ✅ 网站服务器（端口 8000）

然后访问：**http://localhost:8000**

---

## 📤 图片上传功能

### ✅ 是的，可以直接在网站后台上传！

启动服务器后，在后台管理页面：
1. 访问：http://localhost:8000/admin/login.html
2. 登录后台（任意用户名密码即可）
3. 进入"Stores"管理页面
4. 点击"Add Store"或编辑商店
5. **直接在表单中上传Logo图片** - 支持拖拽或点击上传

### 启动方式

**方式一：一键启动（推荐）**
```bash
./start-all.sh
```

**方式二：只启动上传服务器（如果网站服务器已在运行）**
```bash
./start-upload-python.sh
# 或
python3 upload_server.py
```

**方式三：使用 Node.js 版本（可选）**
```bash
npm install  # 首次运行
npm start
```

## 🚀 快速启动（3步）

### 1. 打开终端，进入项目目录
```bash
cd /Users/mac/Desktop/coupon-website
```

### 2. 启动服务器
```bash
python3 -m http.server 8000
```

或者直接运行：
```bash
./start-server.sh
```

### 3. 打开浏览器访问
```
http://localhost:8000
```

### 方式一：使用一键启动脚本（推荐）

```bash
./start-all.sh
```

### 方式二：分别启动

**终端1 - 启动上传服务器**：
```bash
./start-upload-server.sh
# 或
npm start
```

**终端2 - 启动网站服务器**：
```bash
python3 -m http.server 8000
```

### 方式三：只启动网站（上传功能会使用模拟模式）

如果不需要上传图片，可以只启动网站服务器：
```bash
python3 -m http.server 8000
```
上传功能会自动降级到模拟模式（使用占位图片）。

---

## 📄 主要页面

- **首页**: http://localhost:8000/index.html
- **商店列表**: http://localhost:8000/stores.html  
- **优惠券**: http://localhost:8000/coupons.html
- **用户中心**: http://localhost:8000/user-dashboard.html

## 🔐 后台管理

1. 访问: http://localhost:8000/admin/login.html
2. 任意输入用户名和密码即可登录（演示模式）
3. 登录后可以访问：
   - 仪表板: http://localhost:8000/admin/dashboard.html
   - 商店管理: http://localhost:8000/admin/stores.html
   - 数据分析: http://localhost:8000/admin/analytics.html

## 🛑 停止服务器

在终端中按 `Ctrl + C`

## ❓ 常见问题

### Q: 为什么不能直接打开 HTML 文件？
A: 因为使用了 ES6 模块（import/export），浏览器安全策略不允许 file:// 协议加载模块。

### Q: 提示 "Cannot find module" 错误？
A: 确保使用 HTTP 服务器访问，而不是直接打开文件。

### Q: 页面显示空白？
A: 检查浏览器控制台（F12）是否有错误信息。

### Q: 如何修改端口？
A: 将命令中的 `8000` 改为其他端口号，如 `8080`。
