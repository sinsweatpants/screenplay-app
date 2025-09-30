/**
 * storage-manager.js
 *
 * مدير التخزين.
 * يوفر واجهة موحدة للتعامل مع localStorage و IndexedDB.
 * - localStorage: للإعدادات البسيطة والبيانات غير الحساسة.
 * - IndexedDB: للبيانات الكبيرة والمعقدة مثل المشاريع والمستندات.
 */

export default class StorageManager {
    constructor(config = {}) {
        this.config = config.storage || {
            localPrefix: 'screenplay_app_',
            dbName: 'ScreenplayAppDB',
            dbVersion: 1,
            projectsStore: 'projects',
            settingsStore: 'user_settings'
        };
        this.db = null;
        this.localPrefix = this.config.localPrefix;
    }

    // =========================================================================
    // LocalStorage Methods
    // =========================================================================

    /**
     * حفظ قيمة في localStorage مع بادئة التطبيق.
     * @param {string} key - المفتاح.
     * @param {any} value - القيمة (سيتم تحويلها إلى JSON).
     */
    localSet(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(`${this.localPrefix}${key}`, serializedValue);
        } catch (e) {
            console.error(`خطأ أثناء الحفظ في localStorage (المفتاح: ${key}):`, e);
            // EventBus.emit('notification:show', { message: 'فشل حفظ الإعدادات، قد تكون مساحة التخزين ممتلئة.', type: 'error' });
        }
    }

    /**
     * جلب قيمة من localStorage.
     * @param {string} key - المفتاح.
     * @param {any} [defaultValue=null] - القيمة الافتراضية في حال عدم وجود المفتاح.
     * @returns {any} القيمة المحفوظة أو القيمة الافتراضية.
     */
    localGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`${this.localPrefix}${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`خطأ أثناء القراءة من localStorage (المفتاح: ${key}):`, e);
            return defaultValue;
        }
    }

    /**
     * حذف قيمة من localStorage.
     * @param {string} key - المفتاح.
     */
    localRemove(key) {
        localStorage.removeItem(`${this.localPrefix}${key}`);
    }


    // =========================================================================
    // IndexedDB Methods
    // =========================================================================

    /**
     * تهيئة والاتصال بقاعدة بيانات IndexedDB.
     * @returns {Promise<IDBDatabase>}
     */
    async initDB() {
        if (this.db) {
            return Promise.resolve(this.db);
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.dbVersion);

            request.onerror = (event) => {
                console.error('خطأ في IndexedDB:', event.target.error);
                reject('فشل فتح قاعدة البيانات.');
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.config.projectsStore)) {
                    db.createObjectStore(this.config.projectsStore, { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains(this.config.settingsStore)) {
                    db.createObjectStore(this.config.settingsStore, { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * تنفيذ عملية (transaction) في IndexedDB.
     * @private
     * @param {string} storeName - اسم المخزن.
     * @param {IDBTransactionMode} mode - نوع العملية ('readonly' or 'readwrite').
     * @param {(store: IDBObjectStore) => IDBRequest} operation - العملية المطلوب تنفيذها.
     * @returns {Promise<any>}
     */
    _performTransaction(storeName, mode, operation) {
        return new Promise(async (resolve, reject) => {
            if (!this.db) {
                await this.initDB();
            }
            const transaction = this.db.transaction(storeName, mode);
            const store = transaction.objectStore(storeName);
            const request = operation(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error(`خطأ في عملية '${mode}' على المخزن '${storeName}':`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    /**
     * حفظ (إضافة أو تحديث) سجل في IndexedDB.
     * @param {string} storeName - اسم المخزن.
     * @param {object} value - الكائن المراد حفظه.
     * @returns {Promise<any>}
     */
    dbSet(storeName, value) {
        return this._performTransaction(storeName, 'readwrite', store => store.put(value));
    }

    /**
     * جلب سجل من IndexedDB بواسطة المفتاح.
     * @param {string} storeName - اسم المخزن.
     * @param {any} key - المفتاح.
     * @returns {Promise<any>}
     */
    dbGet(storeName, key) {
        return this._performTransaction(storeName, 'readonly', store => store.get(key));
    }

    /**
     * جلب جميع السجلات من مخزن في IndexedDB.
     * @param {string} storeName - اسم المخزن.
     * @returns {Promise<Array<any>>}
     */
    dbGetAll(storeName) {
        return this._performTransaction(storeName, 'readonly', store => store.getAll());
    }

    /**
     * حذف سجل من IndexedDB بواسطة المفتاح.
     * @param {string} storeName - اسم المخزن.
     * @param {any} key - المفتاح.
     * @returns {Promise<void>}
     */
    dbDelete(storeName, key) {
        return this._performTransaction(storeName, 'readwrite', store => store.delete(key));
    }

    /**
     * مسح جميع السجلات من مخزن.
     * @param {string} storeName - اسم المخزن.
     * @returns {Promise<void>}
     */
    dbClear(storeName) {
        return this._performTransaction(storeName, 'readwrite', store => store.clear());
    }
}

// تم تصدير الكلاس كـ ES module