# Project Architectural Overview

## 1. Project Purpose

Based on the file names, this project appears to be a web-based application designed for screenplay writing and management. The presence of files like `screenplay_ai_writing_assistant.js`, `screenplay_character_management.js`, and `screenplay_visual_planning_system.js` suggests a comprehensive tool that assists writers with various aspects of the screenwriting process, from character development to final export.

## 2. Technology Stack

The technology stack seems to be based on modern web development technologies:

*   **Programming Language:** JavaScript is the primary language, as indicated by the numerous `.js` files.
*   **Framework/Tooling:** The presence of `vite.config.js` and `package.json` suggests that the project uses Vite as a build tool and Node.js with npm for package management.
*   **Frontend:** The project likely uses plain HTML, CSS, and JavaScript, without a major frontend framework like React or Vue, given the file structure.

## 3. Project Architecture

The project follows a modular architecture, separating concerns into different directories:

*   **`css/`:** This directory contains all the stylesheets, with a clear separation of concerns. Files like `main.css`, `editor.css`, and `sidebar-green-zone.css` suggest a well-organized styling system.
*   **`js/core/`:** This directory likely holds the core application logic, including the main application setup (`app.js`), configuration (`config.js`), and the central integrated system (`integrated-system.js`).
*   **`js/modules/`:** This directory contains the different features of the application, such as the AI assistant, analytics, character manager, and collaboration tools. This modular approach allows for easy maintenance and scalability.
*   **`js/libraries/`:** This directory likely contains third-party or custom libraries that provide common functionalities like event handling, keyboard management, and storage.
*   **Root-level `screenplay_*.js` files:** These files seem to be the main entry points for the different modules, orchestrating the overall functionality of the application.

## 4. Key Files

Here are some of the key files and their hypothesized roles:

*   **`index.html`:** The main HTML file that serves as the entry point for the application.
*   **`package.json`:** Defines the project's metadata, dependencies, and scripts.
*   **`vite.config.js`:** The configuration file for the Vite build tool.
*   **`js/core/app.js`:** The main application file that initializes the application and brings all the modules together.
*   **`js/core/integrated-system.js`:** A central file that likely manages the integration of the different modules and systems.
*   **`screenplay_main_application_enhanced.js`:** The primary script that likely orchestrates the entire application's functionality.