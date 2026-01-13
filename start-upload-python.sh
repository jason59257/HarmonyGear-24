#!/bin/bash

# 启动 Python 版本的图片上传服务器

echo "🚀 启动图片上传服务器（Python版本）..."
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python 3"
    exit 1
fi

# 创建 uploads 目录
mkdir -p uploads

echo "✅ 服务器启动中..."
echo "📁 上传目录: $(pwd)/uploads"
echo "🌐 服务器地址: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

python3 upload_server.py
