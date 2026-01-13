@echo off
echo 🚀 启动本地服务器...
echo 📁 项目目录: %CD%
echo.
echo 服务器将在以下地址启动:
echo   http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo.

python -m http.server 8000
