# 📝 كاتب السيناريو - Screenplay Writer

تطبيق احترافي لكتابة السيناريوهات السينمائية والدرامية مع أدوات ذكية ومساعد AI

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+ و npm 9+

### التثبيت
```bash
# 1. Clone المشروع
git clone https://github.com/username/screenplay-app.git
cd screenplay-app

# 2. تثبيت المكتبات
npm install

# 3. إنشاء .env file
cp .env.example .env
# ثم عدّل .env وأضف API key إذا لزم

# 4. تشغيل التطبيق
npm run dev
```

### Build للإنتاج
```bash
npm run build
# الملفات في مجلد dist/
```

### Scripts المتاحة
- `npm run dev` - تشغيل Development server
- `npm run build` - Build للإنتاج
- `npm run preview` - معاينة Build
- `npm run lint` - فحص الكود
- `npm run format` - تنسيق الكود

## 🎯 الميزات الرئيسية

### 🎬 محرر احترافي
- 9 تنسيقات سيناريو قياسية
- اختصارات لوحة مفاتيح سريعة
- حفظ تلقائي كل 30 ثانية
- نظام تراجع/إعادة متقدم (50 مستوى)

### 📊 تحليلات ذكية
- إحصائيات شاملة (كلمات، صفحات، شخصيات)
- تحليل توزيع المشاهد
- تتبع ظهور الشخصيات
- تقييم جاهزية النص

### 🤖 مساعد ذكاء اصطناعي
- تكامل مع Claude API
- توليد حوارات ومشاهد
- تحسين النصوص
- اقتراحات إبداعية

### 📁 إدارة المشاريع
- مشاريع متعددة
- قوالب جاهزة
- استيراد/تصدير
- نسخ احتياطية

## 📦 المكتبات المستخدمة
- **Vite** - Build tool حديث مع HMR
- **Chart.js** - الرسوم البيانية
- **jsPDF** - تصدير PDF
- **Vanilla JavaScript** - بدون frameworks

## 🛠️ التطوير

### البنية الحديثة
```
js/
├── main.js               # نقطة الدخول
├── core/                 # الأنظمة الأساسية
│   ├── config.js         # الإعدادات مع env vars
│   ├── app.js            # المحرر الرئيسي
│   └── integrated-system.js # المنسق العام
├── libraries/            # المكتبات المساعدة
│   ├── event-bus.js      # نظام الأحداث
│   ├── storage-manager.js # إدارة التخزين
│   ├── keyboard-manager.js # اختصارات المفاتيح
│   └── notification-manager.js # الإشعارات
└── modules/              # الوحدات الوظيفية
    ├── analytics.js      # التحليلات
    ├── export.js         # التصدير
    ├── ai-assistant.js   # الذكاء الاصطناعي
    ├── character-manager.js # إدارة الشخصيات
    ├── planning.js       # التخطيط البصري
    ├── project-manager.js # إدارة المشاريع
    ├── search-validator.js # البحث والتحقق
    ├── collaboration.js  # التعاون
    ├── functions.js      # وظائف متقدمة
    └── utilities.js      # أدوات مساعدة
```

### الميزات الحديثة
- ✅ **ES Modules** - import/export بدلاً من global scope
- ✅ **Vite HMR** - Hot Module Replacement للتطوير السريع
- ✅ **Environment Variables** - إعدادات آمنة مع .env
- ✅ **Code Splitting** - تحسين الأداء مع chunks
- ✅ **Modern Build** - Terser minification و sourcemaps
- ✅ **Path Aliases** - @core, @modules, @libraries للاستيراد السهل

### تشغيل في Development mode
```bash
npm run dev
# الآن يمكنك التعديل على الملفات وسترى التغييرات مباشرة
# Hot Module Replacement يعمل تلقائياً
```

### إضافة ميزة جديدة
1. أنشئ ملف جديد في `js/modules/`
2. استخدم `export default class YourClass`
3. استورد في `js/main.js`
4. اتبع نمط EventBus للتواصل

### اختصارات المفاتيح
- `Ctrl+0`: بسملة
- `Ctrl+1-3`: عناوين المشاهد
- `Ctrl+4`: شخصية
- `Ctrl+5`: حوار
- `Ctrl+6`: بين قوسين
- `Ctrl+7`: فعل/وصف
- `Ctrl+8`: انتقال
- `Ctrl+S`: حفظ
- `Ctrl+Z/Y`: تراجع/إعادة

## ⚙️ الإعدادات

### متغيرات البيئة (.env)
```bash
# Claude API Configuration
VITE_CLAUDE_API_KEY=your_api_key_here
VITE_CLAUDE_MODEL=claude-3-sonnet-20240229

# Application Settings
VITE_APP_NAME=Screenplay Writer
VITE_APP_VERSION=1.0.0
```

### تخصيص الإعدادات
- عدل `js/core/config.js` للإعدادات الأساسية
- استخدم CSS variables في `css/main.css` للألوان
- اضبط Vite في `vite.config.js`

## 🔧 المشاكل الشائعة

### Build يفشل
```bash
# تأكد من تثبيت المكتبات
npm install

# امسح cache
rm -rf node_modules/.vite
npm run build
```

### HMR لا يعمل
- تأكد من تشغيل `npm run dev`
- تحقق من Console للأخطاء
- أعد تشغيل dev server

### الذكاء الاصطناعي لا يعمل
- تأكد من وجود `VITE_CLAUDE_API_KEY` في .env
- تحقق من صحة المفتاح
- تأكد من الاتصال بالإنترنت

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

### معايير الكود
- استخدم ES6+ modules
- اتبع JSDoc للتوثيق
- استخدم Prettier للتنسيق
- اختبر الكود قبل الـ commit

## 📄 الترخيص

MIT License - انظر [LICENSE](LICENSE) للتفاصيل

## 🙏 الشكر والتقدير

- [Anthropic](https://www.anthropic.com/) لواجهة Claude API
- [Vite](https://vitejs.dev/) للبناء السريع
- [Chart.js](https://www.chartjs.org/) للرسوم البيانية
- المجتمع العربي للبرمجة والإبداع

---

**صنع بـ ❤️ للكتاب والمبدعين العرب**

**الآن مع Vite وES Modules! 🚀**