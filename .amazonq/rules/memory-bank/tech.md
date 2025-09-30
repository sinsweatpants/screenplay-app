# Technology Stack - Screenplay Writer

## Programming Languages & Versions
- **JavaScript**: ES6+ modules with modern syntax
- **HTML5**: Semantic markup with RTL Arabic support
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Node.js**: 18+ required for development tools

## Build System & Tools
- **Vite 5.0.10**: Modern build tool with HMR
- **Terser**: Code minification for production
- **ESLint 8.56.0**: Code linting and quality
- **Prettier 3.1.1**: Code formatting

## Core Dependencies
```json
{
  "chart.js": "^4.4.1",        // Analytics visualization
  "jspdf": "^2.5.1",           // PDF export
  "jspdf-autotable": "^3.8.2"  // PDF table formatting
}
```

## Development Commands

### Setup & Installation
```bash
# Clone and install
git clone <repository>
cd screenplay-app
npm install

# Environment setup
cp .env.example .env
# Edit .env with your Gemini API key
```

### Development Workflow
```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Build Configuration
- **Output**: `dist/` directory
- **Chunks**: vendor, core, modules for optimal loading
- **Sourcemaps**: Enabled for debugging
- **Assets**: Optimized and versioned

## Environment Variables
```bash
# Required for AI features
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL=gemini-2.5-pro

# Application metadata
VITE_APP_NAME=Screenplay Writer
VITE_APP_VERSION=1.0.0
```

## Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **ES6 Modules**: Native module support required
- **RTL Support**: Arabic text direction handling

## Development Features
- **Hot Module Replacement**: Instant updates during development
- **Path Aliases**: @core, @modules, @libraries shortcuts
- **Code Splitting**: Automatic chunk optimization
- **Environment Detection**: Development vs production modes

## Performance Optimizations
- **Lazy Loading**: Modules loaded on demand
- **Asset Optimization**: Images and fonts compressed
- **Caching Strategy**: Efficient browser caching
- **Bundle Analysis**: Webpack bundle analyzer integration

## Security Considerations
- **API Key Management**: Environment variables only
- **Content Security Policy**: XSS protection
- **Input Sanitization**: User content validation
- **HTTPS**: Required for production deployment