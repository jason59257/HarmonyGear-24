#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Translate all HTML files from Chinese to English
"""

import re
import os

# Translation mappings
translations = {
    # HTML lang attribute
    'lang="zh-CN"': 'lang="en"',
    
    # Navigation
    '首页': 'Home',
    '商店': 'Stores',
    '优惠券': 'Coupons',
    '分类': 'Categories',
    '登录': 'Sign In',
    '免费注册': 'Join Free',
    
    # Common buttons and actions
    '查看优惠券': 'View Coupons',
    '查看所有商店': 'View All Stores',
    '查看所有优惠券': 'View All Coupons',
    '复制代码': 'Copy Code',
    '去购物': 'Shop Now',
    '搜索': 'Search',
    '排序': 'Sort',
    '筛选': 'Filter',
    
    # Page titles
    '所有商店': 'All Stores',
    '所有优惠券': 'All Coupons',
    '优惠券详情': 'Coupon Details',
    '分类浏览': 'Browse Categories',
    
    # Filters
    '全部': 'All',
    '时尚': 'Fashion',
    '电子产品': 'Electronics',
    '美妆': 'Beauty',
    '家居': 'Home',
    '旅行': 'Travel',
    '最新': 'New',
    '热门': 'Hot',
    '即将过期': 'Expiring',
    
    # Sort options
    '最受欢迎': 'Most Popular',
    '现金返还最高': 'Highest Cash Back',
    '按名称': 'By Name',
    '最新发布': 'Newest',
    '即将过期': 'Expiring Soon',
    
    # Footer
    '关于我们': 'About',
    '关于 CouponHub': 'About CouponHub',
    '如何开始': 'Getting Started',
    '广告与合作伙伴': 'Advertising & Partnerships',
    '新闻中心': 'Press Room',
    '职业机会': 'Careers',
    '商店与品牌': 'Stores & Brands',
    '工具与服务': 'Tools & Services',
    '帮助': 'Help',
    '常见问题': 'FAQ',
    '联系我们': 'Contact Us',
    '服务条款': 'Terms & Conditions',
    '隐私政策': 'Privacy Policy',
    '浏览器扩展': 'Browser Extension',
    '移动应用': 'Mobile App',
    '店内现金返还': 'In-Store Cash Back',
    '保留所有权利': 'All rights reserved',
    
    # Store descriptions
    '日常用品、服装、电子产品': 'Daily essentials, clothing, electronics',
    '运动鞋、运动服装、装备': 'Athletic shoes, sportswear, equipment',
    '时尚、家居、美容产品': 'Fashion, home, beauty products',
    '电子产品、家电、游戏': 'Electronics, appliances, games',
    '美妆、护肤、香水': 'Makeup, skincare, fragrances',
    '美妆、护肤、美容工具': 'Makeup, skincare, beauty tools',
    
    # Coupon related
    '个优惠券': ' coupons',
    '现金返还': 'Cash Back',
    '最高': 'Up to ',
    '% 现金返还': '% Cash Back',
    
    # Pagination
    '下一页': 'Next',
    
    # Placeholders
    '搜索商店...': 'Search stores...',
    '搜索优惠券或商店...': 'Search coupons or stores...',
    
    # Register/Login pages
    '注册': 'Register',
    '注册 - Coupons网站': 'Register - CouponHub',
    '创建免费账户': 'Create Free Account',
    '姓名': 'Name',
    '请输入您的姓名': 'Enter your name',
    '邮箱地址': 'Email Address',
    '密码': 'Password',
    '至少8个字符': 'At least 8 characters',
    '确认密码': 'Confirm Password',
    '请再次输入密码': 'Re-enter password',
    '我同意': 'I agree to',
    '和': 'and',
    '接收优惠和促销信息（可选）': 'Receive deals and promotional emails (optional)',
    '立即注册': 'Sign Up Now',
    '或': 'or',
    '使用微信注册': 'Sign up with WeChat',
    '使用Google注册': 'Sign up with Google',
    '已有账户？': 'Already have an account?',
    '立即Sign In': 'Sign In Now',
    '登录您的账户': 'Sign In to Your Account',
    '还没有账户？': "Don't have an account?",
    '立即注册': 'Sign Up Now',
    '记住我': 'Remember me',
    '忘记密码？': 'Forgot password?',
    '使用微信登录': 'Sign in with WeChat',
    '使用Google登录': 'Sign in with Google',
    
    # Coupon detail page
    '优惠券详情 - 优惠券网站': 'Coupon Details - CouponHub',
    '优惠券详情': 'Coupon Details',
    '现金返还': 'Cash Back',
    '新': 'New',
    '优惠详情': 'Coupon Details',
    '在Target购物满$50即可享受$10折扣。此优惠适用于所有商品，包括服装、家居用品、电子产品等。优惠码在结账时使用。': 'Get $10 off when you spend $50 or more at Target. This offer applies to all items including clothing, home essentials, electronics, and more. Use the code at checkout.',
    '最低消费': 'Minimum Purchase',
    '折扣金额': 'Discount Amount',
    '有效期': 'Expires',
    '适用范围': 'Applies To',
    '所有商品': 'All Items',
    '使用方法': 'How to Use',
    '点击"去购物"按钮跳转到Target官网': 'Click the "Shop Now" button to go to Target website',
    '选择您需要的商品，确保购物车总额达到$50或以上': 'Select the items you need, ensuring your cart total is $50 or more',
    '在结账页面，找到"优惠码"或"促销代码"输入框': 'On the checkout page, find the "Promo Code" or "Coupon Code" input field',
    '粘贴或输入优惠码: SAVE10': 'Paste or enter the coupon code: SAVE10',
    '确认折扣已应用，完成支付': 'Confirm the discount is applied and complete your payment',
    '去购物': 'Shop Now',
    '复制优惠码': 'Copy Coupon Code',
    '已使用次数': 'Times Used',
    '成功率': 'Success Rate',
    '用户评分': 'User Rating',
    '现金返还信息': 'Cash Back Information',
    '通过CouponHub在Target购物，您将获得': 'When you shop at Target through CouponHub, you will earn',
    '的现金返还': 'Cash Back',
    '现金返还将自动累积到您的账户，最快在首次购买后15天支付。': 'Cash Back will automatically accumulate in your account and be paid as soon as 15 days after your first purchase.',
    '立即注册': 'Sign Up Now',
    '相关优惠券': 'Related Coupons',
    '查看': 'View',
    '分享优惠券': 'Share Coupon',
    '分享到微信': 'Share to WeChat',
    '分享到微博': 'Share to Weibo',
    
    # Category page
    '分类浏览 - 优惠券网站': 'Browse Categories - CouponHub',
    '选择您感兴趣的分类，找到相关商店和优惠券': "Select a category you're interested in to find related stores and coupons",
    '时尚服装': 'Fashion',
    '查看所有时尚品牌': 'View all fashion brands',
    '电子产品': 'Electronics',
    '最新科技产品优惠': 'Latest tech deals',
    '美妆护肤': 'Beauty',
    '美妆品牌特惠': 'Beauty brand offers',
    '家居用品': 'Home & Garden',
    '家居装饰和用品': 'Home decor & supplies',
    '旅行度假': 'Travel',
    '酒店和机票优惠': 'Hotels & flights',
    '餐饮美食': 'Food & Restaurants',
    '餐厅和外卖优惠': 'Restaurants & delivery',
    '商店': ' stores',
    
    # Coupons page
    '找到您需要的优惠券和促销代码': 'Find the coupons and promo codes you need',
    '满$50减$10': 'Save $10 on Orders Over $50',
    '全场8折优惠': '20% Off Everything',
    '新用户立减$25': '$25 Off for New Customers',
    '电子产品9折': '10% Off Electronics',
    
    # Stores page
    '浏览所有提供现金返还和优惠券的商店': 'Browse all stores offering Cash Back and coupons',
}

def translate_file(filepath):
    """Translate a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Apply translations
        for chinese, english in translations.items():
            content = content.replace(chinese, english)
        
        # Fix specific patterns
        content = re.sub(r'(\d+)个优惠券', r'\1 coupons', content)
        content = re.sub(r'已使用 (\d+) 次', r'Used \1 times', content)
        content = re.sub(r'有效期至: (\d{4}-\d{2}-\d{2})', r'Expires: \1', content)
        content = re.sub(r'成功率 (\d+%)', r'Success rate \1', content)
        content = re.sub(r'用户评分 (\d+\.\d+)', r'User rating \1', content)
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Translated: {filepath}")
        return True
    except Exception as e:
        print(f"✗ Error translating {filepath}: {e}")
        return False

if __name__ == '__main__':
    # Get all HTML files
    html_files = [
        'stores.html',
        'coupons.html',
        'coupon-detail.html',
        'category.html',
        'login.html',
        'register.html'
    ]
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename in html_files:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            translate_file(filepath)
        else:
            print(f"✗ File not found: {filepath}")
