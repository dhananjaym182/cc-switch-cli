// CC-Switch Web UI - Main Application Logic

class CCSwitchUI {
    constructor() {
        this.currentProvider = 'claude';
        this.providers = ['claude', 'gemini', 'codex'];
        this.init();
    }

    init() {
        this.bindEvents();
        this.log('CC-Switch Web UI initialized', 'success');
        this.log('Ready to switch providers');
    }

    bindEvents() {
        // Provider selection
        document.querySelectorAll('.provider-card').forEach(card => {
            card.addEventListener('click', () => {
                const provider = card.dataset.provider;
                this.switchProvider(provider);
            });
        });

        // Action buttons
        document.getElementById('btn-check-config').addEventListener('click', () => this.checkConfig());
        document.getElementById('btn-list-providers').addEventListener('click', () => this.listProviders());
        document.getElementById('btn-get-env').addEventListener('click', () => this.getEnvVars());
        document.getElementById('btn-help').addEventListener('click', () => this.showHelp());
    }

    switchProvider(provider) {
        if (provider === this.currentProvider) {
            this.log(`${this.capitalize(provider)} is already active`);
            return;
        }

        this.log(`Switching provider to ${this.capitalize(provider)}...`);
        
        // Update active state
        document.querySelectorAll('.provider-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.provider === provider) {
                card.classList.add('active');
            }
        });

        // Update status display
        document.getElementById('active-provider').textContent = this.capitalize(provider);

        // Simulate the switch
        setTimeout(() => {
            this.currentProvider = provider;
            this.log(`Successfully switched to ${this.capitalize(provider)}`, 'success');
            this.log(`Provider: ${this.capitalize(provider)}`);
            this.log(`Config updated: ~/.cc-switch/config.json`);
        }, 500);
    }

    checkConfig() {
        this.log('Checking configuration...');
        setTimeout(() => {
            this.log('Configuration file found: ~/.cc-switch/config.json', 'success');
            this.log('Active provider: ' + this.capitalize(this.currentProvider));
            this.log('MCP servers: 3 configured');
            this.log('Prompts: 5 available');
        }, 300);
    }

    listProviders() {
        this.log('Available providers:');
        setTimeout(() => {
            this.providers.forEach(provider => {
                const isActive = provider === this.currentProvider;
                const status = isActive ? ' [ACTIVE]' : '';
                const classType = isActive ? 'success' : '';
                this.log(`  - ${this.capitalize(provider)}${status}`, classType);
            });
        }, 200);
    }

    getEnvVars() {
        this.log('Fetching environment variables...');
        setTimeout(() => {
            this.log('Environment variables:', 'success');
            this.log(`  ANTHROPIC_API_KEY=sk-ant-****${this.currentProvider}`);
            this.log(`  OPENAI_API_KEY=sk-****`);
            this.log(`  GOOGLE_API_KEY=AIza****`);
        }, 300);
    }

    showHelp() {
        this.log('CC-Switch Help:');
        setTimeout(() => {
            this.log('');
            this.log('  - Click on a provider card to switch');
            this.log('  - Use quick actions to check status');
            this.log('  - CLI: cc-switch switch <provider>');
            this.log('  - CLI: cc-switch list');
            this.log('  - CLI: cc-switch config --check');
            this.log('');
            this.log('For more info, see README.md');
        }, 200);
    }

    log(message, type = '') {
        const console = document.getElementById('console');
        const line = document.createElement('div');
        line.className = 'console-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = '$';
        
        const text = document.createElement('span');
        text.className = `text ${type}`;
        text.textContent = message;
        
        line.appendChild(prompt);
        line.appendChild(text);
        console.appendChild(line);
        
        // Auto-scroll to bottom
        console.scrollTop = console.scrollHeight;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ccSwitch = new CCSwitchUI();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CCSwitchUI;
}
