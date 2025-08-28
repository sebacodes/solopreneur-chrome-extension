class DashboardUI {
    constructor() {
        this.revenueData = {};
        this.loadDashboard();
    }

    async loadDashboard() {
        try {
            const response = await chrome.runtime.sendMessage({ 
                action: 'getDashboardData' 
            });
            
            if (response.success) {
                this.revenueData = response.data.revenueData;
                this.updateTotalRevenue();
                this.renderSources();
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    updateTotalRevenue() {
        const total = Object.values(this.revenueData)
            .reduce((sum, source) => sum + source.revenue, 0);
        
        document.getElementById('totalRevenue').textContent = 
            `$${total.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    }

    renderSources() {
        const grid = document.getElementById('sourcesGrid');
        const platformNames = {
            stripe: 'Stripe',
            paypal: 'PayPal',
            youtube: 'YouTube',
            gumroad: 'Gumroad'
        };

        grid.innerHTML = Object.entries(this.revenueData)
            .map(([platform, data]) => `
                <div class="source-card ${platform}">
                    <div class="source-header">
                        <div class="source-name">${platformNames[platform]}</div>
                        <div class="source-status ${data.connected ? 'status-connected' : 'status-disconnected'}">
                            ${data.connected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>
                    <div class="source-revenue">$${data.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <div class="source-change ${data.change.startsWith('+') ? 'positive' : 'negative'}">${data.change} this month</div>
                    <div class="source-actions">
                        <button class="btn btn-primary" onclick="dashboard.configureSource('${platform}')">
                            ${data.connected ? 'Reconfigure' : 'Configure'}
                        </button>
                        <button class="btn btn-secondary" onclick="dashboard.showAPIGuide('${platform}')">
                            API Guide
                        </button>
                    </div>
                </div>
            `).join('');
    }

    configureSource(platform) {
        console.log(`Configure ${platform}`);
        // Modal config - To Do
    }

    showAPIGuide(platform) {
        console.log(`Show API guide for ${platform}`);
        // Guide - To Do
    }

    showError(message) {
        console.error(message);
        // Notifications - To Do
    }
}

// Global functions
function showAddSourceForm() {
    console.log('Show add source form');
    // To Do
}


const dashboard = new DashboardUI();