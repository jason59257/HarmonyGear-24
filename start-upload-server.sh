#!/bin/bash

# 启动图片上传服务器

echo "🚀 启动图片上传服务器..."
echo ""

# 检查是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    echo ""
fi

# 创建 uploads 目录
mkdir -p uploads

# 启动服务器
echo "✅ 服务器启动中..."
echo "📁 上传目录: $(pwd)/uploads"
echo "🌐 服务器地址: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

node server.js
