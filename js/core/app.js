/**
 * app.js
 *
 * المحرر الأساسي للتطبيق.
 * يحتوي على كلاس MainApplication الذي يدير المحرر ومنطقه وتفاعلات المستخدم.
 */

import Utilities from '../modules/utilities.js';

/**
 * Main Application Class (Editor Logic)
 */
export default class MainApplication {
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