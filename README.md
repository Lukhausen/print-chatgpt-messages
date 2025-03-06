# ChatGPT Markdown Formatter

A powerful web application for formatting ChatGPT conversations with real-time Markdown rendering, code syntax highlighting, and LaTeX math equation support.

## 🚀 Features

- **Real-Time Markdown Preview**: Instantly see your formatted text as you type
- **Automatic Syntax Highlighting**: Code blocks are automatically detected and highlighted with proper language recognition
- **Language Detection**: Identifies programming languages in code blocks and displays a label with the detected language
- **LaTeX Math Rendering**: Display complex mathematical equations with MathJax (supports both inline `$...$` and block `$$...$$` notation)
- **Responsive Design**: Optimized layout for mobile, tablet, and desktop devices
- **Print to PDF**: One-click export of beautifully formatted content with optimized styling
- **Clean Printing**: Print-specific CSS ensures clean output without UI elements and proper page breaks

## 📖 Usage

1. **Input**: Paste your ChatGPT conversation text into the left panel
2. **Preview**: See the formatted result instantly in the right panel
3. **Print PDF**: Click the "Open Print View" button or use keyboard shortcuts (`Ctrl+P` or `⌘+P`) to save as PDF
4. **Reset**: Use the "Clear Content" button to start over

### Supported Markdown Features

- Headers (h1-h6)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Inline code
- Links
- Images
- Blockquotes
- Tables
- Horizontal rules
- LaTeX math equations

## 💻 Development

This project uses Vite for fast development and optimized production builds.

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/print-chatgpt-messages.git
cd print-chatgpt-messages

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static file hosting service.

### Preview Production Build

```bash
npm run preview
```

## 🛠 Technical Implementation

### Dependencies

The application uses npm packages instead of CDNs for better reliability and offline development:

- **marked**: Fast and efficient Markdown parser and compiler
- **highlight.js**: Code syntax highlighting with automatic language detection
- **MathJax**: Mathematical equation rendering (loaded from CDN)

### Code Structure

- **index.html**: Main HTML structure with responsive layout
- **src/main.js**: Core application logic including markdown rendering, highlighting, and event handling
- **src/style.css**: Main styling for the application interface
- **src/print.css**: Special styles that only apply when printing
- **public/favicon.svg**: Document icon for the site

### Key Technical Features

- **Debounced Rendering**: Prevents performance issues during rapid typing
- **Automatic Language Detection**: Uses highlight.js's language detection for unlabeled code blocks
- **Print Optimization**: Special event handler ensures content displays properly when printing
- **LaTeX Pre-processing**: Converts various LaTeX delimiters to standardized format

## 📱 Responsive Behavior

- **Mobile**: Single column layout with editor above preview
- **Tablet**: Enhanced spacing and font sizes
- **Desktop**: Side-by-side editor and preview panels
- **Large Desktop**: Fixed-position editor with scrollable preview

## 📄 License

MIT 