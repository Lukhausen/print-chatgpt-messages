# ChatGPT Markdown Formatter

A simple, elegant web application for formatting ChatGPT conversations with Markdown, code highlighting, and LaTeX math rendering.

## Features

- **Instant Markdown Preview**: See your formatted text as you type
- **Syntax Highlighting**: Automatic language detection for code blocks
- **LaTeX Math Support**: Render mathematical equations with MathJax
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Print to PDF**: Easy export of your formatted content

## Usage

1. Paste your ChatGPT conversation text into the left panel
2. See the formatted result in the right panel
3. To save as PDF, use `Ctrl+P` or `⌘+P` and select "Save as PDF"

## Development

This project is built with Vite for fast development and optimized production builds.

### Dependencies

The project uses npm packages instead of CDNs for better reliability and offline development:

- **highlight.js**: Provides code syntax highlighting with automatic language detection
- **marked**: Markdown parsing and rendering

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/print-chatgpt-messages.git
cd print-chatgpt-messages/print

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **Vite**: Fast development and optimized builds
- **Marked**: Markdown parsing
- **highlight.js**: Code syntax highlighting
- **MathJax**: Mathematical equation rendering

## License

MIT 