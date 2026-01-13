#!/bin/bash

# 启动本地服务器预览网站

echo "🚀 启动本地服务器..."
echo "📁 项目目录: $(pwd)"
echo ""
echo "服务器将在以下地址启动:"
echo "  http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 检查Python版本并启动服务器
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "❌ 错误: 未找到 Python，请先安装 Python"
    exit 1
fi
