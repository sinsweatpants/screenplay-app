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


/**
 * إعدادات التطبيق الرئيسية
 * @type {AppConfig}
 */
export const APP_CONFIG = {
    appName: "تطبيق كتابة السيناريو",
    appVersion: "1.0.0",
    defaultTheme: 'light-mode', // 'light-mode' or 'dark-mode'
    defaultLanguage: 'ar', // 'ar' or 'en'

     npm run dev

> screenplay-app@1.0.0 dev
> vite


  VITE v5.4.20  ready in 332 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
٢:٢٣:٣٦ ص [vite] page reload index.html
٢:٣٠:٠٩ ص [vite] page reload index.html (x2)
٢:٥٦:٣٢ ص [vite] page reload index.html (x3)
٢:٥٧:٣٤ ص [vite] page reload index.html (x4)
٢:٥٧:٤٥ ص [vite] page reload js/main-simple.js
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
٢:٥٧:٤٦ ص [vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
  Plugin: vite:import-analysis
  File: H:/screenplay-app/js/main-simple.js:46:4
  44 |          console.error('خطأ في تحميل اختبار الوظائف:', err);
  45 |      });
  46 |  });}
     |     ^
      at TransformPluginContext._formatError (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49258:41)
      at TransformPluginContext.error (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49253:16)
      at TransformPluginContext.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64258:14)
      at async PluginContainer.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
      at async loadAndTransform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
      at async viteTransformMiddleware (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24)
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.  
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x2)
٢:٥٧:٤٦ ص [vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
  Plugin: vite:import-analysis
  File: H:/screenplay-app/js/main-simple.js:46:4
  44 |          console.error('خطأ في تحميل اختبار الوظائف:', err);
  45 |      });
  46 |  });}
     |     ^
      at TransformPluginContext._formatError (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49258:41)
      at TransformPluginContext.error (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49253:16)
      at TransformPluginContext.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64258:14)
      at async PluginContainer.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
      at async loadAndTransform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
      at async viteTransformMiddleware (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24)
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.  
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x2)
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x3)
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x4)
٢:٥٧:٤٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x5)
٢:٥٨:٢٣ ص [vite] page reload test-move.html
٣:١٣:٠٥ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
٣:١٣:٠٥ ص [vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
  Plugin: vite:import-analysis
  File: H:/screenplay-app/js/main-simple.js:46:4
  44 |          console.error('خطأ في تحميل اختبار الوظائف:', err);
  45 |      });
  46 |  });}
     |     ^
      at TransformPluginContext._formatError (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49258:41)
      at TransformPluginContext.error (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49253:16)
      at TransformPluginContext.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64258:14)
      at async PluginContainer.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
      at async loadAndTransform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
      at async viteTransformMiddleware (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24)
٣:١٣:٠٥ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.  
٣:١٣:٠٥ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x2)
٣:١٣:٠٥ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x3)
٣:١٣:٠٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x4)
٣:١٣:٠٦ ص [vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
  Plugin: vite:import-analysis
  File: H:/screenplay-app/js/main-simple.js:46:4
  44 |          console.error('خطأ في تحميل اختبار الوظائف:', err);
  45 |      });
  46 |  });}
     |     ^
      at TransformPluginContext._formatError (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49258:41)
      at TransformPluginContext.error (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49253:16)
      at TransformPluginContext.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64258:14)
      at async PluginContainer.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
      at async loadAndTransform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
      at async viteTransformMiddleware (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24)
٣:١٣:٠٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.  
٣:١٣:٠٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x2)
٣:١٣:٠٦ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x3)
٣:١٣:٠٧ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x4)
٣:١٣:٠٧ ص [vite] Internal server error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.
  Plugin: vite:import-analysis
  File: H:/screenplay-app/js/main-simple.js:46:4
  44 |          console.error('خطأ في تحميل اختبار الوظائف:', err);
  45 |      });
  46 |  });}
     |     ^
      at TransformPluginContext._formatError (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49258:41)
      at TransformPluginContext.error (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49253:16)
      at TransformPluginContext.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64258:14)
      at async PluginContainer.transform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49099:18)
      at async loadAndTransform (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:51977:27)
      at async viteTransformMiddleware (file:///H:/screenplay-app/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62105:24)
٣:١٣:٠٧ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.  
٣:١٣:٠٧ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x2)
٣:١٣:٠٧ ص [vite] Pre-transform error: Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension. (x3)

















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

// تصدير الإعدادات كـ default export
export default Object.freeze(APP_CONFIG);