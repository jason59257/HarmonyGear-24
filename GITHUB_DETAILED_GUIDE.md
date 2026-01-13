# GitHub 详细操作指南

本指南将详细说明如何使用 GitHub 进行代码管理和部署。

---

## 📋 目录

1. [注册 GitHub 账号](#第一步注册-github-账号)
2. [安装 Git](#第二步安装-git)
3. [配置 Git](#第三步配置-git)
4. [创建 GitHub 仓库](#第四步创建-github-仓库)
5. [推送代码到 GitHub](#第五步推送代码到-github)
6. [连接 Cloudflare](#第六步连接-cloudflare)
7. [后续更新流程](#后续更新流程)
8. [常见问题](#常见问题)

---

## 第一步：注册 GitHub 账号

### 1.1 访问 GitHub

1. 打开浏览器，访问：**https://github.com**
2. 点击右上角的 **Sign up**（注册）按钮

### 1.2 填写注册信息

1. **Email（邮箱）**
   - 输入你的邮箱地址
   - 例如：`yourname@example.com`
   - 点击 **Continue**

2. **Password（密码）**
   - 设置一个强密码（至少 8 个字符）
   - 建议包含大小写字母、数字和特殊字符
   - 点击 **Continue**

3. **Username（用户名）**
   - 输入你想要的用户名（例如：`yourname`）
   - 如果用户名已被使用，GitHub 会提示你
   - 点击 **Continue**

4. **Email preferences（邮件偏好）**
   - 选择是否接收产品更新邮件（可选）
   - 点击 **Continue**

5. **Verify your account（验证账号）**
   - 完成人机验证（验证码）
   - 点击 **Create account**

### 1.3 验证邮箱

1. 检查你的邮箱收件箱
2. 找到 GitHub 发送的验证邮件
3. 点击邮件中的验证链接
4. 完成验证

✅ **GitHub 账号注册完成！**

---

## 第二步：安装 Git

Git 是一个版本控制工具，需要在你的电脑上安装。

### 2.1 检查是否已安装 Git

打开终端（Terminal），输入：

```bash
git --version
```

如果显示版本号（例如：`git version 2.39.0`），说明已安装，可以跳到第三步。

如果显示 `command not found`，需要安装。

### 2.2 在 macOS 上安装 Git

**方法一：使用 Homebrew（推荐）**

1. 如果没有 Homebrew，先安装：
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. 安装 Git：
   ```bash
   brew install git
   ```

**方法二：使用 Xcode Command Line Tools**

```bash
xcode-select --install
```

**方法三：从官网下载**

1. 访问：https://git-scm.com/download/mac
2. 下载安装包
3. 双击安装

### 2.3 验证安装

```bash
git --version
```

应该显示版本号，例如：`git version 2.39.0`

✅ **Git 安装完成！**

---

## 第三步：配置 Git

### 3.1 设置用户名

```bash
git config --global user.name "你的名字"
```

例如：
```bash
git config --global user.name "John Doe"
```

### 3.2 设置邮箱

```bash
git config --global user.email "你的邮箱"
```

**重要：** 使用你注册 GitHub 时使用的邮箱！

例如：
```bash
git config --global user.email "yourname@example.com"
```

### 3.3 验证配置

```bash
git config --global user.name
git config --global user.email
```

应该显示你刚才设置的信息。

### 3.4 设置默认分支名称（可选）

```bash
git config --global init.defaultBranch main
```

✅ **Git 配置完成！**

---

## 第四步：创建 GitHub 仓库

### 4.1 登录 GitHub

1. 访问：https://github.com
2. 点击右上角 **Sign in**（登录）
3. 输入用户名和密码登录

### 4.2 创建新仓库

1. 点击右上角的 **+** 号
2. 选择 **New repository**（新建仓库）

### 4.3 填写仓库信息

1. **Repository name（仓库名称）**
   - 输入：`coupon-website`
   - 或任何你喜欢的名称

2. **Description（描述）**（可选）
   - 输入：`优惠券网站项目`
   - 或留空

3. **Visibility（可见性）**
   - **Public（公开）**：任何人都可以看到（推荐，免费）
   - **Private（私有）**：只有你可以看到（需要付费账号）
   - 选择 **Public**

4. **其他选项**
   - ❌ **不要**勾选 "Add a README file"（我们已经有代码了）
   - ❌ **不要**勾选 "Add .gitignore"（我们已经有 .gitignore 了）
   - ❌ **不要**勾选 "Choose a license"（可选）

5. 点击 **Create repository**（创建仓库）

### 4.4 复制仓库地址

创建完成后，GitHub 会显示一个页面，上面有仓库地址，例如：
```
https://github.com/你的用户名/coupon-website.git
```

**复制这个地址，稍后会用到！**

✅ **GitHub 仓库创建完成！**

---

## 第五步：推送代码到 GitHub

### 5.1 打开终端

1. 打开 **Terminal**（终端）
   - macOS：按 `Command + 空格`，输入 "Terminal"，回车

2. 进入项目目录：
   ```bash
   cd /Users/mac/Desktop/coupon-website
   ```

### 5.2 初始化 Git 仓库

```bash
git init
```

输出应该类似：`Initialized empty Git repository in /Users/mac/Desktop/coupon-website/.git`

### 5.3 添加所有文件

```bash
git add .
```

这个命令会将项目中的所有文件添加到 Git 的暂存区。

**说明：**
- `.` 表示当前目录的所有文件
- 这会添加所有文件，包括 HTML、CSS、JS 等

### 5.4 提交代码

```bash
git commit -m "Initial commit: 优惠券网站项目"
```

**说明：**
- `commit` 是提交的意思
- `-m` 后面是提交信息，描述这次提交做了什么
- 你可以写任何描述，例如：`"Initial commit"` 或 `"首次提交"`

### 5.5 重命名分支（如果需要）

```bash
git branch -M main
```

**说明：**
- 将当前分支重命名为 `main`（GitHub 的默认分支名）
- 如果已经是 `main`，这个命令不会报错

### 5.6 连接远程仓库

```bash
git remote add origin https://github.com/你的用户名/coupon-website.git
```

**重要：** 将 `你的用户名` 和 `coupon-website` 替换为你实际的用户名和仓库名！

例如，如果你的用户名是 `john`，仓库名是 `coupon-website`：
```bash
git remote add origin https://github.com/john/coupon-website.git
```

### 5.7 推送代码到 GitHub

```bash
git push -u origin main
```

**说明：**
- `push` 是推送的意思，将本地代码上传到 GitHub
- `-u` 表示设置上游分支
- `origin` 是远程仓库的别名
- `main` 是分支名

### 5.8 输入 GitHub 凭证

第一次推送时，Git 会要求你输入 GitHub 的用户名和密码：

1. **Username（用户名）**：输入你的 GitHub 用户名
2. **Password（密码）**：**不是你的 GitHub 密码！**

**重要：** GitHub 从 2021 年开始不再支持密码验证，需要使用 **Personal Access Token（个人访问令牌）**。

#### 创建 Personal Access Token

1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单最下方 → **Developer settings**
4. 点击 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token** → **Generate new token (classic)**
6. 填写信息：
   - **Note（备注）**：`Cloudflare Deployment`
   - **Expiration（过期时间）**：选择 `No expiration`（不过期）或设置一个日期
   - **Select scopes（选择权限）**：勾选 `repo`（完整仓库访问权限）
7. 点击 **Generate token**
8. **重要：** 立即复制生成的 token（只显示一次！）
   - 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 使用 Token 推送

再次执行推送命令：
```bash
git push -u origin main
```

当提示输入密码时，**粘贴刚才复制的 token**（不是密码！）

**或者，使用更安全的方式：**

```bash
# 使用 token 作为密码
git push -u origin main
# Username: 你的GitHub用户名
# Password: 粘贴你的token
```

### 5.9 验证推送成功

1. 刷新你的 GitHub 仓库页面
2. 你应该能看到所有项目文件
3. 包括：`index.html`、`admin/` 文件夹等

✅ **代码已成功推送到 GitHub！**

---

## 第六步：连接 Cloudflare

### 6.1 登录 Cloudflare

1. 访问：https://dash.cloudflare.com
2. 如果没有账号，点击 **Sign Up** 注册（免费）
3. 登录账号

### 6.2 创建 Pages 项目

1. 左侧菜单点击 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

### 6.3 授权 GitHub

1. 点击 **Authorize Cloudflare**
2. 选择你的 GitHub 账号
3. 点击 **Authorize Cloudflare**
4. 可能会要求输入 GitHub 密码确认

### 6.4 选择仓库

1. 在仓库列表中找到 `coupon-website`（或你的仓库名）
2. 点击 **Begin setup**

### 6.5 配置项目

1. **Project name（项目名称）**
   - 输入：`coupon-website`
   - 或任何你喜欢的名称

2. **Production branch（生产分支）**
   - 选择：`main`
   - 这是你的主分支

3. **Framework preset（框架预设）**
   - 选择：**None** 或 **Other**
   - 因为这是静态网站，不需要构建框架

4. **Build command（构建命令）**
   - 留空
   - 静态网站不需要构建

5. **Build output directory（构建输出目录）**
   - 输入：`.`（一个点号）
   - 这表示根目录，因为你的 HTML 文件在根目录

6. **Root directory（根目录）**
   - 留空或输入：`/`
   - 默认即可

### 6.6 环境变量（可选）

暂时不需要，留空即可。

### 6.7 部署

1. 点击 **Save and Deploy**
2. 等待 1-2 分钟
3. 看到 "Success" 表示部署成功

### 6.8 访问网站

部署完成后，你会得到一个 URL，例如：
```
https://coupon-website-xxx.pages.dev
```

- **前台**：`https://coupon-website-xxx.pages.dev/`
- **后台**：`https://coupon-website-xxx.pages.dev/admin/`

✅ **部署完成！**

---

## 后续更新流程

以后每次修改代码后，只需要 3 步：

### 1. 添加修改的文件

```bash
cd /Users/mac/Desktop/coupon-website
git add .
```

### 2. 提交修改

```bash
git commit -m "描述你做了什么修改"
```

例如：
```bash
git commit -m "更新商店列表"
git commit -m "添加新优惠券"
git commit -m "修复图片上传问题"
```

### 3. 推送到 GitHub

```bash
git push
```

**注意：** 第一次之后，只需要 `git push`，不需要 `-u origin main`。

### 4. 自动部署

- Cloudflare 会自动检测到代码更新
- 通常在 1-2 分钟内自动重新部署
- 你可以在 Cloudflare Dashboard 的 **Deployments** 页面查看部署状态

---

## 常用 Git 命令总结

```bash
# 查看状态（查看哪些文件被修改了）
git status

# 添加所有修改的文件
git add .

# 提交修改
git commit -m "描述信息"

# 推送到 GitHub
git push

# 查看提交历史
git log

# 查看远程仓库地址
git remote -v
```

---

## 常见问题

### Q1: 推送时提示 "Authentication failed"（认证失败）

**A:** 
1. 确认你使用的是 Personal Access Token，不是密码
2. 确认 token 有 `repo` 权限
3. 如果 token 过期，重新生成一个

### Q2: 推送时提示 "remote: Support for password authentication was removed"

**A:** 
- GitHub 不再支持密码验证
- 必须使用 Personal Access Token
- 按照上面的步骤创建 token

### Q3: 推送时提示 "repository not found"（仓库未找到）

**A:** 
1. 检查仓库地址是否正确
2. 确认仓库名称拼写正确
3. 确认你有该仓库的访问权限

### Q4: 如何查看我的 GitHub 用户名？

**A:** 
1. 登录 GitHub
2. 点击右上角头像
3. 用户名显示在菜单中

### Q5: 如何查看我的仓库地址？

**A:** 
1. 打开你的 GitHub 仓库页面
2. 点击绿色的 **Code** 按钮
3. 复制 HTTPS 地址

### Q6: 忘记保存 Personal Access Token 怎么办？

**A:** 
1. 重新生成一个新的 token
2. 在 GitHub Settings → Developer settings → Personal access tokens
3. 可以删除旧的 token，创建新的

### Q7: 如何更新 Personal Access Token？

**A:** 
1. 在 Git 配置中更新凭证
2. macOS 可以使用：
   ```bash
   git credential-osxkeychain erase
   host=github.com
   protocol=https
   ```
3. 下次推送时会要求重新输入

### Q8: 推送后 Cloudflare 没有自动部署？

**A:** 
1. 检查 Cloudflare Pages 项目是否正确连接了 GitHub 仓库
2. 等待 1-2 分钟（有时需要时间）
3. 在 Cloudflare Dashboard 的 Deployments 页面查看状态
4. 可以手动触发部署：点击 "Retry deployment"

### Q9: 如何撤销一次提交？

**A:** 
```bash
# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最后一次提交（删除修改）
git reset --hard HEAD~1
```

### Q10: 如何查看我做了哪些修改？

**A:** 
```bash
# 查看修改的文件
git status

# 查看具体的修改内容
git diff
```

---

## 📝 完整操作流程总结

### 首次设置（只需一次）

1. ✅ 注册 GitHub 账号
2. ✅ 安装 Git
3. ✅ 配置 Git（用户名和邮箱）
4. ✅ 创建 GitHub 仓库
5. ✅ 推送代码到 GitHub
6. ✅ 连接 Cloudflare Pages

### 日常更新（每次修改代码）

1. ✅ 修改代码
2. ✅ `git add .`
3. ✅ `git commit -m "描述"`
4. ✅ `git push`
5. ✅ Cloudflare 自动部署

---

## 🎉 完成！

现在你已经掌握了：
- ✅ 如何使用 GitHub
- ✅ 如何推送代码
- ✅ 如何连接 Cloudflare
- ✅ 如何更新网站

**提示：** 第一次设置可能比较复杂，但之后每次更新只需要 3 个命令，非常方便！

如有问题，请查看常见问题部分或联系我。
