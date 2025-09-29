/**
 * project-manager.js
 *
 * نظام إدارة المشاريع.
 * مسؤول عن إنشاء، تحميل، حذف، وإدارة المشاريع المتعددة،
 * بالإضافة إلى القوالب والإصدارات.
 */

class ProjectManager {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {StorageManager} storageManager - مدير التخزين.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, storageManager, config) {
        this.eventBus = eventBus;
        this.storageManager = storageManager;
        this.config = config;
        this.projects = [];
        this.isInitialized = false;
    }

    /**
     * تهيئة مدير المشاريع.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('project:create', (options) => this.createProject(options));
        this.eventBus.on('project:load', (projectId) => this.loadProject(projectId));
        this.eventBus.on('project:delete', (projectId) => this.deleteProject(projectId));
        this.eventBus.on('project:list-request', () => this.listProjects());
        this.isInitialized = true;
        console.log("ProjectManager initialized.");
        this.listProjects(); // تحميل قائمة المشاريع عند البدء
    }

    /**
     * جلب قائمة المشاريع من قاعدة البيانات وإرسالها.
     */
    async listProjects() {
        this.projects = await this.storageManager.dbGetAll(this.config.storage.projectsStore);
        this.eventBus.emit('project:list-updated', this.projects);
    }

    /**
     * إنشاء مشروع جديد.
     * @param {object} [options] - خيارات المشروع.
     * @param {string} [options.title] - عنوان المشروع.
     * @param {string} [options.templateId] - معرف القالب (إن وجد).
     */
    async createProject(options = {}) {
        const title = options.title || 'مشروع جديد';
        let content = '';

        if (options.templateId) {
            // (مستقبلي) تحميل المحتوى من القالب
            // const templateContent = await this.loadTemplate(options.templateId);
            // content = templateContent;
        }

        const newProject = {
            id: `proj_${Date.now()}`,
            title: title,
            content: content,
            metadata: {
                author: '',
                version: '1.0.0',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await this.storageManager.dbSet(this.config.storage.projectsStore, newProject);
        this.eventBus.emit('notification:show', { message: `تم إنشاء مشروع "${title}".`, type: 'success' });
        this.loadProject(newProject.id); // تحميل المشروع الجديد تلقائيًا
        this.listProjects(); // تحديث قائمة المشاريع
    }

    /**
     * تحميل مشروع معين.
     * @param {string} projectId - معرف المشروع.
     */
    async loadProject(projectId) {
        const project = await this.storageManager.dbGet(this.config.storage.projectsStore, projectId);
        if (project) {
            this.storageManager.localSet('last_project_id', projectId);
            this.eventBus.emit('project:loaded', project);
            this.eventBus.emit('notification:show', { message: `تم تحميل مشروع "${project.title}".`, type: 'info' });
        } else {
            console.error(`المشروع بالمعرف ${projectId} غير موجود.`);
            this.eventBus.emit('notification:show', { message: 'فشل تحميل المشروع.', type: 'error' });
        }
    }

    /**
     * حذف مشروع.
     * @param {string} projectId - معرف المشروع.
     */
    async deleteProject(projectId) {
        // يجب إضافة تأكيد من المستخدم هنا في الواجهة
        await this.storageManager.dbDelete(this.config.storage.projectsStore, projectId);
        this.eventBus.emit('notification:show', { message: 'تم حذف المشروع بنجاح.', type: 'success' });
        this.listProjects(); // تحديث القائمة
        // يجب التحقق إذا كان المشروع المحذوف هو الحالي وتحميل مشروع آخر
    }

    // =========================================================================
    // Placeholder methods for advanced features
    // =========================================================================

    /**
     * (وهمي) يحفظ نسخة من المشروع الحالي.
     * @param {string} projectId - معرف المشروع.
     */
    saveVersion(projectId) {
        console.log(`Versioning for project ${projectId} - Not yet implemented.`);
        this.eventBus.emit('notification:show', { message: 'ميزة حفظ الإصدارات قيد التطوير.', type: 'info' });
        // المنطق: قراءة المشروع، إضافة طابع زمني/اسم إصدار، وحفظه في مخزن 'versions'
    }

    /**
     * (وهمي) يستورد مشروع من ملف .zip.
     */
    importProject() {
        console.log("Project import from .zip - Not yet implemented. Requires JSZip.");
        this.eventBus.emit('notification:show', { message: 'ميزة استيراد المشاريع قيد التطوير.', type: 'info' });
    }

    /**
     * (وهمي) يصدر مشروع كملف .zip.
     * @param {string} projectId - معرف المشروع.
     */
    exportProject(projectId) {
        console.log(`Project export to .zip for ${projectId} - Not yet implemented. Requires JSZip.`);
        this.eventBus.emit('notification:show', { message: 'ميزة تصدير المشاريع قيد التطوير.', type: 'info' });
    }

    /**
     * (وهمي) تحميل قالب من ملف JSON.
     * @param {string} templateId - معرف القالب.
     */
    async loadTemplate(templateId) {
        console.log(`Loading template ${templateId} - Not yet implemented.`);
        // المنطق: fetch('data/templates.json'), then find template by id.
        return `محتوى من قالب ${templateId}`;
    }
}

// إرفاقه بالكائن window لسهولة الوصول
window.ProjectManager = ProjectManager;