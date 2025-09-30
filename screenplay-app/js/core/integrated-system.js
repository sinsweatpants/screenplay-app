/**
 * integrated-system.js
 *
 * المنسق الرئيسي للتطبيق (The Central Coordinator).
 * هذا الكلاس هو العقل المدبر الذي يربط جميع الأنظمة الفرعية معًا.
 * يقوم بتهيئة الوحدات، وإدارة الحالة العامة للتطبيق، وتنسيق الاتصالات
 * بينها عبر EventBus.
 */

class IntegratedScreenplaySystem {
    /**
     * @param {object} config - كائن الإعدادات العام.
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {StorageManager} storageManager - مدير التخزين.
     */
    constructor(config, eventBus, storageManager) {
        this.config = config;
        this.eventBus = eventBus;
        this.storageManager = storageManager;

        /**
         * الحالة العامة للتطبيق.
         * @type {{
         *   currentProject: object | null,
         *   editorContent: string,
         *   isDirty: boolean, // هل توجد تغييرات غير محفوظة؟
         *   userSettings: object
         * }}
         */
        this.state = {
            currentProject: null,
            editorContent: '',
            isDirty: false,
            userSettings: {},
        };

        // سيتم تهيئة هذه الأنظمة لاحقًا
        this.mainApp = null;
        this.utilityFunctions = null;
        this.exportSystem = null;
        this.analyticsEngine = null;
        this.visualPlanningSystem = null;
        this.characterManager = null;
        this.projectManager = null;
        this.aiAssistant = null;
        this.searchValidator = null;
        this.collaborationSystem = null;

        console.log("IntegratedScreenplaySystem created.");
    }

    /**
     * تهيئة المنسق وجميع الأنظمة الفرعية.
     */
    async init() {
        console.log("Initializing IntegratedScreenplaySystem...");

        // تهيئة مدير التخزين
        await this.storageManager.initDB();

        // تحميل الإعدادات والمشروع الأخير
        await this.loadInitialData();

        // تهيئة جميع الأنظمة الفرعية (سيتم إنشاؤها في الخطوات التالية)
        // this.mainApp = new MainApplication(this.config, this.eventBus, ...);
        // this.exportSystem = new ProfessionalExportSystem(...);
        // ... وهكذا مع بقية الأنظمة

        // ربط مستمعي الأحداث
        this.setupEventListeners();

        this.eventBus.emit('system:initialized', { settings: this.state.userSettings });
        console.log("IntegratedScreenplaySystem initialized successfully.");
    }

    /**
     * تحميل البيانات الأولية للتطبيق (الإعدادات والمشروع الأخير).
     */
    async loadInitialData() {
        // تحميل إعدادات المستخدم
        const settings = await this.storageManager.dbGet(this.config.storage.settingsStore, 'user_settings');
        if (settings) {
            this.state.userSettings = settings;
        } else {
            // استخدام الإعدادات الافتراضية إذا لم توجد إعدادات محفوظة
            this.state.userSettings = {
                theme: this.config.defaultTheme,
                language: this.config.defaultLanguage,
                editorFont: this.config.editor.defaultFont,
                // ... other default settings
            };
        }

        // تحميل المشروع الأخير (كمثال)
        const lastProjectId = this.storageManager.localGet('last_project_id');
        if (lastProjectId) {
            const project = await this.storageManager.dbGet(this.config.storage.projectsStore, lastProjectId);
            if (project) {
                this.state.currentProject = project;
                this.state.editorContent = project.content;
            }
        }

        // إذا لم يكن هناك مشروع، ابدأ بمشروع جديد فارغ
        if (!this.state.currentProject) {
            this.createNewProject();
        }
    }

    /**
     * إنشاء مشروع جديد.
     */
    createNewProject() {
        this.state.currentProject = {
            id: `proj_${Date.now()}`,
            title: 'سيناريو بدون عنوان',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.state.editorContent = '';
        this.state.isDirty = false;
        this.eventBus.emit('project:loaded', this.state.currentProject);
    }

    /**
     * ربط مستمعي الأحداث المركزيين.
     */
    setupEventListeners() {
        this.eventBus.on('editor:contentChanged', (newContent) => {
            this.state.editorContent = newContent;
            this.state.isDirty = true;
            this.state.currentProject.updatedAt = new Date();
            this.eventBus.emit('document:dirty'); // إعلام الواجهة بوجود تغييرات
        });

        this.eventBus.on('document:save', async () => {
            if (!this.state.currentProject) return;

            this.state.currentProject.content = this.state.editorContent;
            await this.storageManager.dbSet(this.config.storage.projectsStore, this.state.currentProject);

            this.state.isDirty = false;
            this.eventBus.emit('document:saved', { projectId: this.state.currentProject.id });
            this.eventBus.emit('notification:show', { message: 'تم الحفظ بنجاح!', type: 'success' });
        });

        this.eventBus.on('settings:changed', (newSettings) => {
            this.state.userSettings = { ...this.state.userSettings, ...newSettings };
            this.storageManager.dbSet(this.config.storage.settingsStore, 'user_settings', this.state.userSettings);
            this.eventBus.emit('notification:show', { message: 'تم حفظ الإعدادات.', type: 'info' });
        });

        // ... مستمعون آخرون لأحداث التصدير، التحليل، إلخ.
    }
}

// نفترض أن المكونات الأخرى تم تحميلها
window.IntegratedScreenplaySystem = IntegratedScreenplaySystem;