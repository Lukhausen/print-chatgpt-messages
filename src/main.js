import './style.css'

/* Main JavaScript for Markdown Preview Tool for ChatGPT Content */

// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('markdown-input');
  const preview = document.getElementById('preview');

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
        // Use explicit highlighting
        hljs.highlightElement(block);
      } else {
        // Use automatic detection
        const result = hljs.highlightAuto(block.textContent);
        block.innerHTML = result.value;
        language = result.language || 'auto';
      }

      // Create a label element to display the language
      const label = document.createElement('span');
      label.className = 'language-label';
      label.textContent = language;
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

  // Initial rendering with an empty string
  renderMarkdown('');
});
