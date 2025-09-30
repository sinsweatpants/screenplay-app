/**
 * نسخة مبسطة لاختبار التطبيق
 */

// Import CSS
import '../css/main.css';

console.log('🚀 تطبيق كاتب السيناريو يعمل!');

// إخفاء شاشة التحميل وإظهار التطبيق
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const appWrapper = document.getElementById('app-wrapper');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    if (appWrapper) {
        appWrapper.style.display = 'grid';
    }
    
    console.log('✅ تم تحميل التطبيق بنجاح');
});

// إضافة بعض الوظائف الأساسية
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    if (editor) {
        editor.innerHTML = '<p class="format-action">مرحباً بك في كاتب السيناريو! ابدأ الكتابة هنا...</p>';
    }
    
    // تهيئة اختبار الوظائف المنقولة
    import('./sidebar-functions-test.js').then(module => {
        const SidebarFunctionsTest = module.default;
        const test = new SidebarFunctionsTest();
        test.init();
        
        // إظهار تقرير مفصل في وحدة التحكم
        setTimeout(() => {
            test.generateReport();
        }, 2000);
    }).catch(err => {
        console.error('خطأ في تحميل اختبار الوظائف:', err);
    });
});