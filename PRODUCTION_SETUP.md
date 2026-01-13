# 生产环境配置指南

本指南将帮助你将网站从演示版本转换为生产版本，包括真实数据库、用户认证、图片存储等。

---

## 📋 目录

1. [数据库配置](#1-数据库配置)
2. [用户认证系统](#2-用户认证系统)
3. [图片存储配置](#3-图片存储配置)
4. [后端 API 开发](#4-后端-api-开发)
5. [数据迁移](#5-数据迁移)
6. [安全配置](#6-安全配置)
7. [部署和测试](#7-部署和测试)

---

## 1. 数据库配置

### 选项 A: Cloudflare D1（推荐，免费）

Cloudflare D1 是基于 SQLite 的数据库，完全免费，与 Cloudflare Workers 完美集成。

#### 步骤 1: 创建 D1 数据库

1. Cloudflare Dashboard → **Workers & Pages** → **D1**
2. 点击 **Create database**
3. 名称：`coupon-db`
4. 选择位置（选择离你最近的区域）
5. 点击 **Create**

#### 步骤 2: 创建数据库表

在项目根目录创建 `schema.sql`：

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    is_active INTEGER DEFAULT 1,
    total_cashback REAL DEFAULT 0,
    pending_cashback REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    cashback REAL DEFAULT 0,
    website_url TEXT,
    redirect_url TEXT,
    logo_url TEXT,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT,
    code TEXT,
    discount_type TEXT,
    discount_value REAL,
    min_purchase REAL,
    max_discount REAL,
    expiry_date DATE,
    redirect_url TEXT,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User cashback records
CREATE TABLE IF NOT EXISTS user_cashback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    store_id INTEGER,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coupon_id INTEGER NOT NULL,
    user_id INTEGER,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT,
    price REAL NOT NULL,
    original_price REAL,
    savings_amount REAL,
    savings_percent REAL,
    image_url TEXT,
    redirect_url TEXT,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);
CREATE INDEX IF NOT EXISTS idx_coupons_store ON coupons(store_id);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_featured ON coupons(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_cashback_user ON user_cashback(user_id);
```

#### 步骤 3: 初始化数据库

```bash
# 安装 Wrangler（如果还没有）
npm install -g wrangler

# 登录
wrangler login

# 创建数据库（如果还没有）
wrangler d1 create coupon-db

# 执行 SQL 创建表
wrangler d1 execute coupon-db --file=./schema.sql
```

#### 步骤 4: 配置 wrangler.toml

更新 `wrangler.toml`：

```toml
name = "coupon-api"
main = "workers/api.js"
compatibility_date = "2024-01-01"

# D1 database binding
[[d1_databases]]
binding = "DB"
database_name = "coupon-db"
database_id = "你的数据库ID"  # 在 D1 Dashboard 中查看

# R2 bucket binding
[[r2_buckets]]
binding = "COUPON_IMAGES"
bucket_name = "coupon-images"

# Environment variables
[vars]
R2_PUBLIC_URL = "https://你的R2域名"
JWT_SECRET = "你的JWT密钥（随机生成）"
```

---

### 选项 B: 其他数据库（MySQL/PostgreSQL）

如果你需要使用 MySQL 或 PostgreSQL：

1. **选择数据库服务**：
   - PlanetScale（MySQL，免费层）
   - Supabase（PostgreSQL，免费层）
   - Railway（PostgreSQL，免费试用）
   - 自建数据库服务器

2. **创建数据库连接**：
   - 获取数据库连接字符串
   - 在 Worker 中使用数据库客户端库

---

## 2. 用户认证系统

### 使用 JWT（JSON Web Token）认证

#### 步骤 1: 创建认证 Worker

创建 `workers/auth.js`：

```javascript
// workers/auth.js
import jwt from '@tsndr/cloudflare-worker-jwt';

export async function generateToken(userId, email, role) {
    const secret = env.JWT_SECRET;
    const payload = {
        userId,
        email,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    
    return await jwt.sign(payload, secret);
}

export async function verifyToken(token) {
    try {
        const secret = env.JWT_SECRET;
        const decoded = await jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function hashPassword(password) {
    // 使用 Web Crypto API 进行密码哈希
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function comparePassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}
```

#### 步骤 2: 创建用户注册/登录 API

创建 `workers/api.js`：

```javascript
// workers/api.js
import { generateToken, verifyToken, hashPassword, comparePassword } from './auth.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // 用户注册
        if (path === '/api/register' && method === 'POST') {
            const body = await request.json();
            const { email, password, name } = body;

            // 验证输入
            if (!email || !password) {
                return new Response(JSON.stringify({ error: 'Email and password required' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 检查用户是否已存在
            const existing = await env.DB.prepare(
                'SELECT id FROM users WHERE email = ?'
            ).bind(email).first();

            if (existing) {
                return new Response(JSON.stringify({ error: 'User already exists' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 哈希密码
            const passwordHash = await hashPassword(password);

            // 创建用户
            const result = await env.DB.prepare(
                'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
            ).bind(email, passwordHash, name || '').run();

            // 生成 token
            const token = await generateToken(result.meta.last_row_id, email, 'user');

            return new Response(JSON.stringify({
                success: true,
                token,
                user: { id: result.meta.last_row_id, email, name }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 用户登录
        if (path === '/api/login' && method === 'POST') {
            const body = await request.json();
            const { email, password } = body;

            // 查找用户
            const user = await env.DB.prepare(
                'SELECT * FROM users WHERE email = ?'
            ).bind(email).first();

            if (!user) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 验证密码
            const isValid = await comparePassword(password, user.password_hash);
            if (!isValid) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 生成 token
            const token = await generateToken(user.id, user.email, user.role);

            return new Response(JSON.stringify({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 验证 token（中间件）
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const token = authHeader.substring(7);
        const decoded = await verifyToken(token);
        if (!decoded) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 其他 API 路由...
        // Stores, Coupons, etc.

        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
};
```

#### 步骤 3: 安装 JWT 库

创建 `package.json`（如果还没有）：

```json
{
  "name": "coupon-api",
  "version": "1.0.0",
  "dependencies": {
    "@tsndr/cloudflare-worker-jwt": "^2.0.0"
  }
}
```

---

## 3. 图片存储配置

### 步骤 1: 创建 R2 存储桶（如果还没有）

1. Cloudflare Dashboard → **R2**
2. **Create bucket** → 名称：`coupon-images`
3. 创建完成

### 步骤 2: 启用 R2 公共访问

1. 存储桶 → **Settings** → **Public Access**
2. **Allow Access**
3. 复制公共域名或配置自定义域名

### 步骤 3: 创建图片上传 Worker

更新 `workers/upload-handler.js`（已存在，确保配置正确）：

```javascript
// workers/upload-handler.js
export default {
  async fetch(request, env) {
    // 验证认证
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 处理上传...
    // （使用之前的代码）
  }
};
```

### 步骤 4: 部署 Worker

```bash
wrangler deploy
```

---

## 4. 后端 API 开发

### 创建完整的 API Worker

需要创建以下 API 端点：

- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `GET /api/stores` - 获取商店列表
- `POST /api/stores` - 创建商店
- `PUT /api/stores/:id` - 更新商店
- `DELETE /api/stores/:id` - 删除商店
- `GET /api/coupons` - 获取优惠券列表
- `POST /api/coupons` - 创建优惠券
- `PUT /api/coupons/:id` - 更新优惠券
- `DELETE /api/coupons/:id` - 删除优惠券
- `POST /api/upload` - 上传图片
- 等等...

### 更新前端 API 调用

修改 `admin/js/api.js`，将 Mock API 替换为真实 API 调用：

```javascript
// admin/js/api.js
const API_BASE_URL = 'https://你的Worker域名.workers.dev';

export const StoreAPI = {
    async getAll() {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/stores`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    },
    // ... 其他方法
};
```

---

## 5. 数据迁移

### 从 Mock 数据迁移到数据库

创建迁移脚本 `migrations/seed.js`：

```javascript
// migrations/seed.js
const mockStores = [
    { name: 'Amazon', category: 'Electronics', cashback: 5, ... },
    // ... 其他数据
];

async function seedDatabase(env) {
    for (const store of mockStores) {
        await env.DB.prepare(
            'INSERT INTO stores (name, category, cashback, ...) VALUES (?, ?, ?, ...)'
        ).bind(store.name, store.category, store.cashback, ...).run();
    }
}
```

---

## 6. 安全配置

### 环境变量

在 Cloudflare Dashboard 中设置：
- `JWT_SECRET` - JWT 密钥（随机生成）
- `ADMIN_EMAIL` - 管理员邮箱
- 其他敏感配置

### CORS 配置

限制允许的域名：

```javascript
const allowedOrigins = ['https://你的域名.com'];
const origin = request.headers.get('Origin');
if (!allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
}
```

### 密码策略

- 最小长度：8 字符
- 包含大小写字母、数字
- 使用 bcrypt 或 Argon2（如果可能）

---

## 7. 部署和测试

### 部署步骤

1. **部署 API Worker**：
   ```bash
   wrangler deploy
   ```

2. **初始化数据库**：
   ```bash
   wrangler d1 execute coupon-db --file=./schema.sql
   ```

3. **更新前端配置**：
   - 更新 `admin/js/config.js` 中的 API URL
   - 更新 `admin/js/api.js` 使用真实 API

4. **测试所有功能**：
   - 用户注册/登录
   - CRUD 操作
   - 图片上传
   - 数据持久化

---

## 📝 实施计划

### 阶段 1: 基础设置（1-2 天）
1. ✅ 创建 D1 数据库
2. ✅ 创建数据库表
3. ✅ 配置 wrangler.toml

### 阶段 2: 认证系统（2-3 天）
1. ✅ 实现用户注册
2. ✅ 实现用户登录
3. ✅ JWT token 管理
4. ✅ 前端集成

### 阶段 3: API 开发（3-5 天）
1. ✅ Stores API
2. ✅ Coupons API
3. ✅ Categories API
4. ✅ Users API
5. ✅ 图片上传 API

### 阶段 4: 前端集成（2-3 天）
1. ✅ 更新 API 调用
2. ✅ 错误处理
3. ✅ 加载状态
4. ✅ 用户体验优化

### 阶段 5: 测试和优化（2-3 天）
1. ✅ 功能测试
2. ✅ 性能优化
3. ✅ 安全审计
4. ✅ 文档完善

---

## 🚀 快速开始

### 最小可行方案（MVP）

如果你想快速上线，可以：

1. **使用 Cloudflare D1**（最简单）
2. **实现基本的注册/登录**
3. **实现基本的 CRUD API**
4. **配置 R2 图片上传**

这样可以在 1-2 周内完成基本功能。

---

## 📚 参考资源

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)

---

## ❓ 需要帮助？

如果你需要我帮你：
1. 创建具体的 API 代码
2. 实现某个功能
3. 解决遇到的问题

随时告诉我！
