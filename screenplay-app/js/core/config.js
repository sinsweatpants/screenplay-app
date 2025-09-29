/**
 * config.js
 *
 * ملف الإعدادات المركزي للتطبيق.
 * يحتوي على جميع الثوابت والمتغيرات القابلة للتعديل.
 * يهدف إلى تجنب الـ "hard-coding" وتسهيل إدارة الإعدادات.
 */

// JSDoc for type definitions
/**
 * @typedef {Object} AppConfig
 * @property {string} appName - اسم التطبيق.
 * @property {string} appVersion - إصدار التطبيق.
 * @property {string} defaultTheme - الوضع الافتراضي (light-mode or dark-mode).
 * @property {string} defaultLanguage - اللغة الافتراضية (ar or en).
 * @property {ApiConfig} api - إعدادات واجهات برمجة التطبيقات.
 * @property {EditorConfig} editor - إعدادات المحرر.
 * @property {StorageConfig} storage - إعدادات التخزين.
 * @property {Object<string, string>} formattingKeys - مفاتيح التنسيقات.
 */

/**
 * @typedef {Object} ApiConfig
 * @property {string} claudeApiKey - مفتاح API الخاص بـ Anthropic Claude (يجب أن يضيفه المستخدم).
 * @property {string} claudeApiUrl - عنوان URL لواجهة برمجة تطبيقات Claude.
 * @property {string} claudeModel - نموذج Claude المستخدم.
 * @property {number} aiRequestDebounce - فترة انتظار طلبات الذكاء الاصطناعي (بالمللي ثانية).
 */

/**
 * @typedef {Object} EditorConfig
 * @property {string} defaultFont - الخط الافتراضي للمحرر.
 * @property {string} defaultFontSize - حجم الخط الافتراضي للمحرر.
 * @property {number} autoSaveInterval - الفاصل الزمني للحفظ التلقائي (بالمللي ثانية).
 * @property {number} undoStackLimit - الحد الأقصى لمستويات التراجع.
 * @property {boolean} showRulers - إظهار المساطر بشكل افتراضي.
 * @property {boolean} showLineNumbers - إظهار أرقام الأسطر بشكل افتراضي.
 */

/**
 * @typedef {Object} StorageConfig
 * @property {string} localPrefix - البادئة المستخدمة لمفاتيح localStorage.
 * @property {string} dbName - اسم قاعدة بيانات IndexedDB.
 * @property {number} dbVersion - إصدار قاعدة بيانات IndexedDB.
 * @property {string} projectsStore - اسم مخزن المشاريع في IndexedDB.
 * @property {string} settingsStore - اسم مخزن الإعدادات في IndexedDB.
 */


/** @type {AppConfig} */
const config = {
    appName: "تطبيق كتابة السيناريو",
    appVersion: "1.0.0",
    defaultTheme: 'light-mode', // 'light-mode' or 'dark-mode'
    defaultLanguage: 'ar', // 'ar' or 'en'

    api: {
        claudeApiKey: '', // <-- هام: يجب على المستخدم إدخال مفتاح API هنا
        claudeApiUrl: 'https://api.anthropic.com/v1/messages',
        claudeModel: 'claude-3-sonnet-20240229', // استخدام نموذج Sonnet 3.5
        aiRequestDebounce: 1500, // 1.5 ثانية
    },

    editor: {
        defaultFont: "'Courier New', Courier, monospace",
        defaultFontSize: '12pt',
        autoSaveInterval: 30000, // 30 ثانية
        undoStackLimit: 50,
        showRulers: true,
        showLineNumbers: false,
    },

    storage: {
        localPrefix: 'screenplay_app_',
        dbName: 'ScreenplayAppDB',
        dbVersion: 1,
        projectsStore: 'projects',
        settingsStore: 'user_settings',
    },

    formattingKeys: {
        BASMALA: 'basmala',
        HEADING_1: 'heading1',
        HEADING_2: 'heading2',
        HEADING_3: 'heading3',
        CHARACTER: 'character',
        DIALOGUE: 'dialogue',
        PARENTHETICAL: 'parenthetical',
        ACTION: 'action',
        TRANSITION: 'transition',
    },

    // Keyboard shortcuts mapping
    // Note: This is a conceptual representation. The actual implementation will be in KeyboardManager.
    shortcuts: {
        'Ctrl+0': 'format-basmala',
        'Ctrl+1': 'format-heading1',
        'Ctrl+2': 'format-heading2',
        'Ctrl+3': 'format-heading3',
        'Ctrl+4': 'format-character',
        'Ctrl+5': 'format-dialogue',
        'Ctrl+6': 'format-parenthetical',
        'Ctrl+7': 'format-action',
        'Ctrl+8': 'format-transition',
        'Ctrl+S': 'save-document',
        'Ctrl+O': 'open-document',
        'Ctrl+N': 'new-document',
        'Ctrl+Z': 'undo',
        'Ctrl+Y': 'redo',
        'Ctrl+P': 'print-document',
    }
};

// To make it accessible as a module
// In a real module system, you would use `export default config;`
// For this project structure, we'll attach it to the window temporarily.
window.APP_CONFIG = Object.freeze(config);