import './style.css'
import './print.css' // Import print-specific styles

// We'll dynamically import these heavy libraries
// import hljs from 'highlight.js';
// import 'highlight.js/styles/atom-one-light.css';
// import { marked } from 'marked';

/* Main JavaScript for Markdown Preview Tool for ChatGPT Content */

// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', async () => {
  const textarea = document.getElementById('markdown-input');
  const preview = document.getElementById('preview');
  const printButton = document.getElementById('print-button');
  const clearButton = document.getElementById('clear-button');

  // Show loading message in preview until libraries are loaded
  preview.innerHTML = '<p>Loading editor components...</p>';

  // Dynamically import libraries
  const [{ default: hljsCore }, { marked }] = await Promise.all([
    import('highlight.js/lib/core'),
    import('marked')
  ]);
  
  // Import the CSS separately
  await import('highlight.js/styles/atom-one-light.css');

  // Define a map for commonly used languages
  const commonLanguages = {
    // Web development
    html: () => import('highlight.js/lib/languages/xml'),
    css: () => import('highlight.js/lib/languages/css'),
    javascript: () => import('highlight.js/lib/languages/javascript'),
    typescript: () => import('highlight.js/lib/languages/typescript'),
    jsx: () => import('highlight.js/lib/languages/javascript'),
    json: () => import('highlight.js/lib/languages/json'),
    // Backend languages
    python: () => import('highlight.js/lib/languages/python'),
    java: () => import('highlight.js/lib/languages/java'),
    c: () => import('highlight.js/lib/languages/c'),
    cpp: () => import('highlight.js/lib/languages/cpp'),
    csharp: () => import('highlight.js/lib/languages/csharp'),
    php: () => import('highlight.js/lib/languages/php'),
    ruby: () => import('highlight.js/lib/languages/ruby'),
    go: () => import('highlight.js/lib/languages/go'),
    rust: () => import('highlight.js/lib/languages/rust'),
    // Shell and configuration
    bash: () => import('highlight.js/lib/languages/bash'),
    powershell: () => import('highlight.js/lib/languages/powershell'),
    yaml: () => import('highlight.js/lib/languages/yaml'),
    markdown: () => import('highlight.js/lib/languages/markdown'),
    sql: () => import('highlight.js/lib/languages/sql')
  };

  // Load initial common languages
  const initialLanguages = ['javascript', 'python', 'bash'];
  
  // Register initial languages
  for (const lang of initialLanguages) {
    const module = await commonLanguages[lang]();
    hljsCore.registerLanguage(lang, module.default);
  }

  // Cache for tracking which languages have been loaded
  const loadedLanguages = new Set(initialLanguages);

  // Function to lazy load a language if needed
  const ensureLanguageLoaded = async (lang) => {
    if (!lang || loadedLanguages.has(lang)) return;
    
    if (commonLanguages[lang]) {
      try {
        const module = await commonLanguages[lang]();
        hljsCore.registerLanguage(lang, module.default);
        loadedLanguages.add(lang);
      } catch (e) {
        console.warn(`Failed to load language: ${lang}`, e);
      }
    }
  };

  // Enable debug mode for development
  // In production, you would want to use safeMode() instead
  hljsCore.debugMode();

  // Clear loading message
  preview.innerHTML = '';

  // Configure marked for code highlighting
  marked.setOptions({
    highlight: async (code, lang) => {
      if (lang && commonLanguages[lang]) {
        await ensureLanguageLoaded(lang);
        if (hljsCore.getLanguage(lang)) {
          return hljsCore.highlight(code, { language: lang }).value;
        }
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
    if (window.MathJax) {
      MathJax.typesetPromise([preview])
        .then(() => {
          // Once MathJax rendering is complete, apply code highlighting
          applyHighlighting();
        })
        .catch(err => console.log('MathJax error:', err.message));
    } else {
      // If MathJax isn't loaded yet, just apply highlighting
      applyHighlighting();
    }
  };

  /**
   * Apply syntax highlighting and automatic language detection to all code blocks.
   * For each <pre><code> block:
   *  - If an explicit language class exists, use hljsCore.highlightElement.
   *  - Otherwise, use autolanguage detection.
   *  - Then, add a small label indicating the language.
   */
  function applyHighlighting() {
    const codeBlocks = preview.querySelectorAll('pre code');
    codeBlocks.forEach(async (block) => {
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
        
        // Load the language if it's not already loaded
        if (commonLanguages[language]) {
          await ensureLanguageLoaded(language);
        }
        
        // Use explicit highlighting with the latest API
        if (hljsCore.getLanguage(language)) {
          hljsCore.highlightElement(block);
        }
      } else {
        // For automatic language detection, we need to ensure several languages are loaded
        // We'll load common languages for auto-detection
        await Promise.all(['javascript', 'html', 'css', 'python', 'bash', 'markdown']
          .map(lang => ensureLanguageLoaded(lang)));
          
        // Use language detection if we have at least a few languages loaded
        if (loadedLanguages.size > 0) {
          try {
            const result = hljsCore.highlightAuto(block.textContent);
            language = result.language || 'auto';
            
            // Apply the detected language class
            block.classList.add(`language-${language}`);
            // Apply highlighting with the detected language
            block.innerHTML = result.value;
          } catch (e) {
            console.warn('Auto language detection failed:', e);
            language = 'auto';
          }
        }
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
