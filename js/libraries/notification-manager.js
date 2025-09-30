/**
 * notification-manager.js
 *
 * مدير الإشعارات.
 * يعرض إشعارات للمستخدم بناءً على الأحداث المرسلة عبر EventBus.
 *
 * @example
 * // لإظهار إشعار نجاح
 * EventBus.emit('notification:show', {
 *   message: 'تم حفظ المستند بنجاح!',
 *   type: 'success', // 'success', 'error', 'info'
 *   duration: 3000 // (optional)
 * });
 */

export default class NotificationManager {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.container = null;
        this.isInitialized = false;
    }

    /**
     * تهيئة مدير الإشعارات وإنشاء الحاوية الخاصة بها.
     */
    init() {
        if (this.isInitialized) return;

        // إنشاء حاوية الإشعارات
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.applyContainerStyles(this.container);
        document.body.appendChild(this.container);

        // الاستماع لحدث إظهار الإشعار
        if (this.eventBus) {
            this.eventBus.on('notification:show', this.show.bind(this));
        }

        this.isInitialized = true;
        console.log("NotificationManager initialized.");
    }

    /**
     * يطبق الأنماط الأساسية على حاوية الإشعارات.
     * @param {HTMLElement} element - عنصر الحاوية.
     */
    applyContainerStyles(element) {
        element.style.position = 'fixed';
        element.style.bottom = '20px';
        element.style.right = '20px';
        element.style.zIndex = '2000'; // أعلى من كل شيء آخر
        element.style.display = 'flex';
        element.style.flexDirection = 'column';
        element.style.gap = '10px';
    }

    /**
     * يعرض إشعارًا جديدًا.
     * @param {object} options - خيارات الإشعار.
     * @param {string} options.message - الرسالة المطلوب عرضها.
     * @param {string} [options.type='info'] - نوع الإشعار ('success', 'error', 'info').
     * @param {number} [options.duration=4000] - مدة عرض الإشعار بالمللي ثانية.
     */
    show({ message, type = 'info', duration = 4000 }) {
        if (!this.container) {
            console.error("Notification container not found. Was init() called?");
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        this.applyNotificationStyles(notification, type);

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;'; // '×' character
        this.applyCloseButtonStyles(closeButton);

        notification.appendChild(messageSpan);
        notification.appendChild(closeButton);

        this.container.appendChild(notification);

        // لإضافة تأثير الدخول
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        const dismiss = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            notification.addEventListener('transitionend', () => {
                if(notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            });
        };

        closeButton.addEventListener('click', dismiss);

        if (duration > 0) {
            setTimeout(dismiss, duration);
        }
    }

    /**
     * يطبق الأنماط على عنصر الإشعار.
     * @param {HTMLElement} element - عنصر الإشعار.
     * @param {string} type - نوع الإشعار.
     */
    applyNotificationStyles(element, type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#2563eb'
        };
        const backgroundColor = colors[type] || colors['info'];

        Object.assign(element.style, {
            backgroundColor: backgroundColor,
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            minWidth: '280px',
            maxWidth: '350px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            fontFamily: 'var(--font-ui, sans-serif)',
            fontSize: '14px'
        });
    }

    /**
     * يطبق الأنماط على زر الإغلاق.
     * @param {HTMLButtonElement} button - عنصر الزر.
     */
    applyCloseButtonStyles(button) {
        Object.assign(button.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            lineHeight: '1',
            cursor: 'pointer',
            opacity: '0.8',
            padding: '0 4px'
        });
        button.onmouseover = () => button.style.opacity = '1';
        button.onmouseout = () => button.style.opacity = '0.8';
    }
}

// تم تصدير الكلاس كـ ES module