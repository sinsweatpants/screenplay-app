/**
 * collaboration.js
 *
 * نظام التعاون والمشاركة.
 * يدير التعليقات، تتبع التغييرات، إدارة المستخدمين، والإصدارات.
 * ملاحظة: يتطلب بنية تحتية خلفية (backend) للتعاون في الوقت الفعلي.
 * هذا التنفيذ هو محاكاة للواجهة الأمامية (frontend).
 */

import Utilities from './utilities.js';

export default class CollaborationSystem {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.comments = [];
        this.users = [ // قائمة مستخدمين محاكاة
            { id: 'user1', name: 'المستخدم الحالي', role: 'owner' },
            { id: 'user2', name: 'محرر مساعد', role: 'editor' },
            { id: 'user3', name: 'مراجع', role: 'commenter' },
        ];
        this.currentUser = this.users[0];
        this.isInitialized = false;
    }

    /**
     * تهيئة نظام التعاون.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('comment:add', (data) => this.addComment(data));
        this.eventBus.on('comment:resolve', (commentId) => this.resolveComment(commentId));
        this.eventBus.on('comment:delete', (commentId) => this.deleteComment(commentId));

        // مستمعون وهميون للميزات المتقدمة
        this.eventBus.on('changes:track', () => this.trackChange());
        this.eventBus.on('version:history', () => this.showVersionHistory());

        this.isInitialized = true;
        console.log("CollaborationSystem initialized.");
    }

    /**
     * إضافة تعليق جديد.
     * @param {object} data - بيانات التعليق.
     * @param {string} data.text - نص التعليق.
     * @param {string|number} data.targetId - معرف العنصر أو رقم السطر المستهدف.
     */
    addComment({ text, targetId }) {
        if (!this.can(this.currentUser, 'comment')) {
            this.eventBus.emit('notification:show', { message: 'ليس لديك صلاحية إضافة تعليق.', type: 'error' });
            return;
        }

        const newComment = {
            id: `comment_${Date.now()}`,
            authorId: this.currentUser.id,
            authorName: this.currentUser.name,
            text: Utilities.sanitizeHTML(text),
            targetId: targetId,
            createdAt: new Date().toISOString(),
            isResolved: false,
        };

        this.comments.push(newComment);
        this.eventBus.emit('comments:updated', this.comments);
        this.eventBus.emit('notification:show', { message: 'تمت إضافة التعليق.', type: 'success' });

        // محاكاة الإشارة للمستخدم
        if (text.includes('@')) {
            this.handleUserMention(text);
        }
    }

    /**
     * تحديد تعليق على أنه تم حله.
     * @param {string} commentId - معرف التعليق.
     */
    resolveComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.isResolved = !comment.isResolved; // Toggle resolved state
            this.eventBus.emit('comments:updated', this.comments);
        }
    }

    /**
     * حذف تعليق.
     * @param {string} commentId - معرف التعليق.
     */
    deleteComment(commentId) {
        const commentIndex = this.comments.findIndex(c => c.id === commentId);
        const comment = this.comments[commentIndex];

        if (comment && (this.can(this.currentUser, 'delete_own_comment', comment) || this.can(this.currentUser, 'delete_any_comment'))) {
            this.comments.splice(commentIndex, 1);
            this.eventBus.emit('comments:updated', this.comments);
            this.eventBus.emit('notification:show', { message: 'تم حذف التعليق.', type: 'info' });
        } else if (comment) {
            this.eventBus.emit('notification:show', { message: 'ليس لديك صلاحية حذف هذا التعليق.', type: 'error' });
        }
    }

    /**
     * نظام صلاحيات مبسط.
     * @param {object} user - المستخدم.
     * @param {string} action - الإجراء.
     * @param {object} [resource] - المورد (مثل تعليق).
     * @returns {boolean}
     */
    can(user, action, resource) {
        const roles = {
            owner: ['comment', 'edit', 'delete_any_comment'],
            editor: ['comment', 'edit', 'delete_own_comment'],
            commenter: ['comment'],
            viewer: []
        };

        const userRoles = roles[user.role] || [];
        if (action === 'delete_own_comment' && resource) {
            return userRoles.includes(action) && user.id === resource.authorId;
        }
        return userRoles.includes(action);
    }

    // =========================================================================
    // Placeholder methods for advanced features
    // =========================================================================

    handleUserMention(text) {
        const mentionMatch = text.match(/@(\w+)/);
        if (mentionMatch) {
            const mentionedUser = mentionMatch[1];
            console.log(`User mention detected: ${mentionedUser}. (Simulation: sending notification)`);
            this.eventBus.emit('notification:show', { message: `تمت الإشارة إلى ${mentionedUser}.`, type: 'info' });
        }
    }

    trackChange() {
        console.warn("Change tracking is a complex real-time feature and is not implemented.");
        this.eventBus.emit('notification:show', { message: 'ميزة تتبع التغييرات قيد التطوير.', type: 'info' });
    }

    showVersionHistory() {
        console.warn("Version history requires a backend and is not implemented.");
        this.eventBus.emit('notification:show', { message: 'ميزة سجل الإصدارات قيد التطوير.', type: 'info' });
    }
}

// تم تصدير الكلاس كـ ES module