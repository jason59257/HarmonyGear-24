# 首页展示逻辑说明

## 概述

首页包含四个主要展示区域，每个区域有不同的展示逻辑和筛选规则。

---

## 1. Popular Stores（热门商店）

### 位置
- 第357-412行
- 位于首页中间部分，在Hero轮播图下方

### 展示逻辑
```javascript
筛选条件：
- 按商店的受欢迎程度排序
- 显示前6个最受欢迎的商店
- 优先显示有现金返还提升的商店（显示 "was X%" 的商店）

展示内容：
- 商店名称（大号字体）
- 当前现金返还比例
- 如果现金返还提升了，显示 "was X%" 对比
```

### 当前展示的商店
1. Macy's - 4% Cash Back (was 2%)
2. Target - 1% Cash Back
3. TEMU - 3% Cash Back
4. KOHL'S - 2% Cash Back
5. NIKE - 8% Cash Back (was 2%)
6. ULTA BEAUTY - Up to 4% (was 2%)

### 布局特点
- 横向滚动布局（`stores-row`）
- 卡片样式：`store-card-popular`
- 每个卡片有独特的背景颜色
- 响应式设计，移动端可横向滚动

### 数据来源建议
```sql
SELECT * FROM stores 
WHERE is_featured = TRUE 
ORDER BY 
  CASE WHEN cashback_rate > previous_cashback_rate THEN 1 ELSE 2 END,
  total_coupons DESC,
  rating DESC
LIMIT 6;
```

---

## 2. Extra Cash Back Stores（额外现金返还商店）

### 位置
- 第414-584行
- 位于Popular Stores下方

### 展示逻辑
```javascript
筛选条件：
- 现金返还比例相比之前有提升的商店
- 或者现金返还比例特别高的商店（>5%）
- 优先显示提升幅度大的商店
- 显示16个商店

展示内容：
- 商店名称
- 当前现金返还比例（高亮显示）
- 之前的现金返还比例（"was X%" 灰色显示）
- 突出显示提升幅度
```

### 当前展示的商店（部分）
1. iHerb - 20% Cash Back (was 2%) ⬆️ 提升900%
2. NIKE - 8% Cash Back (was 2%) ⬆️ 提升300%
3. priceline® - Up to 8% Cash Back (was 4%) ⬆️ 提升100%
4. Booking.com - Up to 8% Cash Back (was 4%) ⬆️ 提升100%
5. zoro - 9% Cash Back (was 2%) ⬆️ 提升350%
... 共16个商店

### 布局特点
- 网格布局（`stores-grid-large`）
- 卡片样式：`store-card-compact`
- 每个卡片有品牌色背景
- 响应式网格，自动换行

### 数据来源建议
```sql
SELECT * FROM stores 
WHERE 
  cashback_rate > previous_cashback_rate 
  OR cashback_rate >= 5
ORDER BY 
  (cashback_rate - previous_cashback_rate) DESC,
  cashback_rate DESC
LIMIT 16;
```

---

## 3. Deals and Coupons of the Week（本周优惠和优惠券）

### 位置
- 第586-641行
- 位于Extra Cash Back Stores下方

### 展示逻辑
```javascript
筛选条件：
- 本周新增的优惠券
- 或者本周特别推荐的优惠券
- 按创建时间排序（最新的在前）
- 显示4个优惠券

展示内容：
- 商店Logo（带品牌色背景）
- 现金返还比例
- 优惠券描述/标题
- "Shop" 或 "See Details" 按钮
```

### 当前展示的优惠券
1. CVS - 5% Cash Back - "Buy 1, get 1 free on Nature Made vitamins."
2. T-Mobile 5G Home Internet - $75 Cash Back - "Get up to $300 back on 5G home internet."
3. ATHLETA - 2% Cash Back - "Get up to 40% off cold weather styles."
4. AliExpress - 2% Cash Back - "Get free shipping & fast delivery."

### 布局特点
- 横向滚动布局（`deals-row`）
- 卡片样式：`deal-card`
- 右侧有滚动箭头按钮
- 每个卡片包含Logo区域和信息区域

### 数据来源建议
```sql
SELECT c.*, s.name as store_name, s.logo_url 
FROM coupons c
JOIN stores s ON c.store_id = s.id
WHERE 
  c.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  OR c.is_featured = TRUE
ORDER BY 
  c.is_featured DESC,
  c.created_at DESC
LIMIT 4;
```

---

## 4. Hot Deals and Coupons（热门优惠和优惠券）

### 位置
- 第645-757行
- 位于Deals and Coupons of the Week下方

### 展示逻辑
```javascript
筛选条件：
- 按优惠券的热度排序（点击量、使用量）
- 或者按现金返还比例排序
- 优先显示有提升的优惠券
- 显示8个优惠券

展示内容：
- 商店Logo区域
- 优惠券标题/描述（吸引人的文案）
- 现金返还比例（当前和之前对比）
- "Shop" 按钮
```

### 当前展示的优惠券
1. elf - 10% Cash Back (was 5%) - "New! Halo Glow Silky Powder Highlighter for $9."
2. Visible - $40 Cash Back (was $20) - "Get Visible for as low as $19/mo for 26 mos."
3. PUMA - 5% Cash Back - "Save on athletic wear and footwear."
4. Hertz - $25 Cash Back (was $15) - "Rent a car and save on your next trip."
5. eyebuydirect - 8% Cash Back (was 4%) - "Get prescription glasses starting at $6."
6. boost mobile - $30 Cash Back (was $15) - "Unlimited plans starting at $25/mo."
7. total wireless - $15 Cash Back (was $12.50) - "Affordable wireless plans for everyone."
8. OLD NAVY - 3% Cash Back - "Save on family fashion and essentials."

### 布局特点
- 网格布局（`hot-deals-grid`）
- 卡片样式：`hot-deal-card`
- 每个卡片有Logo区域和内容区域
- 响应式网格布局

### 数据来源建议
```sql
SELECT c.*, s.name as store_name, s.logo_url,
  c.usage_count,
  c.success_rate,
  (c.cashback_rate - c.previous_cashback_rate) as cashback_increase
FROM coupons c
JOIN stores s ON c.store_id = s.id
WHERE c.is_active = TRUE
ORDER BY 
  c.usage_count DESC,
  c.success_rate DESC,
  cashback_increase DESC,
  c.user_rating DESC
LIMIT 8;
```

---

## 展示逻辑总结

### 优先级排序规则

1. **Popular Stores**
   - 受欢迎程度 > 现金返还提升 > 优惠券数量 > 评分

2. **Extra Cash Back Stores**
   - 现金返还提升幅度 > 当前现金返还比例 > 商店活跃度

3. **Deals and Coupons of the Week**
   - 是否推荐 > 创建时间（最新）> 现金返还比例

4. **Hot Deals and Coupons**
   - 使用量 > 成功率 > 现金返还提升 > 用户评分

### 共同特点

1. **现金返还提升显示**
   - 如果当前比例 > 之前比例，显示 "was X%" 对比
   - 用灰色小字显示，突出提升效果

2. **响应式设计**
   - 桌面端：网格或横向滚动
   - 移动端：可横向滚动或单列显示

3. **视觉层次**
   - 热门内容使用更醒目的颜色
   - 提升的现金返还用对比色突出

4. **交互功能**
   - 所有卡片都可点击跳转到商店或优惠券详情页
   - "See All" 链接跳转到完整列表页

---

## 建议的数据更新策略

### 更新频率
- **Popular Stores**: 每天更新一次
- **Extra Cash Back Stores**: 实时更新（当现金返还比例变化时）
- **Deals and Coupons of the Week**: 每周一更新
- **Hot Deals and Coupons**: 每小时更新一次

### 缓存策略
- 使用Redis缓存热门数据
- 设置合理的过期时间
- 当数据变化时主动清除缓存

---

## 未来优化建议

1. **个性化推荐**
   - 根据用户浏览历史推荐
   - 根据用户购买偏好推荐

2. **A/B测试**
   - 测试不同的排序算法
   - 测试不同的展示数量

3. **实时更新**
   - 使用WebSocket推送热门内容变化
   - 实时更新现金返还比例

4. **数据分析**
   - 跟踪每个区域的点击率
   - 分析转化率，优化展示逻辑
