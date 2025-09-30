/**
 * analytics.js
 *
 * محرك التحليلات والإحصائيات.
 * يقوم بتحليل محتوى السيناريو لتقديم رؤى حول البنية، الشخصيات، والإيقاع.
 */

import Utilities from './utilities.js';

export default class AnalyticsEngine {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.isInitialized = false;
        // استخدام debounce لمنع التحليل المتكرر والمكلف
        this.debouncedAnalyze = Utilities.debounce(this.analyze.bind(this), 2000);
    }

    /**
     * تهيئة محرك التحليلات.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('editor:contentChanged', (content) => this.debouncedAnalyze(content));
        this.eventBus.on('analytics:request', (content) => this.analyze(content));
        this.isInitialized = true;
        console.log("AnalyticsEngine initialized.");
    }

    /**
     * الوظيفة الرئيسية لتحليل محتوى السيناريو.
     * @param {string} htmlContent - محتوى المحرر بصيغة HTML.
     */
    analyze(htmlContent) {
        if (!htmlContent) {
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        const lines = Array.from(tempDiv.children);

        const stats = {
            wordCount: this.calculateWordCount(tempDiv.textContent),
            charCount: tempDiv.textContent.length,
            pageCount: this.estimatePageCount(lines),
            sceneCount: 0,
            characterStats: {},
            sceneTimeStats: { day: 0, night: 0, other: 0 },
            sceneLocationStats: { int: 0, ext: 0, other: 0 },
            readiness: this.assessReadiness(lines) // تقييم مبدئي
        };

        let currentCharacter = null;
        lines.forEach(line => {
            const format = line.className;
            const text = line.textContent.trim();

            if (format.includes(this.config.formattingKeys.HEADING_1)) {
                stats.sceneCount++;
                this.analyzeSceneHeading(text, stats);
            }

            if (format.includes(this.config.formattingKeys.CHARACTER)) {
                currentCharacter = text.toUpperCase().replace(/\s*\(.*\)/, ''); // إزالة (O.S) أو (V.O)
                if (!stats.characterStats[currentCharacter]) {
                    stats.characterStats[currentCharacter] = { appearances: 0, dialogueLines: 0, words: 0 };
                }
                stats.characterStats[currentCharacter].appearances++;
            }

            if (format.includes(this.config.formattingKeys.DIALOGUE) && currentCharacter) {
                stats.characterStats[currentCharacter].dialogueLines++;
                stats.characterStats[currentCharacter].words += this.calculateWordCount(text);
            }
        });

        // إرسال البيانات المحدثة
        this.eventBus.emit('analytics:updated', stats);
    }

    /**
     * يحسب عدد الكلمات في نص.
     * @param {string} text - النص.
     * @returns {number} عدد الكلمات.
     */
    calculateWordCount(text) {
        return text.trim().split(/\s+/).filter(Boolean).length;
    }

    /**
     * يقدر عدد الصفحات بناءً على عدد الأسطر.
     * تقدير بسيط: 55 سطرًا في الصفحة.
     * @param {Array<Element>} lines - مصفوفة من عناصر الأسطر.
     * @returns {number} عدد الصفحات المقدر.
     */
    estimatePageCount(lines) {
        // يمكن تحسين هذا التقدير لاحقًا
        return Math.max(1, Math.ceil(lines.length / 55));
    }

    /**
     * يحلل عنوان المشهد (Scene Heading) لاستخراج معلومات الوقت والمكان.
     * @param {string} headingText - نص عنوان المشهد.
     * @param {object} stats - كائن الإحصائيات لتحديثه.
     */
    analyzeSceneHeading(headingText, stats) {
        const text = headingText.toUpperCase();
        if (text.includes('INT.')) stats.sceneLocationStats.int++;
        else if (text.includes('EXT.')) stats.sceneLocationStats.ext++;
        else stats.sceneLocationStats.other++;

        if (text.includes('DAY')) stats.sceneTimeStats.day++;
        else if (text.includes('NIGHT')) stats.sceneTimeStats.night++;
        else stats.sceneTimeStats.other++;
    }

    /**
     * (مستقبلي) يقيم جاهزية النص للتقديم.
     * @param {Array<Element>} lines - أسطر المحتوى.
     * @returns {{score: number, checklist: Array<{item: string, status: boolean}>}}
     */
    assessReadiness(lines) {
        // هذا مجرد مثال مبدئي جدًا
        const checklist = [
            { item: "يحتوي على 10 مشاهد على الأقل", status: lines.filter(l => l.className.includes('heading1')).length >= 10 },
            { item: "يحتوي على شخصيتين على الأقل", status: Object.keys(this.analyze(lines.map(l => l.outerHTML).join('')).characterStats || {}).length >= 2 }
        ];
        const score = (checklist.filter(item => item.status).length / checklist.length) * 100;
        return { score: Math.round(score), checklist };
    }
}

// تم تصدير الكلاس كـ ES module