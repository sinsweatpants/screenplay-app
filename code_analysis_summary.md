# Code Analysis Summary

This document provides a technical summary of the screenplay application's source code, based on an analysis of the key files.

## 1. Core Logic

The application's core logic is primarily handled by `js/core/app.js` and `js/core/main.js`.

*   **`js/core/main.js`:** This file acts as the main entry point for the application. It contains the `ApplicationLoader` class, which is responsible for bootstrapping the entire application. When the DOM is fully loaded, it instantiates the `ApplicationLoader` and calls its `boot()` method. The `boot()` method initializes core components like the `EventBus`, `StorageManager`, and the main application logic. It also sets up a global error handler to catch any critical failures during startup.

*   **`js/core/app.js`:** This file defines the `MainApplication` class, which manages the core editor functionality. Its responsibilities include:
    *   Handling user input in the editor.
    *   Managing undo/redo functionality.
    *   Updating the status bar with word count, character count, etc.
    *   Applying text formatting.
    *   Implementing auto-save functionality.
    *   Toggling between light and dark themes.

The `ApplicationLoader` in `main.js` creates an instance of `MainApplication` and calls its `init()` method to set up all the necessary event listeners and start the auto-save timer.

## 2. Module Integration

The application uses a modular architecture, with different features encapsulated in separate files within the `js/modules/` directory. These modules are integrated into the main application in `js/core/main.js`.

When the application starts, the `ApplicationLoader` in `main.js` instantiates the various modules (e.g., `AIWritingAssistant`, `AnalyticsEngine`, `CharacterManager`, `CollaborationSystem`, `ProfessionalExportSystem`) and attaches them to the `window` object. This makes them globally accessible to other parts of the application, particularly the `IntegratedScreenplaySystem`, which seems to be the central hub for coordinating these modules.

The modules communicate with each other and the core application through a central `EventBus`. For example, when the content of the editor changes, the `MainApplication` emits an `editor:contentChanged` event. The `AnalyticsEngine` listens for this event and then performs its analysis. Similarly, other modules listen for and emit events to perform their respective functions.

Primary functions of the modules:

*   **`ai-assistant.js`:** Integrates with the Gemini API to provide AI-powered writing assistance, such as generating content and improving text.
*   **`analytics.js`:** Analyzes the screenplay content to provide statistics on word count, page count, scene count, and character dialogue.
*   **`character-manager.js`:** Manages character profiles, discovering them from the text and allowing for more detailed information to be stored.
*   **`collaboration.js`:** Provides features for team collaboration, such as comments and change tracking (though this is a frontend simulation).
*   **`export.js`:** Handles exporting the screenplay to various formats like PDF, DOCX, and HTML.

## 3. UI and DOM Interaction

The application's user interface is defined in `index.html`. This file lays out the structure of the application, including the top bar, main toolbar, sidebars, editor area, and status bar.

The JavaScript code interacts with the DOM in several ways:

*   **`MainApplication` (`app.js`):** Directly selects and manipulates DOM elements for the editor (`#editor`), status bar (`#word-count`, etc.), and theme toggle button (`#theme-toggle`). It attaches event listeners to these elements to handle user interactions.
*   **`ApplicationLoader` (`main.js`):** Manages the visibility of the loading screen (`#loading-screen`) and the main application wrapper (`#app-wrapper`).
*   **`index.html`:** Includes the main JavaScript file (`/js/main-simple.js`, which likely bundles `main.js` and other scripts via Vite) using a `<script type="module">` tag. The various UI elements have unique IDs that the JavaScript files use to select and interact with them.

The application follows a traditional model of separating HTML structure, CSS styling, and JavaScript logic, with JavaScript being responsible for dynamically updating the UI based on user actions and application state.

## 4. Data Flow

The primary mechanism for data flow between different parts of the application is the **`EventBus`**. This is a classic implementation of the publish/subscribe pattern.

*   **Publishers:** When something happens in one part of the application (e.g., the user types in the editor), that component (the "publisher") emits an event with a specific name (e.g., `editor:contentChanged`) and optionally passes along some data (e.g., the new editor content).
*   **Subscribers:** Other components (the "subscribers") can register to listen for specific events. When an event they are subscribed to is emitted, their callback function is executed with the data that was passed along.

This decoupled approach allows different modules to communicate without having direct references to each other, which makes the application more modular and easier to maintain. For example, the `MainApplication` doesn't need to know about the `AnalyticsEngine`; it just needs to announce that the content has changed. The `AnalyticsEngine` can then decide whether or not to act on that information.

State is generally managed within the individual modules, with the `EventBus` serving as the main channel for communicating state changes that affect other parts of the application.