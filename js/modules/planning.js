/**
 * planning.js
 *
 * نظام التخطيط البصري.
 * يحول البيانات التحليلية إلى رسوم بيانية ومخططات مرئية.
 * يتطلب مكتبة رسوم بيانية مثل Chart.js.
 */

export default class VisualPlanningSystem {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.analyticsData = null;
        this.isInitialized = false;
    }

    /**
     * تهيئة نظام التخطيط البصري.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('analytics:updated', this.updateAnalyticsData.bind(this));
        this.eventBus.on('planning:request-chart', this.handleChartRequest.bind(this));
        this.isInitialized = true;
        console.log("VisualPlanningSystem initialized.");
    }

    /**
     * تحديث البيانات التحليلية عند توفرها.
     * @param {object} data - البيانات من AnalyticsEngine.
     */
    updateAnalyticsData(data) {
        this.analyticsData = data;
        // يمكننا إرسال تحديث تلقائي للمخططات المفتوحة حاليًا
        // this.eventBus.emit('planning:data-updated');
    }

    /**
     * معالج طلبات إنشاء المخططات.
     * @param {{chartType: string, targetCanvasId: string}} data - بيانات الطلب.
     */
    handleChartRequest({ chartType, targetCanvasId }) {
        if (!this.analyticsData) {
            this.eventBus.emit('notification:show', { message: 'البيانات التحليلية غير متوفرة بعد.', type: 'info' });
            return;
        }

        let chartConfig;
        switch (chartType) {
            case 'sceneTime':
                chartConfig = this.generateSceneTimeChart();
                break;
            case 'pacing':
                chartConfig = this.generatePacingChart();
                break;
            case 'characterNetwork':
                chartConfig = this.generateCharacterNetworkChart();
                break;
            default:
                console.error(`نوع المخطط غير معروف: ${chartType}`);
                return;
        }

        this.eventBus.emit('planning:chart-ready', { chartConfig, targetCanvasId });
    }

    /**
     * ينشئ إعدادات مخطط دائري لتوقيت المشاهد (نهار/ليل).
     * @returns {object|null} كائن إعدادات لمكتبة Chart.js.
     */
    generateSceneTimeChart() {
        if (!this.analyticsData) return null;

        const { day, night, other } = this.analyticsData.sceneTimeStats;
        return {
            type: 'pie',
            data: {
                labels: ['نهاري', 'ليلي', 'آخر'],
                datasets: [{
                    label: 'توقيت المشاهد',
                    data: [day, night, other],
                    backgroundColor: [
                        'rgba(251, 191, 36, 0.7)', // Amber
                        'rgba(59, 130, 246, 0.7)', // Blue
                        'rgba(156, 163, 175, 0.7)' // Gray
                    ],
                    borderColor: 'var(--bg-primary)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'توزيع المشاهد (نهاري/ليلي)',
                        color: 'var(--text-primary)'
                    }
                }
            }
        };
    }

    /**
     * (وهمي) ينشئ إعدادات مخطط خطي لإيقاع القصة.
     * @returns {object|null} كائن إعدادات لمكتبة Chart.js.
     */
    generatePacingChart() {
        this.eventBus.emit('notification:show', { message: 'ميزة تحليل الإيقاع قيد التطوير.', type: 'info' });
        console.log("Pacing chart generation is a placeholder.");
        // يتطلب تحليلاً أعمق (مثل طول المشهد بالكلمات أو الأسطر)
        return null;
    }

    /**
     * (وهمي) ينشئ إعدادات مخطط شبكي لعلاقات الشخصيات.
     * @returns {object|null}
     */
    generateCharacterNetworkChart() {
        this.eventBus.emit('notification:show', { message: 'ميزة شبكة علاقات الشخصيات قيد التطوير.', type: 'info' });
        console.log("Character network chart requires a more complex graph library/plugin.");
        // يتطلب تحليلاً للتفاعلات بين الشخصيات في كل مشهد.
        return null;
    }

    // --- ميزات متقدمة (تتطلب AI أو منطق معقد) ---

    generateEmotionalCurve() {
        console.warn("Emotional Curve generation requires AI sentiment analysis.");
    }

    generateThemeCloud() {
        console.warn("Theme Cloud generation requires AI topic modeling.");
    }
}

// تم تصدير الكلاس كـ ES module