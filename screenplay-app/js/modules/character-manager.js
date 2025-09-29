/**
 * character-manager.js
 *
 * نظام إدارة الشخصيات.
 * مسؤول عن إنشاء وتتبع وإدارة ملفات تعريف الشخصيات،
 * وعلاقاتها، وتطورها عبر القصة.
 */

class CharacterManager {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {StorageManager} storageManager - مدير التخزين.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, storageManager, config) {
        this.eventBus = eventBus;
        this.storageManager = storageManager;
        this.config = config;
        this.characters = new Map(); // استخدام Map لسهولة الوصول (key: characterName)
        this.currentProjectId = null;
        this.isInitialized = false;
    }

    /**
     * تهيئة مدير الشخصيات.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('project:loaded', (project) => this.loadCharactersForProject(project.id));
        this.eventBus.on('analytics:updated', (analyticsData) => this.discoverCharacters(analyticsData));
        this.eventBus.on('character:save', (characterData) => this.saveCharacter(characterData));
        this.isInitialized = true;
        console.log("CharacterManager initialized.");
    }

    /**
     * تحميل بيانات الشخصيات لمشروع معين.
     * @param {string} projectId - معرف المشروع.
     */
    async loadCharactersForProject(projectId) {
        this.currentProjectId = projectId;
        const storedCharacters = await this.storageManager.dbGet('characters', projectId);
        if (storedCharacters) {
            this.characters = new Map(Object.entries(storedCharacters));
        } else {
            this.characters.clear();
        }
        this.eventBus.emit('character:listUpdated', Array.from(this.characters.values()));
    }

    /**
     * يكتشف الشخصيات من البيانات التحليلية ويضيفها إذا لم تكن موجودة.
     * @param {object} analyticsData - البيانات من AnalyticsEngine.
     */
    discoverCharacters(analyticsData) {
        if (!this.currentProjectId) return;

        const characterNames = Object.keys(analyticsData.characterStats);
        let hasChanged = false;

        characterNames.forEach(name => {
            if (!this.characters.has(name)) {
                const newCharacter = {
                    id: Utilities.generateUUID(),
                    name: name,
                    role: 'غير محدد',
                    description: '',
                    // ... other fields
                };
                this.characters.set(name, newCharacter);
                hasChanged = true;
            }
        });

        if (hasChanged) {
            this.persistCharacters();
            this.eventBus.emit('character:listUpdated', Array.from(this.characters.values()));
        }
    }

    /**
     * يحفظ أو يحدث بيانات شخصية.
     * @param {object} characterData - بيانات الشخصية المحدثة.
     */
    async saveCharacter(characterData) {
        if (!characterData || !characterData.name) {
            console.error("بيانات الشخصية غير صالحة للحفظ.");
            return;
        }
        this.characters.set(characterData.name, characterData);
        await this.persistCharacters();
        this.eventBus.emit('notification:show', { message: `تم حفظ بيانات "${characterData.name}".`, type: 'success' });
        this.eventBus.emit('character:listUpdated', Array.from(this.characters.values()));
    }

    /**
     * يحفظ الحالة الحالية لجميع الشخصيات في IndexedDB.
     */
    persistCharacters() {
        if (!this.currentProjectId) return;
        // ملاحظة: IndexedDB لا يخزن Maps مباشرة، لذا نحولها إلى كائن.
        // ونحتاج إلى مخزن 'characters' في IndexedDB.
        // هذا يتطلب تحديث onupgradeneeded في StorageManager.
        console.warn("Character persistence requires a 'characters' object store in IndexedDB.");
        // this.storageManager.dbSet('characters', { id: this.currentProjectId, data: Object.fromEntries(this.characters) });
    }

    // =========================================================================
    // Placeholder methods for advanced analysis
    // =========================================================================

    /**
     * (وهمي) يحلل علاقات الشخصيات.
     */
    analyzeRelationships() {
        console.log("Character relationship analysis - Not yet implemented.");
        this.eventBus.emit('notification:show', { message: 'ميزة تحليل العلاقات قيد التطوير.', type: 'info' });
        // يتطلب تحليل المشاهد المشتركة بين الشخصيات.
    }

    /**
     * (وهمي) يتتبع قوس تطور الشخصية.
     */
    trackCharacterArcs() {
        console.log("Character arc tracking - Not yet implemented.");
        this.eventBus.emit('notification:show', { message: 'ميزة تتبع تطور الشخصية قيد التطوير.', type: 'info' });
        // يتطلب تحليل المشاعر أو الأفعال عبر الزمن.
    }

    /**
     * (وهمي) يحلل أنماط الحوار.
     */
    analyzeDialoguePatterns() {
        console.log("Dialogue pattern analysis - Not yet implemented.");
        this.eventBus.emit('notification:show', { message: 'ميزة تحليل أنماط الحوار قيد التطوير.', type: 'info' });
        // يتطلب تحليل لغوي للحوار.
    }
}

// إرفاقه بالكائن window لسهولة الوصول
window.CharacterManager = CharacterManager;