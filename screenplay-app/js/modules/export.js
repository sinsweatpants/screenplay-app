/**
 * export.js
 *
 * نظام التصدير الاحترافي.
 * مسؤول عن تصدير محتوى السيناريو إلى تنسيقات ملفات مختلفة.
 * يعتمد على مكتبات خارجية لبعض التنسيقات (مثل PDF).
 */

class ProfessionalExportSystem {
    /**
     * @param {EventBus} eventBus - ناقل الأحداث المركزي.
     * @param {object} config - كائن الإعدادات.
     */
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.isInitialized = false;
    }

    /**
     * تهيئة نظام التصدير.
     */
    init() {
        if (this.isInitialized) return;
        this.eventBus.on('export:request', this.handleExportRequest.bind(this));
        this.isInitialized = true;
        console.log("ProfessionalExportSystem initialized.");
    }

    /**
     * معالج طلبات التصدير.
     * @param {object} data - بيانات الطلب.
     * @param {string} data.format - التنسيق المطلوب (pdf, docx, html, txt, rtf).
     * @param {string} data.content - محتوى المحرر (HTML).
     * @param {string} data.title - عنوان المستند.
     */
    handleExportRequest({ format, content, title }) {
        console.log(`Export requested for format: ${format}`);
        switch (format.toLowerCase()) {
            case 'pdf':
                this.exportAsPDF(content, title);
                break;
            case 'docx':
                this.exportAsDOCX(content, title);
                break;
            case 'html':
                this.exportAsHTML(content, title);
                break;
            case 'txt':
                this.exportAsTXT(content, title);
                break;
            case 'rtf':
                this.exportAsRTF(content, title);
                break;
            default:
                console.error(`تنسيق التصدير غير معروف: ${format}`);
                this.eventBus.emit('notification:show', { message: 'تنسيق التصدير غير مدعوم.', type: 'error' });
        }
    }

    /**
     * تصدير كملف PDF.
     * ملاحظة: هذه الميزة تتطلب مكتبة مثل jsPDF أو html2pdf.js.
     * @param {string} content - محتوى HTML.
     * @param {string} title - عنوان الملف.
     */
    exportAsPDF(content, title) {
        this.eventBus.emit('notification:show', {
            message: 'جاري العمل على ميزة تصدير PDF. تتطلب مكتبة خارجية.',
            type: 'info'
        });
        console.warn("PDF export requires a library like html2pdf.js.");
        // مثال على الكود عند استخدام المكتبة
        /*
        const element = document.createElement('div');
        element.innerHTML = content;
        html2pdf(element, {
            margin:       1,
            filename:     `${title}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        });
        */
    }

    /**
     * تصدير كملف DOCX.
     * يستخدم حلاً بديلاً عبر إنشاء مستند HTML بتنسيق Word.
     * @param {string} content - محتوى HTML.
     * @param {string} title - عنوان الملف.
     */
    exportAsDOCX(content, title) {
        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${title}</title></head><body>`;
        const footer = "</body></html>";
        const sourceHTML = header + content + footer;

        const blob = new Blob([sourceHTML], { type: 'application/msword' });
        this.saveFile(blob, `${title}.docx`);
    }

    /**
     * تصدير كملف HTML مستقل.
     * @param {string} content - محتوى HTML.
     * @param {string} title - عنوان الملف.
     */
    exportAsHTML(content, title) {
        const fullHtml = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>${Utilities.sanitizeHTML(title)}</title>
                <style>
                    body { font-family: 'Courier New', Courier, monospace; line-height: 1.5; padding: 2cm; }
                    /* يمكن إضافة أنماط التنسيقات هنا */
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        this.saveFile(blob, `${title}.html`);
    }

    /**
     * تصدير كملف نصي عادي.
     * @param {string} content - محتوى HTML.
     * @param {string} title - عنوان الملف.
     */
    exportAsTXT(content, title) {
        const plainText = this.htmlToPlainText(content);
        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        this.saveFile(blob, `${title}.txt`);
    }

    /**
     * تصدير كملف RTF.
     * ملاحظة: هذه الميزة معقدة وتتطلب مكتبة متخصصة.
     * @param {string} content - محتوى HTML.
     * @param {string} title - عنوان الملف.
     */
    exportAsRTF(content, title) {
        this.eventBus.emit('notification:show', {
            message: 'ميزة تصدير RTF غير متاحة حاليًا.',
            type: 'info'
        });
        console.warn("RTF export is complex and requires a dedicated library.");
    }

    // ------------------- Helper Methods -------------------

    /**
     * يحول HTML إلى نص عادي مع الحفاظ على بعض التنسيق.
     * @param {string} html - سلسلة HTML.
     * @returns {string} نص عادي.
     */
    htmlToPlainText(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        // استبدال فواصل الأسطر بأسطر جديدة
        tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        // إضافة أسطر جديدة بعد عناصر الكتلة
        tempDiv.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6').forEach(block => {
            const currentText = block.textContent || '';
            block.textContent = '\n' + currentText + '\n';
        });
        let text = tempDiv.textContent || tempDiv.innerText || '';
        // تنظيف الأسطر الفارغة المتعددة
        return text.replace(/\n\s*\n/g, '\n\n').trim();
    }

    /**
     * يحفظ الملف في جهاز المستخدم.
     * محاكاة لمكتبة FileSaver.js.
     * @param {Blob} blob - البيانات الثنائية للملف.
     * @param {string} filename - اسم الملف.
     */
    saveFile(blob, filename) {
        try {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            this.eventBus.emit('notification:show', { message: `تم تصدير "${filename}" بنجاح.`, type: 'success' });
        } catch (error) {
            console.error("فشل حفظ الملف:", error);
            this.eventBus.emit('notification:show', { message: 'حدث خطأ أثناء تصدير الملف.', type: 'error' });
        }
    }
}

// إرفاقه بالكائن window لسهولة الوصول
window.ProfessionalExportSystem = ProfessionalExportSystem;