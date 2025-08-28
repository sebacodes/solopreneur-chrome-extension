class SolopreneurDashboard {
    constructor() {
        this.setupMessageHandlers();
        this.initializeData();
    }

    setupMessageHandlers() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'getPopupData':
                    this.getPopupData()
                        .then(data => sendResponse({ success: true, data }))
                        .catch(error => sendResponse({ success: false, error: error.message }));
                    break;

                case 'getDashboardData':
                    this.getDashboardData()
                        .then(data => sendResponse({ success: true, data }))
                        .catch(error => sendResponse({ success: false, error: error.message }));
                    break;

                case 'saveAPIKeys':
                    this.saveAPIKeys(request.platform, request.keys)
                        .then(() => sendResponse({ success: true }))
                        .catch(error => sendResponse({ success: false, error: error.message }));
                    break;

                case 'fetchRevenue':
                    this.fetchAllRevenue()
                        .then(data => sendResponse({ success: true, data }))
                        .catch(error => sendResponse({ success: false, error: error.message }));
                    break;
            }
            
            return true; // Maintain open conection for async
        });
    }

    async initializeData() {
        // If there is no initial data, fill with example data
        const stored = await chrome.storage.local.get('dashboardData');
        if (!stored.dashboardData) {
            const initialData = {
                revenueData: {
                    stripe: { revenue: 15420.50, change: '+12.3%', connected: true },
                    paypal: { revenue: 8920.30, change: '+8.1%', connected: true },
                    youtube: { revenue: 2340.80, change: '+15.7%', connected: false },
                    gumroad: { revenue: 0, change: '0%', connected: false }
                },
                socialStats: [
                    { platform: 'twitter', name: 'Twitter', icon: 'T', followers: '2.4K', change: '+125', changeType: 'positive' },
                    { platform: 'youtube', name: 'YouTube', icon: 'Y', followers: '856', change: '+23', changeType: 'positive' },
                    { platform: 'instagram', name: 'Instagram', icon: 'I', followers: '1.2K', change: '0', changeType: 'neutral' }
                ]
            };
            
            await chrome.storage.local.set({ dashboardData: initialData });
        }
    }

    async getPopupData() {
        const stored = await chrome.storage.local.get('dashboardData');
        const data = stored.dashboardData;
        
        // Calculate totals for popup
        const totalRevenue = Object.values(data.revenueData)
            .reduce((sum, source) => sum + source.revenue, 0);
        
        const connectedSources = Object.values(data.revenueData)
            .filter(source => source.connected).length;
        
        return {
            totalRevenue,
            connectedSources,
            monthlyGrowth: '+12.5%', // Change thi after integration.
            socialStats: data.socialStats
        };
    }

    async getDashboardData() {
        const stored = await chrome.storage.local.get('dashboardData');
        return stored.dashboardData;
    }

    async saveAPIKeys(platform, keys) {
        console.log(`Saving API keys for ${platform}:`, keys);
        // API Key secure storage
        await chrome.storage.local.set({ [`api_${platform}`]: keys });
    }

    async fetchAllRevenue() {
        const stored = await chrome.storage.local.get('dashboardData');
        return stored.dashboardData.revenueData;
    }
}


new SolopreneurDashboard();