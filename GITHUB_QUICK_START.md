# GitHub 快速开始指南

## 🚀 5 分钟快速上手

### 步骤 1: 注册 GitHub（2 分钟）

1. 访问：https://github.com
2. 点击 **Sign up**
3. 填写：邮箱、密码、用户名
4. 验证邮箱

### 步骤 2: 创建仓库（1 分钟）

1. 登录 GitHub
2. 点击右上角 **+** → **New repository**
3. 名称：`coupon-website`
4. 选择 **Public**
5. 点击 **Create repository**

### 步骤 3: 推送代码（2 分钟）

在终端执行：

```bash
# 进入项目目录
cd /Users/mac/Desktop/coupon-website

# 初始化 Git
git init

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 连接 GitHub（替换为你的用户名和仓库名）
git remote add origin https://github.com/你的用户名/coupon-website.git

# 推送
git branch -M main
git push -u origin main
```

**注意：** 推送时需要输入 GitHub 用户名和 Personal Access Token（不是密码！）

### 创建 Personal Access Token

1. GitHub → 头像 → **Settings**
2. 最下方 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. 勾选 `repo` 权限
6. 点击 **Generate token**
7. **立即复制 token**（只显示一次！）

推送时，密码处粘贴这个 token。

---

## 📝 之后每次更新

```bash
git add .
git commit -m "更新描述"
git push
```

就这么简单！

---

## ❓ 遇到问题？

查看详细指南：`GITHUB_DETAILED_GUIDE.md`
