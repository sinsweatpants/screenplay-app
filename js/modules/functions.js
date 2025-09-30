/**
 * functions.js
 *
 * مسؤول عن وظائف استيراد ومعالجة الملفات.
 * يقرأ الملفات، ينظف محتواها، ويجهزها للعرض في المحرر.
 * يتضمن التعامل مع أنواع ملفات مختلفة.
 */

export default class EnhancedFunctions {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.maxFileSize = 50 * 1024 * 1024; // 50MB
        this.isInitialized = false;
    }

    /**
     * تهيئة الوحدة.
     */
    init() {
        if (this.isInitialized) return;
        // يمكن إضافة مستمعي أحداث هنا إذا لزم الأمر، مثل السحب والإفلات
        this.eventBus.on('import:request', this.handleImportRequest.bind(this));
        this.isInitialized = true;
        console.log("EnhancedFunctions (Import/Process) initialized.");
    }

    /**
     * معالج طلبات الاستيراد.
     * @param {File} file - الملف المراد استيراده.
     */
    async handleImportRequest(file) {
        if (!file) {
            this.eventBus.emit('notification:show', { message: 'لم يتم اختيار ملف.', type: 'error' });
            return;
        }

        // التحقق من حجم الملف
        if (file.size > this.maxFileSize) {
            this.eventBus.emit('notification:show', { message: `حجم الملف يتجاوز الحد المسموح به (50 ميجابايت).`, type: 'error' });
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();
        let content = '';

        try {
            switch (fileExtension) {
                case 'txt':
                    content = await this.readTextFile(file);
                    break;
                case 'docx':
                    content = await this.readDocxFile(file);
                    break;
                case 'rtf':
                    this.eventBus.emit('notification:show', { message: 'استيراد ملفات RTF غير مدعوم حاليًا.', type: 'info' });
                    return;
                default:
                    this.eventBus.emit('notification:show', { message: `نوع الملف '${fileExtension}' غير مدعوم.`, type: 'error' });
                    return;
            }

            const cleanedContent = this.cleanText(content);
            // في المستقبل، يمكن استدعاء التصنيف الذكي هنا
            // const classifiedContent = this.classifyText(cleanedContent);

            this.eventBus.emit('document:loadContent', cleanedContent);
            this.eventBus.emit('notification:show', { message: `تم استيراد "${file.name}" بنجاح.`, type: 'success' });

        } catch (error) {
            console.error("فشل استيراد الملف:", error);
            this.eventBus.emit('notification:show', { message: `حدث خطأ أثناء قراءة الملف.`, type: 'error' });
        }
    }

    /**
     * يقرأ ملف نصي عادي.
     * @param {File} file - الملف.
     * @returns {Promise<string>} محتوى الملف.
     */
    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e.target.error);
            reader.readAsText(file, 'UTF-8');
        });
    }

    /**
     * يقرأ ملف DOCX.
     * ملاحظة: يتطلب مكتبة مثل mammoth.js.
     * @param {File} file - الملف.
     * @returns {Promise<string>} محتوى HTML من ملف DOCX.
     */
    async readDocxFile(file) {
        // التحقق من وجود المكتبة
        if (typeof mammoth === 'undefined') {
            console.warn("مكتبة mammoth.js غير موجودة. لا يمكن قراءة ملفات DOCX.");
            this.eventBus.emit('notification:show', { message: 'مكتبة قراءة DOCX غير محملة.', type: 'error' });
            throw new Error("Mammoth.js is not loaded.");
        }

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        return result.value; // The generated HTML
    }

    /**
     * ينظف النص المستورد.
     * @param {string} text - النص المراد تنظيفه.
     * @returns {string} نص نظيف.
     */
    cleanText(text) {
        // إزالة المسافات الزائدة من البداية والنهاية
        let cleaned = text.trim();
        // يمكن إضافة عمليات تنظيف أخرى هنا
        return cleaned;
    }

    /**
     * (مستقبلي) يصنف النص بذكاء إلى تنسيقات السيناريو المختلفة.
     * @param {string} text - النص.
     * @returns {string} نص HTML منسق.
     */
    classifyText(text) {
        console.log("AI Text Classification - Not yet implemented.");
        // هنا يتم استدعاء AI Assistant لتحليل النص وتقسيمه إلى
        // مشاهد، شخصيات، حوار، إلخ.
        // EventBus.emit('ai:classify', text);
        return text; // حاليًا يعيد النص كما هو
    }
}

// تم تصدير الكلاس كـ ES module