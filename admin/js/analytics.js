// Analytics JavaScript

let revenueChart, couponUsageChart, userGrowthChart;

// Initialize analytics
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadAnalyticsData();
    
    // Update charts when time range changes
    document.getElementById('timeRange').addEventListener('change', function() {
        loadAnalyticsData();
    });
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

// Load analytics data
function loadAnalyticsData() {
    const timeRange = document.getElementById('timeRange').value;
    
    // Simulate API call
    setTimeout(() => {
        const data = generateMockData(timeRange);
        updateCharts(data);
        updateTopStores(data.topStores);
    }, 300);
}

// Generate mock data based on time range
function generateMockData(days) {
    const labels = [];
    const revenueData = [];
    const couponData = [];
    const userData = [];
    
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        if (days <= 30) {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        } else {
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
        
        // Generate realistic-looking data with some randomness
        revenueData.push(Math.floor(Math.random() * 5000) + 5000);
        couponData.push(Math.floor(Math.random() * 500) + 1000);
        userData.push(Math.floor(Math.random() * 100) + 200);
    }
    
    return {
        labels,
        revenue: revenueData,
        couponUsage: couponData,
        userGrowth: userData,
        topStores: [
            { name: 'Amazon', revenue: 45678, clicks: 8234, conversion: 4.2 },
            { name: 'Target', revenue: 32456, clicks: 6789, conversion: 3.8 },
            { name: 'Walmart', revenue: 28901, clicks: 5432, conversion: 3.5 },
            { name: 'Best Buy', revenue: 23456, clicks: 4567, conversion: 3.2 },
            { name: 'Home Depot', revenue: 19876, clicks: 3456, conversion: 2.9 }
        ]
    };
}

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
    tbody.innerHTML = '';
    
    stores.forEach(store => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${store.name}</strong></td>
            <td>$${store.revenue.toLocaleString()}</td>
            <td>${store.clicks.toLocaleString()}</td>
            <td>${store.conversion}%</td>
        `;
        tbody.appendChild(row);
    });
}
