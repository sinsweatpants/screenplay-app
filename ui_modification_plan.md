# UI Modification Plan: Implementing Left and Right Sidebars

This document outlines the plan to redesign the application's UI to include dedicated left and right sidebars.

## 1. Proposed HTML Structure for `index.html`

The following is the complete proposed HTML structure for `index.html`. This structure introduces a main container (`main-container`) that uses Flexbox to manage the three-column layout. The existing toolbar content will be moved into the new sidebars.

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تطبيق كتابة السيناريو | محرر احترافي</title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="تطبيق ويب متكامل واحترافي لكتابة السيناريوهات السينمائية والدرامية مع أدوات تحليلية ومساعد ذكاء اصطناعي.">
    <meta name="keywords" content="كتابة سيناريو, محرر نصوص, سيناريو, أفلام, مسلسلات, إبداع, كتابة إبداعية, ذكاء اصطناعي">
    <meta name="author" content="Jules - AI Software Engineer">

    <!-- Open Graph Meta Tags (for social sharing) -->
    <meta property="og:title" content="تطبيق كتابة السيناريو الاحترافي">
    <meta property="og:description" content="حوّل أفكارك إلى سيناريوهات جاهزة للإنتاج مع محررنا الذكي والمتكامل.">
    <meta property="og:image" content="assets/images/og-image.png">
    <meta property="og:url" content="https://your-app-url.com">
    <meta property="og:type" content="website">

    <!-- PWA (Progressive Web App) Manifest -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#111827">

    <!-- Favicon and App Icons -->
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">

    <!-- Link to the new sidebar CSS file -->
    <link rel="stylesheet" href="css/sidebars.css">
    
    <!-- Single entry point for Vite -->
    <script type="module" src="/js/main-simple.js"></script>

</head>
<body class="light-mode">
    <!-- Loading Screen -->
    <div id="loading-screen" class="loading-screen">
        <div class="spinner"></div>
        <p>جاري تحميل التطبيق...</p>
    </div>

    <!-- Main Application Wrapper -->
    <div id="app-wrapper" class="app-wrapper" style="display: none;">

        <!-- Top Bar -->
        <header id="top-bar" class="top-bar">
            <div class="top-bar-left">
                <div class="logo">📝</div>
                <h1 id="document-title" class="document-title" contenteditable="true">سيناريو بدون عنوان</h1>
            </div>
            <div class="top-bar-center">
                <span id="save-status" class="save-status" aria-live="polite">تم حفظ جميع التغييرات</span>
            </div>
            <div class="top-bar-right">
                <button id="theme-toggle" class="btn btn-icon" aria-label="تبديل الوضع">🌙</button>
            </div>
        </header>
        
        <!-- Main Content Area with Sidebars -->
        <div class="main-container">
            <!-- Left Sidebar -->
            <aside id="left-sidebar" class="sidebar left-sidebar">
                <ul class="feature-list">
                    <li><div class="icon-placeholder"></div> النظام المتكامل</li>
                    <li><div class="icon-placeholder"></div> الوظائف المساعدة</li>
                    <li><div class="icon-placeholder"></div> تصدير احترافي</li>
                    <li><div class="icon-placeholder"></div> وظائف متقدمة</li>
                    <li><div class="icon-placeholder"></div> محرك التحليلات</li>
                    <li><div class="icon-placeholder"></div> التخطيط البصري</li>
                </ul>
            </aside>

            <!-- Editor Area -->
            <main id="main-content" class="main-content">
                <div id="editor-container" class="editor-container">
                    <div id="horizontal-ruler" class="ruler horizontal"></div>
                    <div id="vertical-ruler" class="ruler vertical"></div>
                    <div id="editor" class="editor" contenteditable="true" spellcheck="false" aria-label="محرر السيناريو"></div>
                </div>
            </main>

            <!-- Right Sidebar -->
            <aside id="right-sidebar" class="sidebar right-sidebar">
                <ul class="feature-list">
                    <li><div class="icon-placeholder"></div> إدارة الشخصيات</li>
                    <li><div class="icon-placeholder"></div> مدير المشاريع</li>
                    <li><div class="icon-placeholder"></div> مساعد الذكاء الاصطناعي</li>
                    <li><div class="icon-placeholder"></div> بحث وتحقق</li>
                    <li><div class="icon-placeholder"></div> نظام التعاون</li>
                </ul>
            </aside>
        </div>

        <!-- Bottom Status Bar -->
        <footer id="status-bar" class="status-bar">
            <div class="status-left">
                <span id="word-count">كلمات: 0</span> |
                <span id="page-count">صفحات: 0</span> |
                <span id="char-count">حروف: 0</span>
            </div>
            <div class="status-right">
                <span id="current-format">التنسيق الحالي: فعل</span>
            </div>
        </footer>

    </div>

    <!-- Modals Container -->
    <div id="modals-container">
        <!-- Modals will be dynamically injected here -->
    </div>

    <!-- Error Boundary -->
    <div id="error-boundary" class="error-boundary" style="display: none;">
        <h2>عفوًا، حدث خطأ ما.</h2>
        <p>يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.</p>
        <button onclick="window.location.reload()">إعادة تحميل</button>
    </div>
</body>
</html>
```

## 2. Proposed CSS Styling

A new file, `css/sidebars.css`, should be created to house the styles for the new layout.

### `css/sidebars.css`

```css
/* Main container for the three-column layout */
.main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Shared sidebar styles */
.sidebar {
    width: 250px; /* Adjust width as needed */
    background-color: var(--bg-secondary);
    padding: var(--space-4);
    overflow-y: auto;
    border: 1px solid var(--border);
}

.sidebar.left-sidebar {
    border-right: 1px solid var(--border);
}

.sidebar.right-sidebar {
    border-left: 1px solid var(--border);
}

/* Feature list styling */
.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.feature-list li {
    display: flex;
    align-items: center;
    padding: var(--space-3);
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: background-color var(--transition-speed) ease;
}

.feature-list li:hover {
    background-color: var(--bg-tertiary);
}

.icon-placeholder {
    width: 20px;
    height: 20px;
    background-color: #ccc;
    border-radius: 4px;
    margin-right: var(--space-3);
}

/* Main content area adjustments */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.editor-container {
    flex: 1;
    overflow: auto;
}
```

## 3. Implementation Steps

Here is a step-by-step guide for the Code mode to implement the UI changes:

1.  **Create the new CSS file:**
    *   Create a new file named `sidebars.css` in the `css` directory.
    *   Copy the CSS content from the "Proposed CSS Styling" section above into `css/sidebars.css`.

2.  **Update `index.html`:**
    *   Replace the entire content of `index.html` with the HTML from the "Proposed HTML Structure" section.
    *   Ensure the new stylesheet is linked correctly in the `<head>` section: `<link rel="stylesheet" href="css/sidebars.css">`.

3.  **Adjust existing CSS:**
    *   In `css/main.css`, the styles for `.app-wrapper`, `.main-content`, `.left-sidebar`, and `.right-sidebar` might conflict with the new Flexbox layout. It is recommended to remove or comment out the `grid` properties from `.app-wrapper` and `.main-content` to avoid conflicts. The new `.main-container` class will handle the layout.

4.  **Verify the changes:**
    *   After applying the changes, run the application to ensure the new layout is rendered correctly. The application should now have a three-column layout with the new sidebars.