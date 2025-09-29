/**
 * search-validator.js
 *
 * نظام البحث المتقدم والتحقق من الأخطاء.
 * يوفر أدوات للبحث في النص والتحقق من سلامة تنسيق السيناريو.
 */

class SearchValidator {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.isInitialized = false;
    }

    /**
     * تهيئة الوحدة.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('search:request', (params) => this.performSearch(params));
        this.eventBus.on('validation:request', (content) => this.performValidation(content));
        this.isInitialized = true;
        console.log("SearchValidator initialized.");
    }

    /**
     * تنفيذ عملية البحث.
     * @param {object} params - معلمات البحث.
     * @param {string} params.query - النص المراد البحث عنه.
     * @param {string} params.content - محتوى المحرر (HTML).
     * @param {string} [params.filter] - فلتر البحث (e.g., 'character', 'dialogue').
     */
    performSearch({ query, content, filter }) {
        if (!query || !content) {
            this.eventBus.emit('search:results', []);
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const lines = Array.from(tempDiv.children);
        const results = [];
        const lowerCaseQuery = query.toLowerCase();

        lines.forEach((line, index) => {
            const format = line.className;
            const text = line.textContent;
            const lowerCaseText = text.toLowerCase();

            let formatMatch = true;
            if (filter && !format.includes(this.config.formattingKeys[filter.toUpperCase()])) {
                formatMatch = false;
            }

            if (formatMatch && lowerCaseText.includes(lowerCaseQuery)) {
                results.push({
                    lineNumber: index + 1,
                    text: text,
                    format: format,
                });
            }
        });

        this.eventBus.emit('search:results', results);
        this.eventBus.emit('notification:show', { message: `تم العثور على ${results.length} نتيجة.`, type: 'info' });
    }

    /**
     * تنفيذ عملية التحقق من الأخطاء.
     * @param {string} content - محتوى المحرر (HTML).
     */
    performValidation(content) {
        if (!content) {
            this.eventBus.emit('validation:results', []);
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const lines = Array.from(tempDiv.children);
        const errors = [];

        let lastFormat = null;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const format = line.className;
            const text = line.textContent.trim();

            // خطأ: حوار يتبع أي شيء غير شخصية أو بين قوسين
            if (format.includes(this.config.formattingKeys.DIALOGUE)) {
                if (lastFormat && !lastFormat.includes(this.config.formattingKeys.CHARACTER) && !lastFormat.includes(this.config.formattingKeys.PARENTHETICAL)) {
                    errors.push({
                        lineNumber: i + 1,
                        severity: 'high',
                        message: 'يجب أن يسبق الحوار اسم شخصية.',
                        suggestion: 'أضف اسم شخصية قبل هذا السطر.',
                    });
                }
            }

            // خطأ: شخصية لا يتبعها حوار أو بين قوسين
            if (format.includes(this.config.formattingKeys.CHARACTER)) {
                const nextLine = lines[i + 1];
                if (!nextLine || (!nextLine.className.includes(this.config.formattingKeys.DIALOGUE) && !nextLine.className.includes(this.config.formattingKeys.PARENTHETICAL))) {
                    errors.push({
                        lineNumber: i + 1,
                        severity: 'medium',
                        message: `شخصية "${text}" لا يتبعها حوار.`,
                        suggestion: 'أضف حوارًا أو ملاحظة بين قوسين بعد اسم الشخصية.',
                    });
                }
            }

            // تحذير: عنوان مشهد غير قياسي
            if (format.includes(this.config.formattingKeys.HEADING_1)) {
                if (!/^(INT\.|EXT\.)/i.test(text)) {
                     errors.push({
                        lineNumber: i + 1,
                        severity: 'low',
                        message: 'عنوان المشهد لا يبدأ بـ INT. أو EXT.',
                        suggestion: 'تأكد من أن عناوين المشاهد تتبع التنسيق القياسي (مثل: INT. ROOM - DAY).',
                    });
                }
            }

            if (text) { // تجاهل الأسطر الفارغة
                lastFormat = format;
            }
        }

        this.eventBus.emit('validation:results', errors);
        this.eventBus.emit('notification:show', { message: `اكتمل التحقق، تم العثور على ${errors.length} مشكلة.`, type: 'info' });
    }
}

// إرفاقه بالكائن window لسهولة الوصول
window.SearchValidator = SearchValidator;