/**
 * event-bus.js
 *
 * نظام مركزي لإدارة الأحداث (Publish/Subscribe Pattern).
 * يسمح للوحدات المختلفة بالتواصل مع بعضها البعض بشكل غير متزامن
 * دون الحاجة إلى وجود تبعيات مباشرة بينها.
 *
 * @example
 * // وحدة أخرى تشترك في الحدث
 * EventBus.on('user:login', (userData) => {
 *   console.log(`المستخدم ${userData.name} قد سجل دخوله.`);
 * });
 *
 * // وحدة تقوم بنشر الحدث
 * EventBus.emit('user:login', { name: 'أحمد' });
 */

class EventBus {
    constructor() {
        /**
         * @private
         * @type {Object<string, Array<Function>>}
         */
        this.events = {};
    }

    /**
     * الاشتراك في حدث معين.
     * @param {string} event - اسم الحدث.
     * @param {Function} listener - الدالة التي سيتم استدعاؤها عند وقوع الحدث.
     * @returns {Function} دالة لإلغاء الاشتراك مباشرة.
     */
    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);

        // إرجاع دالة لإلغاء الاشتراك بسهولة
        return () => this.off(event, listener);
    }

    /**
     * إلغاء الاشتراك من حدث معين.
     * @param {string} event - اسم الحدث.
     * @param {Function} listener - الدالة التي تم الاشتراك بها.
     */
    off(event, listener) {
        if (typeof this.events[event] === 'object') {
            const idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }

    /**
     * نشر (إرسال) حدث إلى جميع المشتركين.
     * @param {string} event - اسم الحدث المراد نشره.
     * @param {*} [data] - البيانات التي سيتم إرسالها مع الحدث.
     */
    emit(event, data) {
        if (typeof this.events[event] === 'object') {
            // نستخدم slice لإنشاء نسخة من المصفوفة لتجنب المشاكل
            // في حال قام أحد المشتركين بإلغاء اشتراكه أثناء التكرار.
            this.events[event].slice().forEach(listener => {
                try {
                    listener.call(this, data);
                } catch (e) {
                    console.error(`خطأ في معالج الحدث '${event}':`, e);
                }
            });
        }
    }

    /**
     * الاشتراك في حدث لمرة واحدة فقط.
     * @param {string} event - اسم الحدث.
     * @param {Function} listener - الدالة التي سيتم استدعاؤها.
     */
    once(event, listener) {
        const onceListener = (data) => {
            listener.call(this, data);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }
}

// تصدير EventBus كـ ES module
export default EventBus;