/**
 * utilities.js
 *
 * مجموعة من الوظائف المساعدة العامة المستخدمة في جميع أنحاء التطبيق.
 * هذه الوظائف لا تنتمي إلى وحدة معينة ولكنها توفر وظائف أساسية.
 */

class Utilities {

    /**
     * يؤخر تنفيذ دالة حتى يمر وقت معين دون استدعائها مرة أخرى.
     * مفيد لتقليل عدد مرات تنفيذ العمليات المكلفة مثل الحفظ التلقائي أو طلبات البحث.
     * @param {Function} func - الدالة المراد تأخيرها.
     * @param {number} delay - فترة التأخير بالمللي ثانية.
     * @returns {Function} دالة جديدة مغلفة.
     */
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * يضمن تنفيذ دالة مرة واحدة فقط كل فترة زمنية محددة.
     * مفيد للأحداث التي يتم إطلاقها بشكل متكرر مثل التمرير أو تحريك الفأرة.
     * @param {Function} func - الدالة المراد تنظيمها.
     * @param {number} limit - الفترة الزمنية بالمللي ثانية.
     * @returns {Function} دالة جديدة مغلفة.
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * ينشئ معرفًا فريدًا عالميًا (UUID v4).
     * @returns {string} معرف فريد.
     */
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * ينظف سلسلة HTML لمنع هجمات XSS.
     * يقوم بإنشاء عنصر DOM مؤقت وتعيين النص الخاص به، ثم يقرأ innerHTML.
     * هذا يضمن أن أي HTML يتم تفسيره كنص عادي.
     * @param {string} str - السلسلة التي قد تحتوي على HTML.
     * @returns {string} سلسلة HTML آمنة.
     */
    static sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * ينسق كائن التاريخ إلى سلسلة قابلة للقراءة.
     * @param {Date} date - كائن التاريخ.
     * @param {string} [locale='ar-EG'] - اللغة المحلية للتنسيق.
     * @returns {string} التاريخ والوقت المنسقان.
     */
    static formatDate(date, locale = 'ar-EG') {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        if (isNaN(date)) {
            return 'تاريخ غير صالح';
        }

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    /**
     * يقوم بعمل نسخة عميقة من كائن.
     * @param {T} obj - الكائن المراد نسخه.
     * @returns {T} نسخة جديدة من الكائن.
     * @template T
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        // استخدام structuredClone للحصول على أداء أفضل ودعم أنواع أكثر
        if (typeof window.structuredClone === 'function') {
            try {
                return window.structuredClone(obj);
            } catch (e) {
                // fallback for types not supported by structuredClone
            }
        }
        // Fallback to JSON method
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            console.error("فشل في النسخ العميق:", e);
            return null;
        }
    }
}

// تصدير الكلاس كـ ES module
export default Utilities;