# UI Redesign and Correction Plan

This document outlines the plan to revise the UI for the Screenwriting application, based on the provided target image. The key correction is to reinstate the central editor area while implementing a three-column layout.

## 1. Detailed HTML Structure (`index.html`)

The entire body of `index.html` should be replaced with the following structure to create the header and the three-column layout.

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screenplay App</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/sidebars.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <div class="save-status">تم حفظ جميع التغييرات</div>
            <div class="document-title">سيناريو بدون عنوان</div>
        </header>
        <main class="main-content">
            <aside class="sidebar left-sidebar">
                <ul>
                    <li><i class="icon-placeholder"></i><span>بحث</span></li>
                    <li><i class="icon-placeholder"></i><span>الشخصيات</span></li>
                    <li><i class="icon-placeholder"></i><span>المشاهد</span></li>
                    <li><i class="icon-placeholder"></i><span>الأماكن</span></li>
                    <li><i class="icon-placeholder"></i><span>تحليل</span></li>
                    <li><i class="icon-placeholder"></i><span>الكتابة بالذكاء الاصطناعي</span></li>
                </ul>
            </aside>
            <section class="editor-area">
                <textarea placeholder="مرحباً بك في كاتب السيناريو! ابدأ الكتابة هنا..."></textarea>
            </section>
            <aside class="sidebar right-sidebar">
                <ul>
                    <li><i class="icon-placeholder"></i><span>قالب</span></li>
                    <li><i class="icon-placeholder"></i><span>تصدير</span></li>
                    <li><i class="icon-placeholder"></i><span>تعاون</span></li>
                    <li><i class="icon-placeholder"></i><span>إعدادات</span></li>
                    <li><i class="icon-placeholder"></i><span>مساعدة</span></li>
                </ul>
            </aside>
        </main>
    </div>
</body>
</html>
```

## 2. Detailed CSS Styling

### `css/main.css` Modifications

The following rules should be added or updated in `css/main.css` to handle the main application layout.

```css
/* General Body and App Container */
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f0f0f0;
    color: #333;
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* Header Styling */
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c2c2c;
    color: white;
    padding: 10px 20px;
    height: 50px;
    box-sizing: border-box;
}

.document-title {
    font-weight: bold;
}

.save-status {
    color: #a0a0a0;
    font-size: 0.9em;
}

/* Main Content Area */
.main-content {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
}

/* Editor Area Styling */
.editor-area {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
}

.editor-area textarea {
    width: 100%;
    height: 100%;
    border: none;
    padding: 20px;
    font-size: 16px;
    resize: none;
    box-sizing: border-box;
    outline: none;
}
```

### `css/sidebars.css` Modifications

This file will handle the styling for both the left and right sidebars.

```css
/* Sidebar General Styling */
.sidebar {
    width: 240px;
    background-color: #2c2c2c;
    color: white;
    padding: 20px 0;
    flex-shrink: 0;
    overflow-y: auto;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar ul li {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 1em;
}

.sidebar ul li:hover {
    background-color: #4a4a4a;
}

/* Icon Placeholder Styling */
.icon-placeholder {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #555;
    border-radius: 3px;
    margin-left: 15px; /* Use margin-left for RTL layout */
}

/* Specific Sidebar Adjustments if needed */
.left-sidebar {
    /* No specific styles needed if they are identical */
}

.right-sidebar {
    /* No specific styles needed if they are identical */
}
```

## 3. Implementation Steps for Code Mode

1.  **Replace `index.html`:** Overwrite the entire content of `index.html` with the HTML structure provided in section 1.
2.  **Update `css/main.css`:** Add/replace the CSS rules in `css/main.css` with the styles provided in section 2.
3.  **Update `css/sidebars.css`:** Add/replace the CSS rules in `css/sidebars.css` with the styles provided in section 2.
4.  **Verification:** After applying the changes, the application's UI should match the target image, including the header, three-column layout, and the central editor area.

This plan ensures the editor is correctly reinstated and the UI aligns perfectly with the design specification.