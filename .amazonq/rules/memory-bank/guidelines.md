# Development Guidelines - Screenplay Writer

## Code Quality Standards

### JavaScript Patterns
- **ES6+ Modules**: Use `import`/`export` syntax exclusively
- **Class-based Architecture**: All major components as ES6 classes
- **Constructor Pattern**: Accept `eventBus` and `config` parameters
- **Initialization Guard**: Use `isInitialized` flag to prevent double initialization

### Documentation Standards
- **JSDoc Comments**: Comprehensive documentation for all classes and methods
- **Arabic Comments**: Use Arabic for inline comments and descriptions
- **Type Definitions**: Define `@typedef` for complex configuration objects
- **Parameter Documentation**: Document all parameters with types and descriptions

### Error Handling
- **Try-Catch Blocks**: Wrap event listeners in try-catch for graceful failures
- **Console Logging**: Use descriptive console messages for initialization and errors
- **Graceful Degradation**: Check for element existence before manipulation

## Architectural Patterns

### Event-Driven Architecture
```javascript
// Standard event subscription pattern
this.eventBus.on('editor:contentChanged', (content) => this.handleChange(content));

// Event emission pattern
this.eventBus.emit('analytics:updated', stats);

// One-time event subscription
this.eventBus.once('app:ready', () => this.initialize());
```

### Module Structure
```javascript
export default class ModuleName {
    constructor(eventBus, config) {
        this.eventBus = eventBus;
        this.config = config;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        // Setup logic here
        this.isInitialized = true;
        console.log("ModuleName initialized.");
    }
}
```

### Configuration Management
- **Centralized Config**: All settings in `config.js` with environment variables
- **Frozen Objects**: Use `Object.freeze()` for immutable configuration
- **Type Safety**: Define TypeScript-style JSDoc types for configuration objects
- **Environment Variables**: Use `import.meta.env.VITE_*` for sensitive data

## Performance Optimization

### Debouncing Pattern
```javascript
// Import utilities for debouncing
import Utilities from './utilities.js';

// Create debounced functions in constructor
this.debouncedAnalyze = Utilities.debounce(this.analyze.bind(this), 2000);

// Use debounced functions for expensive operations
this.eventBus.on('editor:contentChanged', (content) => this.debouncedAnalyze(content));
```

### Memory Management
- **Event Cleanup**: Provide unsubscribe functions from event listeners
- **Stack Limits**: Implement limits for undo/redo stacks (default: 50)
- **Interval Cleanup**: Clear intervals and timeouts in cleanup methods

### DOM Manipulation
- **Element Caching**: Cache DOM elements in constructor or init
- **Batch Operations**: Group DOM changes to minimize reflows
- **Event Delegation**: Use event delegation for dynamic content

## Code Organization

### File Structure Conventions
- **Core System**: `/js/core/` - Essential application logic
- **Feature Modules**: `/js/modules/` - Independent feature implementations  
- **Utility Libraries**: `/js/libraries/` - Reusable utility classes
- **Single Responsibility**: One class per file with descriptive names

### Import/Export Patterns
```javascript
// Default export for main classes
export default class ClassName { }

// Named exports for utilities and constants
export const CONSTANT_NAME = 'value';
export { utilityFunction };

// Import patterns
import MainClass from './main-class.js';
import { utilityFunction, CONSTANT } from './utilities.js';
```

### Naming Conventions
- **Classes**: PascalCase (e.g., `AnalyticsEngine`, `MainApplication`)
- **Methods**: camelCase (e.g., `calculateWordCount`, `analyzeSceneHeading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `APP_CONFIG`, `FORMATTING_KEYS`)
- **Events**: kebab-case with namespace (e.g., `editor:contentChanged`, `analytics:updated`)

## API Integration Patterns

### Environment Configuration
```javascript
// Secure API key management
geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
geminiModel: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-pro',

// API configuration objects
api: {
    maxOutputTokens: 65530,
    thinkingBudget: 15785,
    tools: [{ type: 'url_context', enabled: true }]
}
```

### Request Handling
- **Debounced Requests**: Use debouncing for AI API calls (1.5s default)
- **Error Boundaries**: Implement proper error handling for API failures
- **Timeout Management**: Set appropriate timeouts for external requests

## UI/UX Patterns

### Theme Management
```javascript
// Theme toggling pattern
toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    this.eventBus.emit('settings:changed', { theme: newTheme });
}
```

### Status Updates
- **Real-time Statistics**: Update word count, character count, page estimates
- **Debounced Updates**: Use 500ms debounce for status bar updates
- **Arabic Text Support**: Ensure RTL text handling in all UI components

### Keyboard Shortcuts
- **Standardized Mapping**: Use Ctrl+0-8 for formatting shortcuts
- **Global Handlers**: Implement keyboard shortcuts through dedicated manager
- **Accessibility**: Ensure keyboard navigation works throughout application

## Testing and Quality Assurance

### Code Validation
- **ESLint Integration**: Use ESLint 8.56.0 for code quality checks
- **Prettier Formatting**: Maintain consistent code formatting
- **Type Checking**: Use JSDoc types for pseudo-type safety

### Performance Monitoring
- **Initialization Logging**: Log successful module initialization
- **Error Tracking**: Comprehensive error logging with context
- **Memory Usage**: Monitor and limit memory-intensive operations