/**
 * ai-assistant.js
 *
 * مساعد الكتابة بالذكاء الاصطناعي.
 * يتكامل مع Claude API من Anthropic لتقديم ميزات ذكية
 * مثل توليد المحتوى، تحسين النصوص، والتحليل.
 */

import Utilities from './utilities.js';

export default class AIWritingAssistant {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات العام.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config.api; // الإعدادات الخاصة بـ API
        this.apiKey = this.config.geminiApiKey;
        this.isInitialized = false;

        // استخدام Debounce لمنع إرسال طلبات متكررة ومكلفة
        this.debouncedCallAI = Utilities.debounce(this._callAI.bind(this), this.config.aiRequestDebounce);
    }

    /**
     * تهيئة مساعد الذكاء الاصطناعي.
     */
    init() {
        if (this.isInitialized) return;

        if (!this.apiKey || this.apiKey.trim() === '') {
            console.warn("Gemini API key is missing. AI features will be disabled.");
            this.eventBus.emit('notification:show', {
                message: 'مفتاح Gemini API غير موجود. يرجى إضافته في الإعدادات.',
                type: 'error',
                duration: 0
            });
            return;
        }

        // الاستماع للأحداث المتعلقة بالذكاء الاصطناعي من الواجهة
        this.eventBus.on('ai:generate', (data) => this.handleGenerationRequest(data));
        this.eventBus.on('ai:improve', (data) => this.handleImprovementRequest(data));

        this.isInitialized = true;
        console.log("AIWritingAssistant initialized.");
    }

    /**
     * معالج عام لطلبات التوليد المختلفة.
     * @param {{type: string, prompt: string}} data - بيانات الطلب.
     */
    async handleGenerationRequest({ type, prompt }) {
        if (!this.apiKey) return;

        let fullPrompt;
        switch(type) {
            case 'dialogue':
                fullPrompt = `أنت كاتب سيناريو محترف. اكتب حوارًا قصيرًا ومقنعًا بناءً على هذا الموجه: "${prompt}"`;
                break;
            case 'scene':
                fullPrompt = `أنت كاتب سيناريو. اكتب وصفًا كاملاً لمشهد بناءً على هذا الموجه: "${prompt}"`;
                break;
            case 'character':
                fullPrompt = `أنت كاتب. أنشئ ملفًا شخصيًا موجزًا لشخصية بناءً على هذا الوصف: "${prompt}"`;
                break;
            default:
                this.eventBus.emit('notification:show', { message: 'نوع التوليد غير معروف.', type: 'error'});
                return;
        }

        try {
            this.eventBus.emit('ai:thinking'); // لإظهار مؤشر تحميل في الواجهة
            const result = await this.debouncedCallAI(fullPrompt);
            this.eventBus.emit('ai:suggestion-ready', { type, result });
        } catch (error) {
            this.eventBus.emit('ai:error', { error });
            this.eventBus.emit('notification:show', { message: `خطأ في الاتصال بالذكاء الاصطناعي: ${error.message}`, type: 'error'});
        }
    }

    /**
     * يعالج طلبات تحسين النصوص.
     * @param {{type: string, text: string}} data - بيانات الطلب.
     */
    async handleImprovementRequest({ type, text }) {
        if (!this.apiKey) return;

        const prompt = `أنت محرر نصوص سينمائية. قم بتحسين النص التالي من ناحية "${type}":\n\n${text}`;

        try {
            this.eventBus.emit('ai:thinking');
            const result = await this.debouncedCallAI(prompt);
            this.eventBus.emit('ai:suggestion-ready', { type: `improved-${type}`, result });
        } catch (error) {
            this.eventBus.emit('ai:error', { error });
            this.eventBus.emit('notification:show', { message: `خطأ في الاتصال بالذكاء الاصطناعي: ${error.message}`, type: 'error'});
        }
    }

    /**
     * الوظيفة الأساسية للاتصال بـ Anthropic Claude API.
     * @private
     * @param {string} prompt - موجه المستخدم.
     * @param {object} [options={}] - خيارات إضافية للطلب.
     * @returns {Promise<string>} المحتوى النصي من استجابة الذكاء الاصطناعي.
     */
    async _callAI(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error("مفتاح API غير مهيأ.");
        }

        this.eventBus.emit('notification:show', { message: 'جاري التواصل مع المساعد الذكي...', type: 'info', duration: 2500 });

        const response = await fetch(`${this.config.geminiApiUrl}/${this.config.geminiModel}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    maxOutputTokens: 65530,
                    temperature: options.temperature || 0.7
                },
                tools: [
                    {
                        "url_context": {}
                    },
                    {
                        "googleSearch": {}
                    }
                ],
                "thinking_config": {
                    "thinking_budget": 15785
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("AI API Error:", errorBody);
            throw new Error(`خطأ من API: ${response.status} - ${errorBody.error?.message || 'خطأ غير معروف'}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("بنية الاستجابة من API غير صالحة.");
        }
    }
}

// تم تصدير الكلاس كـ ES module