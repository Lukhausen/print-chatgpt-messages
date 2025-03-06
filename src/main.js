import './style.css'
import './print.css' // Import print-specific styles
import hljs from 'highlight.js';
// Import a default style
import 'highlight.js/styles/atom-one-light.css';
import { marked } from 'marked';

/* Main JavaScript for Markdown Preview Tool for ChatGPT Content */

// Enable debug mode for development
// In production, you would want to use safeMode() instead
hljs.debugMode();

// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('markdown-input');
  const preview = document.getElementById('preview');
  const printButton = document.getElementById('print-button');
  const clearButton = document.getElementById('clear-button');

  // Configure highlight.js to only consider common languages for auto-detection
  // This improves detection accuracy and significantly reduces processing time
  hljs.configure({
    languages: [
      // Web development
      'html', 'css', 'javascript', 'typescript', 'jsx', 'xml', 'json',
      // Backend languages
      'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust',
      // Shell and configuration
      'bash', 'powershell', 'yaml', 'markdown', 'sql'
    ]
  });

  // Configure marked for code highlighting (default option provided for explicit languages)
  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return code;
    },
  });

  /**
   * Process the markdown text:
   *  - Convert LaTeX delimiters
   *  - Render markdown as HTML
   *  - Process math with MathJax
   *  - Apply syntax highlighting with language detection and add labels
   */
  const renderMarkdown = (text) => {
    // Convert LaTeX delimiters (e.g. from \( ... \) to $...$)
    const processedText = text.replace(/\\\((.*?)\\\)/g, '$$$1$$');

    // Render markdown to HTML
    preview.innerHTML = marked.parse(processedText);

    // Render LaTeX expressions
    MathJax.typesetPromise([preview])
      .then(() => {
        // Once MathJax rendering is complete, apply code highlighting
        applyHighlighting();
      })
      .catch(err => console.log('MathJax error:', err.message));
  };

  /**
   * Apply syntax highlighting and automatic language detection to all code blocks.
   * For each <pre><code> block:
   *  - If an explicit language class exists, use hljs.highlightElement.
   *  - Otherwise, use hljs.highlightAuto to detect the language.
   *  - Then, add a small label indicating the language.
   */
  function applyHighlighting() {
    const codeBlocks = preview.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      const pre = block.parentElement;
      // Ensure the <pre> element is positioned relative for label positioning
      pre.style.position = 'relative';

      let language = '';
      // Check if a language class (starting with "language-") is present
      const classes = block.className.split(/\s+/);
      const explicitLangClass = classes.find(c => c.startsWith('language-'));

      if (explicitLangClass) {
        // Remove prefix to get language name
        language = explicitLangClass.replace('language-', '');
        // Use explicit highlighting with the latest API
        hljs.highlightElement(block);
      } else {
        // Use automatic detection with our restricted language set
        const result = hljs.highlightAuto(block.textContent);
        language = result.language || 'auto';
        
        // Apply the detected language class
        block.classList.add(`language-${language}`);
        // Apply highlighting with the detected language
        block.innerHTML = result.value;
      }

      // Create a label element to display the language
      const label = document.createElement('span');
      label.className = 'language-label';
      
      // Add extra class for auto-detected languages
      if (language === 'auto' || !explicitLangClass) {
        label.classList.add('language-auto');
      }
      
      // Create a span for the language name (always uppercase)
      const languageName = document.createElement('span');
      languageName.className = 'language-name';
      languageName.textContent = language.toUpperCase();
      label.appendChild(languageName);
      
      pre.appendChild(label);
    });
  }

  // Debounce function to improve performance during fast typing
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Create debounced version of renderMarkdown
  const debouncedRender = debounce(renderMarkdown, 300);

  // Update preview when user types
  textarea.addEventListener('input', () => debouncedRender(textarea.value));
  
  // Handle print button click
  if (printButton) {
    printButton.addEventListener('click', () => {
      window.print();
    });
  }
  
  // Handle clear button click
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      // Clear the textarea
      textarea.value = '';
      // Update the preview with empty content
      renderMarkdown('');
      // Focus the textarea for immediate typing
      textarea.focus();
    });
  }

  // Print preparation - ensure content displays properly when printing
  window.addEventListener('beforeprint', () => {
    // Force all code blocks to have no height restrictions
    document.querySelectorAll('pre, code, #preview, table').forEach(el => {
      el.style.maxHeight = 'none';
      el.style.height = 'auto';
      el.style.overflow = 'visible';
    });
    
    // Make tables display as table instead of block
    document.querySelectorAll('table').forEach(table => {
      table.style.display = 'table';
    });
  });

  // Initial rendering with an empty string
  renderMarkdown('');
});
