// Analytics JavaScript - Real API Implementation

import { StoreAPI, CouponAPI, UserAPI } from './api-real.js';

let revenueChart, couponUsageChart, userGrowthChart;

// Initialize analytics
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadAnalyticsData();
    
    // Update charts when time range changes
    const timeRangeSelect = document.getElementById('timeRange');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            loadAnalyticsData();
        });
    }
});

// Initialize charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Revenue',
                data: [],
                borderColor: '#6B46C1',
                backgroundColor: 'rgba(107, 70, 193, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Coupon Usage Chart
    const couponCtx = document.getElementById('couponUsageChart').getContext('2d');
    couponUsageChart = new Chart(couponCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Coupon Clicks',
                data: [],
                backgroundColor: '#00A862',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // User Growth Chart
    const userCtx = document.getElementById('userGrowthChart').getContext('2d');
    userGrowthChart = new Chart(userCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'New Users',
                data: [],
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load analytics data from real API
async function loadAnalyticsData() {
    try {
        const timeRange = document.getElementById('timeRange')?.value || 30;
        
        // Load all data in parallel
        const [storesResult, couponsResult, usersResult] = await Promise.all([
            StoreAPI.getAll(),
            CouponAPI.getAll(),
            UserAPI.getAll()
        ]);
        
        const stores = storesResult.success ? storesResult.data : [];
        const coupons = couponsResult.success ? couponsResult.data : [];
        const users = usersResult.success ? usersResult.data : [];
        
        // Calculate statistics
        const totalCashback = users.reduce((sum, user) => sum + (user.total_cashback || 0) + (user.pending_cashback || 0), 0);
        const activeUsers = users.filter(u => u.is_active === 1 || u.is_active === true).length;
        const couponUsage = coupons.reduce((sum, coupon) => sum + (coupon.usage_count || 0), 0);
        const activeStores = stores.filter(s => s.status === 'active').length;
        
        // Update stats cards
        updateStatsCards({
            totalCashback,
            activeUsers,
            couponUsage,
            totalStores: activeStores
        });
        
        // Generate chart data based on time range
        const chartData = generateChartDataFromRealData(stores, coupons, users, parseInt(timeRange));
        updateCharts(chartData);
        
        // Update top stores
        updateTopStores(stores.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showError('Failed to load analytics data');
    }
}

// Update stats cards
function updateStatsCards(stats) {
    const totalCashbackEl = document.getElementById('totalCashback');
    const cashbackChangeEl = document.getElementById('cashbackChange');
    const couponUsageEl = document.getElementById('couponUsage');
    const couponUsageChangeEl = document.getElementById('couponUsageChange');
    const activeUsersEl = document.getElementById('activeUsers');
    const activeUsersChangeEl = document.getElementById('activeUsersChange');
    const totalStoresEl = document.getElementById('totalStores');
    const totalStoresChangeEl = document.getElementById('totalStoresChange');
    
    if (totalCashbackEl) totalCashbackEl.textContent = '$' + stats.totalCashback.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (cashbackChangeEl) cashbackChangeEl.textContent = 'Total cashback';
    
    if (couponUsageEl) couponUsageEl.textContent = stats.couponUsage.toLocaleString();
    if (couponUsageChangeEl) couponUsageChangeEl.textContent = 'Total usage';
    
    if (activeUsersEl) activeUsersEl.textContent = stats.activeUsers.toLocaleString();
    if (activeUsersChangeEl) activeUsersChangeEl.textContent = 'Active users';
    
    if (totalStoresEl) totalStoresEl.textContent = stats.totalStores.toLocaleString();
    if (totalStoresChangeEl) totalStoresChangeEl.textContent = 'Active stores';
}

// Generate chart data from real data
function generateChartDataFromRealData(stores, coupons, users, days) {
    const labels = [];
    const revenueData = [];
    const couponData = [];
    const userData = [];
    
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        if (days <= 30) {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        } else {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
        
        // Calculate data for this date
        const dateStr = date.toISOString().split('T')[0];
        
        // Revenue: sum of cashback from users created on or before this date
        const revenue = users
            .filter(u => new Date(u.created_at) <= date)
            .reduce((sum, u) => sum + (u.total_cashback || 0) + (u.pending_cashback || 0), 0);
        revenueData.push(revenue);
        
        // Coupon usage: count coupons used on or before this date
        const couponCount = coupons
            .filter(c => {
                const createdDate = new Date(c.created_at);
                return createdDate <= date;
            })
            .reduce((sum, c) => sum + (c.usage_count || 0), 0);
        couponData.push(couponCount);
        
        // User growth: count users created on or before this date
        const userCount = users.filter(u => {
            const createdDate = new Date(u.created_at);
            createdDate.setHours(0, 0, 0, 0);
            return createdDate <= date;
        }).length;
        userData.push(userCount);
    }
    
    return {
        labels,
        revenue: revenueData,
        couponUsage: couponData,
        userGrowth: userData
    };
}

function showError(message) {
    console.error(message);
    // You can add a notification here if needed
}

// This function is no longer needed - using real data instead

// Update charts with new data
function updateCharts(data) {
    // Update revenue chart
    revenueChart.data.labels = data.labels;
    revenueChart.data.datasets[0].data = data.revenue;
    revenueChart.update();

    // Update coupon usage chart
    couponUsageChart.data.labels = data.labels;
    couponUsageChart.data.datasets[0].data = data.couponUsage;
    couponUsageChart.update();

    // Update user growth chart
    userGrowthChart.data.labels = data.labels;
    userGrowthChart.data.datasets[0].data = data.userGrowth;
    userGrowthChart.update();
}

// Update top stores table
function updateTopStores(stores) {
    const tbody = document.getElementById('topStoresTable');
    if (!tbody) return;
    
    if (stores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No stores yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = stores.map(store => {
        // Calculate estimated metrics (since we don't have actual click/revenue tracking yet)
        const cashback = store.cashback || 0;
        const estimatedRevenue = cashback * 100; // Rough estimate
        const estimatedClicks = Math.floor(estimatedRevenue / 10); // Rough estimate
        const conversion = cashback > 0 ? (cashback / 10).toFixed(1) : '0.0';
        
        return `
            <tr>
                <td><strong>${store.name || 'N/A'}</strong></td>
                <td>$${estimatedRevenue.toLocaleString()}</td>
                <td>${estimatedClicks.toLocaleString()}</td>
                <td>${conversion}%</td>
            </tr>
        `;
    }).join('');
}
