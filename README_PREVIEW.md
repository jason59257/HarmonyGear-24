# 如何预览网站

## 问题说明

由于项目使用了 ES6 模块（`import/export`），不能直接双击 HTML 文件打开。需要使用本地 HTTP 服务器来预览。

## 方法一：使用启动脚本（推荐）

### macOS/Linux:
```bash
cd /Users/mac/Desktop/coupon-website
./start-server.sh
```

### Windows:
双击 `start-server.bat` 文件

然后在浏览器中打开：**http://localhost:8000**

## 方法二：使用 Python

```bash
cd /Users/mac/Desktop/coupon-website
python3 -m http.server 8000
```

然后在浏览器中打开：**http://localhost:8000**

## 方法三：使用 Node.js (如果已安装)

```bash
cd /Users/mac/Desktop/coupon-website
npx http-server -p 8000
```

## 方法四：使用 VS Code Live Server

1. 在 VS Code 中安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 访问页面

启动服务器后，访问以下页面：

- **首页**: http://localhost:8000/index.html
- **商店列表**: http://localhost:8000/stores.html
- **优惠券列表**: http://localhost:8000/coupons.html
- **用户中心**: http://localhost:8000/user-dashboard.html
- **后台登录**: http://localhost:8000/admin/login.html
- **后台管理**: http://localhost:8000/admin/dashboard.html

## 注意事项

1. **必须使用 HTTP 服务器**，不能直接用 `file://` 协议打开
2. 后台管理需要先登录（用户名和密码可以任意，只是演示）
3. 所有数据都是模拟数据，存储在浏览器内存中

## 停止服务器

按 `Ctrl + C` 停止服务器
