// Example Data prior to real fetching
let popupData = {
    totalRevenue: 26681.60,
    connectedSources: 2,
    monthlyGrowth: '+12.5%',
    socialStats: [
        {
            platform: 'twitter',
            name: 'Twitter',
            icon: 'T',
            followers: '2.4K',
            change: '+125',
            changeType: 'positive'
        },
        {
            platform: 'youtube',
            name: 'YouTube',
            icon: 'Y',
            followers: '856',
            change: '+23',
            changeType: 'positive'
        },
        {
            platform: 'instagram',
            name: 'Instagram',
            icon: 'I',
            followers: '1.2K',
            change: '0',
            changeType: 'neutral'
        }
    ]
};

// Functions
function updatePopupData() {
    // Update Total Revenue
    document.getElementById('totalRevenue').textContent = 
        `$${popupData.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    // Update stats
    document.getElementById('connectedSources').textContent = popupData.connectedSources;
    document.getElementById('monthlyGrowth').textContent = popupData.monthlyGrowth;
    
    // Render Social Notifications
    renderSocialNotifications();
}

function renderSocialNotifications() {
    const container = document.getElementById('socialNotifications');
    
    container.innerHTML = popupData.socialStats.map(stat => `
        <div class="notification-item ${stat.platform}">
            <div class="notification-icon ${stat.platform}">${stat.icon}</div>
            <div class="notification-content">
                <div class="notification-title">${stat.name}</div>
                <div class="notification-value">${stat.followers} followers</div>
            </div>
            <div class="notification-change ${stat.changeType}">
                ${stat.change !== '0' ? (stat.changeType === 'positive' ? '+' : '') + stat.change : '--'}
            </div>
        </div>
    `).join('');
}

// Load on Open...
async function loadPopupData() {
    try {
        // Try to get real data - To Do
        const response = await chrome.runtime.sendMessage({ 
            action: 'getPopupData' 
        });
        
        if (response && response.success) {
            popupData = response.data;
        }
    } catch (error) {
        console.log('Using demo data:', error);
        // Use demo data if there is an error
    }
    
    updatePopupData();
}


document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('openDashboard').addEventListener('click', function() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('dashboard.html')
        });
    });

    
    loadPopupData();
});