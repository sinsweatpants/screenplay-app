# Project Structure - Screenplay Writer

## Directory Organization

### Core Application Structure
```
screenplay-app/
├── js/                          # JavaScript modules (ES6+)
│   ├── core/                    # Core system components
│   │   ├── app.js              # Main editor application
│   │   ├── config.js           # Configuration with env vars
│   │   ├── integrated-system.js # System coordinator
│   │   └── main.js             # Application entry point
│   ├── libraries/              # Utility libraries
│   │   ├── event-bus.js        # Event system
│   │   ├── keyboard-manager.js # Keyboard shortcuts
│   │   ├── notification-manager.js # Notifications
│   │   └── storage-manager.js  # Local storage management
│   └── modules/                # Feature modules
│       ├── ai-assistant.js     # AI integration
│       ├── analytics.js        # Analytics engine
│       ├── character-manager.js # Character management
│       ├── collaboration.js    # Collaboration features
│       ├── export.js          # Export functionality
│       ├── functions.js       # Enhanced functions
│       ├── planning.js        # Visual planning
│       ├── project-manager.js # Project management
│       ├── search-validator.js # Search & validation
│       └── utilities.js       # Utility functions
├── css/                        # Stylesheets
│   ├── main.css               # Main styles
│   ├── components.css         # UI components
│   ├── editor.css            # Editor-specific styles
│   └── [other].css           # Feature-specific styles
├── data/                      # Static data
│   └── templates.json        # Screenplay templates
└── public/                   # Static assets
    └── favicon.svg          # Application icon
```

## Core Components & Relationships

### 1. Core System (`js/core/`)
- **app.js**: Main screenplay editor with formatting logic
- **config.js**: Environment configuration and API keys
- **integrated-system.js**: Coordinates all modules via EventBus
- **main.js**: Application bootstrap and initialization

### 2. Libraries (`js/libraries/`)
- **event-bus.js**: Pub/sub system for module communication
- **storage-manager.js**: LocalStorage abstraction with backup
- **keyboard-manager.js**: Global keyboard shortcut handling
- **notification-manager.js**: User notification system

### 3. Feature Modules (`js/modules/`)
- **ai-assistant.js**: Gemini API integration for AI features
- **analytics.js**: Script analysis and statistics
- **export.js**: PDF/DOCX/HTML export functionality
- **character-manager.js**: Character tracking and analysis
- **project-manager.js**: Multi-project workspace management

## Architectural Patterns

### Module System
- **ES6 Modules**: Import/export pattern throughout
- **Event-Driven Architecture**: EventBus for loose coupling
- **Modular Design**: Each feature as independent module
- **Dependency Injection**: Configuration passed to modules

### Data Flow
1. User interaction → Event emission
2. EventBus → Module notification
3. Module processing → State update
4. State change → UI update via EventBus

### Build System
- **Vite**: Modern build tool with HMR
- **Code Splitting**: Vendor, core, and modules chunks
- **Path Aliases**: @core, @modules, @libraries shortcuts
- **Environment Variables**: Secure API key management

## Integration Points
- **Gemini API**: AI assistant integration
- **Chart.js**: Analytics visualization
- **jsPDF**: Professional document export
- **LocalStorage**: Client-side data persistence