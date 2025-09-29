/**
 * main.js
 *
 * نقطة الدخول الرئيسية للتطبيق والمحرر الأساسي.
 * يحتوي على:
 * 1. كلاس MainApplication: يدير المحرر ومنطقه وتفاعلات المستخدم.
 * 2. كلاس ApplicationLoader: مسؤول عن إقلاع التطبيق وتهيئة جميع الوحدات.
 */

// =========================================================================
// Main Application Class (Editor Logic)
// =========================================================================
class MainApplication {
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config.editor;
        this.isInitialized = false;

        // Undo/Redo
        this.undoStack = [];
        this.redoStack = [];
        this.lastContent = '';

        // DOM Elements
        this.editor = document.getElementById('editor');
        this.statusBar = {
            wordCount: document.getElementById('word-count'),
            pageCount: document.getElementById('page-count'),
            charCount: document.getElementById('char-count'),
            currentFormat: document.getElementById('current-format'),
        };
        this.themeToggleButton = document.getElementById('theme-toggle');

        // Debounced functions for performance
        this.debouncedUpdateStats = Utilities.debounce(this.updateStatus.bind(this), 500);
        this.debouncedSaveStateForUndo = Utilities.debounce(this.saveStateForUndo.bind(this), 1000);
    }

    init() {
        if (this.isInitialized) return;

        this.setupEventListeners();
        this.startAutoSave();

        this.eventBus.on('project:loaded', (project) => this.loadContent(project.content));
        this.eventBus.on('document:loadContent', (content) => this.loadContent(content));

        this.lastContent = this.editor.innerHTML;
        this.saveStateForUndo(); // Save initial state

        this.isInitialized = true;
        console.log("MainApplication (Editor) initialized.");
    }

    loadContent(content) {
        this.editor.innerHTML = content || '<p class="format-action"><br></p>';
        this.updateStatus();
        this.undoStack = [];
        this.redoStack = [];
        this.saveStateForUndo();
    }

    setupEventListeners() {
        this.editor.addEventListener('input', () => {
            this.eventBus.emit('editor:contentChanged', this.editor.innerHTML);
            this.debouncedUpdateStats();
            this.debouncedSaveStateForUndo();
        });

        document.querySelector('.formats-list').addEventListener('click', (e) => {
            const button = e.target.closest('.format-btn');
            if (button) {
                this.applyFormat(button.dataset.format);
            }
        });

        // Event listeners for undo/redo buttons
        this.eventBus.on('undo', () => this.undo());
        this.eventBus.on('redo', () => this.redo());

        // Theme toggling
        this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
    }

    applyFormat(formatKey) {
        document.execCommand('formatBlock', false, 'p'); // Use p as base, then apply class
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        let element = selection.getRangeAt(0).startContainer;
        if (element.nodeType !== 1) {
            element = element.parentNode;
        }

        // Clear existing format classes
        element.className = '';
        element.classList.add(`format-${formatKey}`);

        this.updateStatus();
        this.saveStateForUndo();
    }

    updateStatus() {
        const text = this.editor.innerText;
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        const charCount = text.length;
        // Page count is a rough estimate, should be handled by AnalyticsEngine

        this.statusBar.wordCount.textContent = `كلمات: ${wordCount}`;
        this.statusBar.charCount.textContent = `حروف: ${charCount}`;
    }

    startAutoSave() {
        setInterval(() => {
            this.eventBus.emit('document:save');
        }, this.config.autoSaveInterval);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        const newTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        this.eventBus.emit('settings:changed', { theme: newTheme });
    }

    // Undo/Redo Logic
    saveStateForUndo() {
        const currentContent = this.editor.innerHTML;
        if (currentContent !== this.lastContent) {
            this.undoStack.push(this.lastContent);
            this.lastContent = currentContent;
            this.redoStack = []; // Clear redo stack on new action
            if (this.undoStack.length > this.config.undoStackLimit) {
                this.undoStack.shift(); // Keep stack size limited
            }
        }
    }

    undo() {
        if (this.undoStack.length > 0) {
            const prevState = this.undoStack.pop();
            this.redoStack.push(this.editor.innerHTML);
            this.editor.innerHTML = prevState;
            this.lastContent = prevState;
            this.eventBus.emit('editor:contentChanged', this.editor.innerHTML);
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const nextState = this.redoStack.pop();
            this.undoStack.push(this.editor.innerHTML);
            this.editor.innerHTML = nextState;
            this.lastContent = nextState;
            this.eventBus.emit('editor:contentChanged', this.editor.innerHTML);
        }
    }
}

// =========================================================================
// Application Loader (Bootstrapping Logic)
// =========================================================================
class ApplicationLoader {
    constructor() {
        this.appWrapper = document.getElementById('app-wrapper');
        this.loadingScreen = document.getElementById('loading-screen');
        this.errorBoundary = document.getElementById('error-boundary');
    }

    async boot() {
        console.log("Booting application...");
        this.setupGlobalErrorHandler();

        try {
            // Instantiate all systems
            const eventBus = window.EventBus;
            const storageManager = window.StorageManager;
            const config = window.APP_CONFIG;

            const mainApp = new MainApplication(eventBus, config);
            const integratedSystem = new window.IntegratedScreenplaySystem(config, eventBus, storageManager);

            // Pass mainApp instance to the integrated system
            integratedSystem.mainApp = mainApp;
            // In a real scenario, you'd instantiate and pass all other modules too
            // e.g., integratedSystem.exportSystem = new ProfessionalExportSystem(...)

            // Initialize core services
            window.NotificationManager.init();
            window.KeyboardManager.init();

            // Initialize the main systems
            await integratedSystem.init();
            mainApp.init();

            eventBus.on('system:initialized', (data) => {
                this.showApplication();
                if (data.settings) this.applyInitialSettings(data.settings);
            });

        } catch (error) {
            console.error("Critical boot failure:", error);
            this.showErrorState(error);
        }
    }

    showApplication() {
        this.loadingScreen.style.opacity = '0';
        this.loadingScreen.addEventListener('transitionend', () => this.loadingScreen.style.display = 'none');
        this.appWrapper.style.display = 'grid';
    }

    applyInitialSettings(settings) {
        document.body.className = ''; // Clear classes
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

// Start the application after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make classes available on window for now
    window.MainApplication = MainApplication;

    // Instantiate all other modules and attach to window
    // so they can be used by the integrated system
    window.Utilities = Utilities;
    window.ProfessionalExportSystem = ProfessionalExportSystem;
    window.EnhancedFunctions = EnhancedFunctions;
    window.AnalyticsEngine = AnalyticsEngine;
    window.VisualPlanningSystem = VisualPlanningSystem;
    window.CharacterManager = CharacterManager;
    window.ProjectManager = ProjectManager;
    window.AIWritingAssistant = AIWritingAssistant;
    window.SearchValidator = SearchValidator;
    window.CollaborationSystem = CollaborationSystem;

    const loader = new ApplicationLoader();
    loader.boot();
});