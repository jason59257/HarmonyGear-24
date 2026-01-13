// Redirect utility functions for stores and coupons

/**
 * 跳转到商店的购买页面
 * @param {string} redirectUrl - 跳转链接
 * @param {string} storeName - 商店名称（用于统计）
 */
function redirectToStore(redirectUrl, storeName) {
    if (!redirectUrl) {
        console.warn('No redirect URL provided');
        return;
    }
    
    // 记录点击统计（可选）
    if (storeName) {
        console.log(`Redirecting to store: ${storeName}`);
        // 这里可以添加统计代码，比如发送到分析服务
    }
    
    // 在新标签页打开链接
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
}

/**
 * 跳转到优惠券的购买页面（领取优惠券后）
 * @param {string} redirectUrl - 跳转链接
 * @param {string} couponCode - 优惠券代码（用于统计）
 * @param {string} couponId - 优惠券ID（用于统计）
 */
function redirectToCoupon(redirectUrl, couponCode, couponId) {
    if (!redirectUrl) {
        console.warn('No redirect URL provided');
        return;
    }
    
    // 记录点击统计（可选）
    if (couponCode) {
        console.log(`Redirecting with coupon: ${couponCode}`);
        // 这里可以添加统计代码，记录优惠券使用
    }
    
    // 在新标签页打开链接
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
}

/**
 * 复制优惠码并跳转
 * @param {string} code - 优惠券代码
 * @param {string} redirectUrl - 跳转链接
 */
function copyCodeAndRedirect(code, redirectUrl) {
    // 先复制代码
    if (code) {
        navigator.clipboard.writeText(code).then(function() {
            showNotification('优惠码已复制: ' + code);
            
            // 延迟一下再跳转，让用户看到复制成功的提示
            setTimeout(() => {
                if (redirectUrl) {
                    redirectToCoupon(redirectUrl, code);
                }
            }, 500);
        }, function(err) {
            // Fallback method
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('优惠码已复制: ' + code);
            
            setTimeout(() => {
                if (redirectUrl) {
                    redirectToCoupon(redirectUrl, code);
                }
            }, 500);
        });
    } else if (redirectUrl) {
        // 如果没有代码，直接跳转
        redirectToCoupon(redirectUrl);
    }
}

/**
 * 跳转到产品的购买页面
 * @param {string} redirectUrl - 跳转链接
 * @param {string} productTitle - 产品标题（用于统计）
 */
function redirectToProduct(redirectUrl, productTitle) {
    if (!redirectUrl) {
        console.warn('No redirect URL provided');
        return;
    }
    
    // 记录点击统计（可选）
    if (productTitle) {
        console.log(`Redirecting to product: ${productTitle}`);
        // 这里可以添加统计代码
    }
    
    // 在新标签页打开链接
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
}

// Export to global scope first (for non-module scripts)
if (typeof window !== 'undefined') {
    window.redirectToStore = redirectToStore;
    window.redirectToCoupon = redirectToCoupon;
    window.copyCodeAndRedirect = copyCodeAndRedirect;
    window.redirectToProduct = redirectToProduct;
}

// ES6 module exports (for module scripts)
// Only export if this file is loaded as a module
try {
    export { redirectToStore, redirectToCoupon, copyCodeAndRedirect, redirectToProduct };
} catch (e) {
    // Not a module context, functions already exported to window above
}
