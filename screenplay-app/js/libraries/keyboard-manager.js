/**
 * keyboard-manager.js
 *
 * مدير اختصارات لوحة المفاتيح.
 * يستمع لأحداث لوحة المفاتيح ويقوم بإرسال أحداث عبر EventBus
 * بناءً على الاختصارات المحددة في ملف الإعدادات.
 */

class KeyboardManager {
    constructor(config, eventBus) {
        this.shortcuts = config.shortcuts;
        this.eventBus = eventBus;
        this.isInitialized = false;
    }

    /**
     * تهيئة مدير لوحة المفاتيح وبدء الاستماع للأحداث.
     */
    init() {
        if (this.isInitialized) {
            console.warn("KeyboardManager has already been initialized.");
            return;
        }
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.isInitialized = true;
        console.log("KeyboardManager initialized.");
    }

    /**
     * المعالج الرئيسي لأحداث الضغط على المفاتيح.
     * @param {KeyboardEvent} event - كائن الحدث الخاص بلوحة المفاتيح.
     */
    handleKeyDown(event) {
        // نتجاهل الأحداث داخل حقول الإدخال ما لم يكن الاختصار عامًا
        const targetElement = event.target;
        const isEditingInput = ['INPUT', 'TEXTAREA'].includes(targetElement.tagName) || targetElement.isContentEditable;

        // بناء مفتاح الاختصار من الحدث
        const key = this.getShortcutKey(event);

        if (this.shortcuts[key]) {
            // منع السلوك الافتراضي للمتصفح (مثل Ctrl+S يحفظ الصفحة)
            event.preventDefault();

            const eventName = this.shortcuts[key];
            console.log(`Shortcut detected: ${key}, emitting event: ${eventName}`);

            // إرسال الحدث عبر ناقل الأحداث
            this.eventBus.emit(eventName, { key, event });
        }
    }

    /**
     * يولد سلسلة تمثل تركيبة المفاتيح المضغوطة.
     * @param {KeyboardEvent} event - كائن الحدث.
     * @returns {string} سلسلة تمثل الاختصار، مثل "Ctrl+S".
     */
    getShortcutKey(event) {
        let key = [];
        if (event.ctrlKey) key.push('Ctrl');
        if (event.metaKey) key.push('Meta'); // For MacOS (Cmd key)
        if (event.altKey) key.push('Alt');
        if (event.shiftKey) key.push('Shift');

        // التعامل مع المفاتيح الرئيسية
        const mainKey = event.key.toUpperCase();
        if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(mainKey)) {
            if (mainKey.match(/^[0-9]$/)) {
                key.push(event.key);
            } else {
                key.push(mainKey.replace("ARROW", "")); // "ArrowUp" -> "UP"
            }
        }

        // في نظام ماك، نستبدل Ctrl بـ Meta (Cmd) للاختصارات الشائعة
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
           key = key.map(k => k === 'Ctrl' ? 'Meta' : k);
        }

        return key.join('+');
    }

    /**
     * لإيقاف الاستماع لأحداث لوحة المفاتيح.
     */
    destroy() {
        if (!this.isInitialized) return;
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        this.isInitialized = false;
        console.log("KeyboardManager destroyed.");
    }
}

// نفترض أن APP_CONFIG و EventBus تم تحميلهما
const GlobalKeyboardManager = new KeyboardManager(window.APP_CONFIG, window.EventBus);
window.KeyboardManager = GlobalKeyboardManager;

// عادةً ما يتم استدعاء init() في الملف الرئيسي للتطبيق (main.js)
// KeyboardManager.init();