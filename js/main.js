/**
 * نقطة الدخول الرئيسية للتطبيق
 * @module main
 */

// Import CSS (simplified)
import '../css/main.css';
import '../css/editor.css';
import '../css/components.css';
import '../css/modals.css';
import '../css/responsive.css';
import '../css/export-menu.css';
import '../css/visual-analysis.css';
import '../css/main-toolbar.css';

// Import Core
import config from './core/config.js';
import IntegratedScreenplaySystem from './core/integrated-system.js';
import MainApplication from './core/app.js';

// Import Libraries
import EventBus from './libraries/event-bus.js';
import StorageManager from './libraries/storage-manager.js';
import KeyboardManager from './libraries/keyboard-manager.js';
import NotificationManager from './libraries/notification-manager.js';

// Import Modules
import AnalyticsEngine from './modules/analytics.js';
import ProfessionalExportSystem from './modules/export.js';
import CharacterManager from './modules/character-manager.js';
import AIWritingAssistant from './modules/ai-assistant.js';
import VisualPlanningSystem from './modules/planning.js';
import ProjectManager from './modules/project-manager.js';
import SearchValidator from './modules/search-validator.js';
import CollaborationSystem from './modules/collaboration.js';
import EnhancedFunctions from './modules/functions.js';
import Utilities from './modules/utilities.js';
import ToolbarManager from './toolbar-functions.js';

/**
 * Application Loader Class
 */
class ApplicationLoader {
    constructor() {
        this.appWrapper = document.getElementById('app-wrapper');
        this.loadingScreen = document.getElementById('loading-screen');
        this.errorBoundary = document.getElementById('error-boundary');
    }

    async boot() {
        console.log("🚀 بدء تحميل تطبيق كاتب السيناريو...");
        this.setupGlobalErrorHandler();

        try {
            // Instantiate all systems
            const eventBus = new EventBus();
            const storageManager = new StorageManager();
            
            const mainApp = new MainApplication(eventBus, config);
            const integratedSystem = new IntegratedScreenplaySystem(config, eventBus, storageManager);

            // Pass mainApp instance to the integrated system
            integratedSystem.mainApp = mainApp;
            
            // Initialize other modules
            integratedSystem.utilityFunctions = new Utilities();
            integratedSystem.exportSystem = new ProfessionalExportSystem(eventBus, config);
            integratedSystem.analyticsEngine = new AnalyticsEngine(eventBus, config);
            integratedSystem.visualPlanningSystem = new VisualPlanningSystem(eventBus, config);
            integratedSystem.characterManager = new CharacterManager(eventBus, config);
            integratedSystem.projectManager = new ProjectManager(eventBus, storageManager, config);
            integratedSystem.aiAssistant = new AIWritingAssistant(eventBus, config);
            integratedSystem.searchValidator = new SearchValidator(eventBus, config);
            integratedSystem.collaborationSystem = new CollaborationSystem(eventBus, config);
            integratedSystem.enhancedFunctions = new EnhancedFunctions(eventBus, config);

            // Initialize core services
            const notificationManager = new NotificationManager();
            const keyboardManager = new KeyboardManager();
            
            notificationManager.init();
            keyboardManager.init();

            // Initialize the main systems
            await integratedSystem.init();
            mainApp.init();
            
            // Initialize toolbar with all functions
            const toolbarManager = new ToolbarManager(eventBus);
            console.log('🎯 جميع الوظائف الـ 11 مفعلة ومتاحة للاستخدام!');

            eventBus.on('system:initialized', (data) => {
                this.showApplication();
                if (data.settings) this.applyInitialSettings(data.settings);
            });

            // Make available for debugging in development
            if (import.meta.env.DEV) {
                window.screenplayApp = integratedSystem;
                window.toolbarManager = toolbarManager;
                console.log('✅ التطبيق متاح عبر: window.screenplayApp');
                console.log('🛠️ شريط الأدوات متاح عبر: window.toolbarManager');
            }

            console.log('✅ تم تحميل التطبيق بنجاح');

        } catch (error) {
            console.error("❌ فشل في تحميل التطبيق:", error);
            this.showErrorState(error);
        }
    }

    showApplication() {
        this.loadingScreen.style.opacity = '0';
        this.loadingScreen.addEventListener('transitionend', () => this.loadingScreen.style.display = 'none');
        this.appWrapper.style.display = 'grid';
    }

    applyInitialSettings(settings) {
        document.body.className = '';
        document.body.classList.add(settings.theme || 'light-mode');
    }

    setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            console.error("Global error caught:", event.error);
            this.showErrorState(event.error);
        });
        window.addEventListener('unhandledrejection', (event) => {
            console.error("Unhandled promise rejection:", event.reason);
            this.showErrorState(event.reason);
        });
    }

    showErrorState(error) {
        this.loadingScreen.style.display = 'none';
        this.appWrapper.style.display = 'none';
        this.errorBoundary.style.display = 'flex';
    }
}

/**
 * تهيئة وبدء التطبيق
 */
async function initializeApp() {
    const loader = new ApplicationLoader();
    await loader.boot();
}

// بدء التطبيق عند تحميل DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Hot Module Replacement (Development only)
if (import.meta.hot) {
    import.meta.hot.accept();
}