# 数据库结构设计

## 数据表设计

### 1. stores (商店表)
```sql
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    website_url VARCHAR(500),
    cashback_rate DECIMAL(5,2) DEFAULT 0.00,
    category_id INT,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_coupons INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### 2. coupons (优惠券表)
```sql
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(100),
    description TEXT,
    discount_type ENUM('percentage', 'fixed', 'free_shipping') NOT NULL,
    discount_value DECIMAL(10,2),
    min_purchase DECIMAL(10,2),
    max_discount DECIMAL(10,2),
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    usage_count INT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    user_rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id)
);
```

### 3. categories (分类表)
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

### 4. users (用户表)
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    total_cashback DECIMAL(10,2) DEFAULT 0.00,
    pending_cashback DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5. user_cashback (用户现金返还记录表)
```sql
CREATE TABLE user_cashback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    order_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'paid') DEFAULT 'pending',
    order_date DATE,
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
);
```

### 6. coupon_usage (优惠券使用记录表)
```sql
CREATE TABLE coupon_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_id INT NOT NULL,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 7. images (图片表)
```sql
CREATE TABLE images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('store', 'coupon', 'category') NOT NULL,
    entity_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('logo', 'banner', 'thumbnail', 'gallery') DEFAULT 'thumbnail',
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 索引建议

```sql
-- 商店表索引
CREATE INDEX idx_stores_category ON stores(category_id);
CREATE INDEX idx_stores_featured ON stores(is_featured);
CREATE INDEX idx_stores_slug ON stores(slug);

-- 优惠券表索引
CREATE INDEX idx_coupons_store ON coupons(store_id);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupons_expiry ON coupons(expiry_date);
CREATE INDEX idx_coupons_featured ON coupons(is_featured);

-- 用户现金返还索引
CREATE INDEX idx_cashback_user ON user_cashback(user_id);
CREATE INDEX idx_cashback_status ON user_cashback(status);
CREATE INDEX idx_cashback_store ON user_cashback(store_id);

-- 优惠券使用记录索引
CREATE INDEX idx_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_usage_user ON coupon_usage(user_id);
```

## 示例数据

### 分类数据
```sql
INSERT INTO categories (name, slug, icon) VALUES
('时尚服装', 'fashion', '👕'),
('电子产品', 'electronics', '📱'),
('美妆护肤', 'beauty', '💄'),
('家居用品', 'home', '🏠'),
('旅行度假', 'travel', '✈️'),
('餐饮美食', 'food', '🍔');
```

### 商店数据示例
```sql
INSERT INTO stores (name, slug, cashback_rate, category_id, is_featured) VALUES
('Target', 'target', 11.00, 1, TRUE),
('Nike', 'nike', 18.00, 1, TRUE),
('Best Buy', 'bestbuy', 20.00, 2, TRUE);
```

### 优惠券数据示例
```sql
INSERT INTO coupons (store_id, title, code, discount_type, discount_value, min_purchase, expiry_date) VALUES
(1, '满$50减$10', 'SAVE10', 'fixed', 10.00, 50.00, '2024-12-31'),
(2, '全场8折优惠', 'SPORT20', 'percentage', 20.00, 0.00, '2024-11-30');
```
