# 如何查看 Cloudflare Worker 日志

## 方法一：通过 Cloudflare Dashboard（推荐）

### 步骤 1：登录 Cloudflare Dashboard
1. 访问：https://dash.cloudflare.com
2. 登录你的 Cloudflare 账号

### 步骤 2：进入 Workers & Pages
1. 在左侧菜单中，点击 **"Workers & Pages"**
2. 或直接访问：https://dash.cloudflare.com/?to=/:account/workers

### 步骤 3：选择你的 Worker
1. 在 Workers 列表中，找到并点击 **"coupon-api"**

### 步骤 4：查看日志
1. 在 Worker 详情页面，点击顶部的 **"Logs"** 标签
2. 你会看到实时的日志输出
3. 可以筛选日志级别（Errors, Warnings, Info）

---

## 方法二：使用 Wrangler CLI（本地）

### 步骤 1：打开终端
在你的项目目录中打开终端

### 步骤 2：运行日志命令
```bash
cd /Users/mac/Desktop/coupon-website
npm run wrangler -- tail
```

这会实时显示 Worker 的日志输出。

### 步骤 3：过滤日志
```bash
# 只显示错误
npm run wrangler -- tail --format=pretty --status=error

# 只显示特定 Worker
npm run wrangler -- tail coupon-api
```

---

## 方法三：通过 API 查看（高级）

你也可以通过 Cloudflare API 获取日志，但 Dashboard 方法更简单。

---

## 现在查看日志

### 快速步骤：
1. 访问：https://dash.cloudflare.com
2. 点击左侧 **"Workers & Pages"**
3. 点击 **"coupon-api"**
4. 点击 **"Logs"** 标签
5. 现在尝试导入分类，日志会实时显示

### 在日志中查找：
查找包含以下关键词的日志：
- `requireAuth`
- `requireAdmin`
- `Role:`
- `Admin check`
- `Categories POST`

---

## 如果看不到日志

1. **确保 Worker 已部署**：检查 Worker 是否正常运行
2. **检查日志级别**：确保选择了正确的日志级别（Errors, Warnings, Info）
3. **刷新页面**：有时需要刷新才能看到新日志
4. **检查时间范围**：确保查看的是正确的时间范围

---

## 实时测试

1. **打开 Worker 日志页面**（方法一）
2. **打开导入分类页面**（另一个标签页）
3. **点击导入按钮**
4. **立即切换到日志页面**，查看实时日志输出

这样你就能看到：
- Token 是否正确解析
- Role 是什么
- 为什么权限检查失败
