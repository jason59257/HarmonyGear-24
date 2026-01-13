# 修复图片上传功能

## 已完成的修复

1. ✅ 在 API Worker 中添加了 `/api/upload` 端点
2. ✅ 更新了 `admin/js/config.js` 中的上传 URL
3. ✅ 部署了更新后的 Worker

## 需要配置 R2 公共访问域名

目前 `R2_PUBLIC_URL` 还是占位符 `https://pub-xxxxx.r2.dev`，需要配置真实的 R2 公共访问域名。

### 方法 1：使用 R2 公共域名（推荐）

1. 登录 Cloudflare Dashboard
2. 进入 **R2** → **Manage R2 API**
3. 找到你的 `coupon-images` bucket
4. 点击 bucket 名称进入设置
5. 在 **Public Access** 部分，启用公共访问
6. 复制公共域名（格式类似：`https://pub-xxxxx.r2.dev`）
7. 更新 `wrangler.toml` 中的 `R2_PUBLIC_URL`：

```toml
[vars]
R2_PUBLIC_URL = "https://pub-你的实际域名.r2.dev"
```

8. 重新部署 Worker：

```bash
npm run wrangler -- deploy
```

### 方法 2：使用自定义域名（可选）

如果你有自己的域名，可以：
1. 在 R2 bucket 设置中配置自定义域名
2. 更新 `R2_PUBLIC_URL` 为你的自定义域名

## 测试图片上传

配置完成后：

1. 登录后台管理系统
2. 进入 **Stores** 页面
3. 点击 **"+ Add Store"** 按钮
4. 在 **Store Logo** 部分上传图片
5. 应该能够成功上传并显示预览

## 如果仍然无法上传

请检查：

1. **浏览器控制台**：查看是否有错误信息
2. **Worker 日志**：运行 `npm run wrangler -- tail` 查看实时日志
3. **R2 配置**：确认 R2 bucket 名称和公共访问已正确配置
4. **认证**：确认已登录且 token 有效

## 常见错误

### 错误：403 Forbidden
- **原因**：未登录或 token 过期
- **解决**：重新登录后台

### 错误：R2_PUBLIC_URL 无效
- **原因**：R2 公共域名未配置
- **解决**：按照上面的步骤配置 R2 公共访问

### 错误：文件太大
- **原因**：文件超过 5MB
- **解决**：压缩图片或使用更小的文件
