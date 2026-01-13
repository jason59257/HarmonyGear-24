# 功能更新说明

## 新增功能

### 1. Coupons 添加 Short Description 字段

#### 功能说明
- 在添加/编辑优惠券时，新增了 **Short Description（简短描述）** 字段
- 该字段用于在列表页面显示优惠券的简短描述
- 最大长度建议：150字符
- 必填字段

#### 使用位置
- **后台管理**: `admin/coupons.html` - 添加/编辑优惠券表单
- **前端显示**: 优惠券列表页面会显示此简短描述

#### 数据库字段
```sql
ALTER TABLE coupons ADD COLUMN short_description VARCHAR(255) AFTER title;
```

#### 前端显示示例
在优惠券卡片中，short_description 会显示在标题下方：
```
优惠券标题
简短描述（short_description）
优惠码: SAVE20
```

---

### 2. Stores 添加 Logo 图片上传功能

#### 功能说明
- 在添加/编辑商店时，新增了 **Logo 图片上传** 功能
- 支持拖拽上传
- 支持图片预览
- 文件大小限制：5MB
- 支持格式：JPEG, PNG, GIF, WebP

#### 使用位置
- **后台管理**: `admin/stores.html` - 添加/编辑商店表单
- 上传组件会自动显示在表单中

#### 功能特点
1. **拖拽上传**: 可以直接将图片拖拽到上传区域
2. **点击上传**: 点击上传区域或按钮选择文件
3. **图片预览**: 上传后立即显示预览
4. **替换功能**: 编辑时可以上传新图片替换现有Logo
5. **当前Logo显示**: 编辑时显示当前Logo（如果有）

#### 数据库字段
```sql
ALTER TABLE stores ADD COLUMN logo_url VARCHAR(500) AFTER name;
```

#### 前端显示
商店Logo会在以下位置显示：
- 商店列表页面
- 商店详情页面
- 优惠券卡片中的商店Logo
- 首页热门商店展示

---

## 技术实现

### 1. Short Description 字段

#### 表单字段
```javascript
createFormField('Short Description', 'short_description', 'textarea', '', {
    placeholder: 'Brief description shown on listing pages (max 150 characters)',
    required: true
})
```

#### API 更新
- `CouponAPI.create()` - 支持 short_description 字段
- `CouponAPI.update()` - 支持 short_description 字段
- 模拟数据已包含 short_description 示例

### 2. Logo 图片上传

#### 上传组件
使用 `ImageUpload` 类实现：
```javascript
const uploader = new ImageUpload({
    maxSize: 5 * 1024 * 1024, // 5MB
    onUpload: async (file) => {
        const response = await ImageAPI.upload(file, 'store', storeId);
        return response;
    }
});
uploader.createUploadComponent('storeLogoUpload');
```

#### 上传流程
1. 用户选择/拖拽图片
2. 验证文件类型和大小
3. 显示预览
4. 调用 ImageAPI.upload() 上传
5. 保存返回的URL到表单数据
6. 提交表单时包含 logo_url

---

## 使用说明

### 添加优惠券时
1. 点击 "Add Coupon" 按钮
2. 填写所有必填字段，包括：
   - Coupon Title（优惠券标题）
   - **Short Description（简短描述）** ⭐ 新增
   - Store（商店）
   - Discount Type（折扣类型）
   - 等等...
3. 提交表单

### 添加商店时
1. 点击 "Add Store" 按钮
2. 填写商店信息
3. 在 "Store Logo" 区域：
   - 点击上传区域或按钮
   - 或直接拖拽图片到上传区域
   - 上传后会自动显示预览
4. 提交表单

### 编辑商店时
1. 点击商店的编辑按钮
2. 表单会显示当前Logo（如果有）
3. 可以上传新图片替换现有Logo
4. 如果不上传新图片，将保持原有Logo

---

## 注意事项

1. **图片上传**: 目前使用模拟API，返回占位图片URL。实际使用时需要实现真实的上传接口
2. **Short Description**: 建议限制在150字符以内，以确保在列表页面的良好显示
3. **Logo尺寸**: 建议上传正方形或接近正方形的Logo，尺寸建议 200x200 到 400x400 像素
4. **文件格式**: 支持 JPEG, PNG, GIF, WebP 格式

---

## 后续优化建议

1. **图片裁剪**: 添加图片裁剪功能，确保Logo尺寸统一
2. **图片压缩**: 自动压缩大图片，减少存储空间
3. **多尺寸生成**: 自动生成不同尺寸的Logo（缩略图、中等尺寸等）
4. **CDN集成**: 将图片上传到CDN，提高加载速度
5. **Short Description验证**: 添加字符长度验证和提示
