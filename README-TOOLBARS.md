# Toolbar Architecture Refactor

This document outlines the new architecture for the toolbars in the application, designed to improve modularity, maintainability, and performance.

## 1. Vertical Toolbar Structure

The application now features a dual vertical toolbar layout:

-   **Left Toolbar:** Contains primary actions and tools that are essential for core writing and editing tasks.
-   **Right Toolbar:** Houses secondary tools, analytics, and advanced features that are not required for the main writing workflow.

This separation helps to declutter the user interface and provide a more intuitive user experience.

## 2. Decoupling with the EventBus

To decouple the toolbar UI from the action logic, we are using a central `EventBus`.

-   **Path:** `js/libraries/event-bus.js`

When a toolbar button is clicked, it publishes an event to the `EventBus` with a specific `data-action` payload. The core application logic listens for these events and triggers the corresponding actions, without the UI needing to know about the implementation details of the actions.

## 3. Lazy Loading with `wire-actions.js`

To improve initial load performance, the action modules are lazy-loaded on demand. This is managed by the `ActionMap` mechanism in `wire-actions.js`.

-   **Path:** `js/toolbars/wire-actions.js`

When an action is triggered for the first time, `wire-actions.js` dynamically imports the required module from the `js/actions/` directory. This ensures that we only load the code that is necessary, reducing the initial bundle size and speeding up application startup.

## 4. `data-action` to Module Mapping

The following table maps each `data-action` attribute to its corresponding JavaScript module in the `js/actions/` directory.

| `data-action` | Module Path | Description |
| --- | --- | --- |
| `export-pdf` | `js/actions/exporter.js` | Handles exporting the document to PDF. |
| `export-docx` | `js/actions/exporter.js` | Handles exporting the document to DOCX. |
| `open-document` | `js/actions/reader.js` | Opens and reads a document file. |
| `ai-suggestion` | `js/actions/ai.js` | Provides AI-powered writing suggestions. |
| `show-analytics` | `js/actions/analytics.js` | Displays document analytics and metrics. |
| `toggle-visual-planner` | `js/actions/visual.js` | Toggles the visual planning board. |
| `manage-characters` | `js/actions/characters.js` | Opens the character management interface. |
| `save-project` | `js/actions/projects.js` | Saves the current project. |
| `load-project` | `js/actions/projects.js` | Loads an existing project. |
| `search-text` | `js/actions/search-validate.js` | Performs a text search in the document. |
| `validate-script` | `js/actions/search-validate.js` | Validates the script for formatting errors. |
| `start-collab` | `js/actions/collab.js` | Initiates a real-time collaboration session. |
| `end-collab` | `js/actions/collab.js` | Ends the current collaboration session. |
