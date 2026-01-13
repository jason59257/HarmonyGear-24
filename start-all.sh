#!/bin/bash

# 同时启动上传服务器和网站服务器

echo "🚀 启动所有服务..."
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python 3"
    exit 1
fi

# 创建 uploads 目录
mkdir -p uploads

# 启动上传服务器（后台）- 使用 Python 版本
echo "📤 启动图片上传服务器 (端口 3000)..."
python3 upload_server.py &
UPLOAD_SERVER_PID=$!

# 等待一下让上传服务器启动
sleep 2

# 启动网站服务器（后台）
echo "🌐 启动网站服务器 (端口 8000)..."
python3 -m http.server 8000 &
WEB_SERVER_PID=$!

echo ""
echo "✅ 所有服务已启动！"
echo ""
echo "📤 图片上传服务器: http://localhost:3000"
echo "🌐 网站服务器: http://localhost:8000"
echo ""
echo "访问网站: http://localhost:8000"
echo "访问后台: http://localhost:8000/admin/login.html"
echo ""
echo "💡 在后台管理页面可以直接上传图片！"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 等待用户中断
trap "kill $UPLOAD_SERVER_PID $WEB_SERVER_PID 2>/dev/null; exit" INT TERM

# 保持脚本运行
wait
