# 最简单的 Cloudflare 部署方法（不使用 Git）

## 🎯 3 步完成部署

### 步骤 1: 安装工具

```bash
npm install -g wrangler
```

### 步骤 2: 登录 Cloudflare

```bash
wrangler login
```

浏览器会自动打开，点击 **Allow** 授权。

### 步骤 3: 上传网站

```bash
cd /Users/mac/Desktop/coupon-website
wrangler pages deploy . --project-name=coupon-website
```

**完成！** 🎉

你会得到一个 URL，例如：`https://coupon-website.pages.dev`

---

## 📝 更新网站

修改文件后，重新执行：

```bash
wrangler pages deploy . --project-name=coupon-website
```

---

## ❓ 常见问题

**Q: 需要 GitHub 吗？**
A: 不需要！直接上传即可。

**Q: 需要付费吗？**
A: 完全免费！

**Q: 如何修改项目名称？**
A: 将命令中的 `coupon-website` 改为你想要的名称。

**Q: 上传失败怎么办？**
A: 检查是否已登录：`wrangler whoami`

---

## 🔄 与 Git 方式的区别

| | 直接上传 | Git 集成 |
|---|---|---|
| **需要 GitHub** | ❌ 不需要 | ✅ 需要 |
| **部署方式** | 手动执行命令 | 自动（推送代码） |
| **更新速度** | 每次手动上传 | 自动部署 |
| **版本历史** | ❌ 无 | ✅ 完整历史 |
| **适合场景** | 个人项目、测试 | 团队项目、持续开发 |

**选择建议：**
- 只是测试 → 直接上传
- 需要经常更新 → 使用 Git（学习 5 分钟即可）

---

就这么简单！不需要 GitHub，直接上传即可。
