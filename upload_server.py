#!/usr/bin/env python3
"""
简单的图片上传服务器
使用 Python 内置的 http.server 和 cgi 模块
运行: python3 upload_server.py
"""

import http.server
import socketserver
import cgi
import os
import json
import urllib.parse
from datetime import datetime
import uuid

PORT = 3000
UPLOAD_DIR = 'uploads'

# 创建上传目录
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class UploadHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """处理文件上传"""
        if self.path == '/api/upload':
            try:
                # 解析 multipart/form-data
                content_type = self.headers['Content-Type']
                if not content_type or 'multipart/form-data' not in content_type:
                    self.send_error(400, "Content-Type must be multipart/form-data")
                    return

                # 解析边界
                boundary = content_type.split('boundary=')[1].encode()
                
                # 读取请求体
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                # 解析文件
                files = self.parse_multipart(post_data, boundary)
                
                if 'image' not in files:
                    self.send_error(400, "No file uploaded")
                    return
                
                file_data = files['image']
                filename = file_data['filename']
                file_content = file_data['content']
                
                # 验证文件类型
                allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
                file_ext = os.path.splitext(filename)[1].lower()
                if file_ext not in allowed_extensions:
                    self.send_error(400, f"File type not allowed. Allowed: {', '.join(allowed_extensions)}")
                    return
                
                # 验证文件大小（5MB）
                if len(file_content) > 5 * 1024 * 1024:
                    self.send_error(400, "File size exceeds 5MB limit")
                    return
                
                # 生成唯一文件名
                unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}{file_ext}"
                file_path = os.path.join(UPLOAD_DIR, unique_filename)
                
                # 保存文件
                with open(file_path, 'wb') as f:
                    f.write(file_content)
                
                # 返回成功响应
                response = {
                    'success': True,
                    'data': {
                        'url': f'/uploads/{unique_filename}',
                        'filename': unique_filename,
                        'originalName': filename,
                        'size': len(file_content)
                    }
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                self.send_error(500, f"Upload error: {str(e)}")
        else:
            self.send_error(404)

    def parse_multipart(self, data, boundary):
        """解析 multipart/form-data"""
        files = {}
        parts = data.split(boundary)
        
        for part in parts:
            if b'Content-Disposition' not in part:
                continue
            
            # 提取文件名和字段名
            lines = part.split(b'\r\n')
            disposition = None
            content_start = 0
            
            for i, line in enumerate(lines):
                if line.startswith(b'Content-Disposition'):
                    disposition = line.decode('utf-8', errors='ignore')
                if line == b'' and i < len(lines) - 1:
                    content_start = i + 1
                    break
            
            if not disposition:
                continue
            
            # 提取字段名和文件名
            if 'name="image"' in disposition:
                filename = None
                if 'filename=' in disposition:
                    filename = disposition.split('filename=')[1].strip('"')
                
                if filename:
                    # 提取文件内容
                    content = b'\r\n'.join(lines[content_start:])
                    # 移除末尾的边界标记
                    if content.endswith(b'--'):
                        content = content[:-2]
                    content = content.rstrip(b'\r\n')
                    
                    files['image'] = {
                        'filename': filename,
                        'content': content
                    }
        
        return files

    def do_GET(self):
        """处理 GET 请求 - 提供静态文件服务"""
        if self.path.startswith('/uploads/'):
            # 提供上传的文件
            file_path = self.path[1:]  # 移除前导 /
            if os.path.exists(file_path) and os.path.isfile(file_path):
                self.send_response(200)
                # 根据文件扩展名设置 Content-Type
                ext = os.path.splitext(file_path)[1].lower()
                content_types = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.webp': 'image/webp'
                }
                self.send_header('Content-Type', content_types.get(ext, 'application/octet-stream'))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
        
        # 健康检查
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {'status': 'ok', 'message': 'Upload server is running'}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # 默认返回 404
        self.send_error(404)

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), UploadHandler) as httpd:
        print(f"🚀 图片上传服务器运行在 http://localhost:{PORT}")
        print(f"📁 上传目录: {os.path.abspath(UPLOAD_DIR)}")
        print(f"\n✅ 服务器已启动！")
        print(f"📤 上传接口: http://localhost:{PORT}/api/upload")
        print(f"🔍 健康检查: http://localhost:{PORT}/api/health")
        print(f"\n按 Ctrl+C 停止服务器\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n服务器已停止")
