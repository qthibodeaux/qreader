/**
 * BookEngine.js
 * 
 * Handles the logic of slicing raw content into view-sized pages.
 * Designed to be framework-agnostic and efficient.
 */

export const FONT_SIZES = {
  sm: '1.2rem',
  md: '1.5rem',
  lg: '1.8rem',
  xl: '2.2rem'
};

export const THEMES = {
  'dark-paper': {
    name: 'Dark Paper',
    bone: '#f8f1e7',
    ink: '#111827',
    brass: '#b98b4b',
    background: 'linear-gradient(180deg, #0d1320 0%, #111827 56%, #0d1420 100%)'
  },
  'classic-sepia': {
    name: 'Sepia',
    bone: '#433422',
    ink: '#f4ecd8',
    brass: '#8c6031',
    background: '#f4ecd8'
  }
};

/**
 * Measures content and splits it into pages based on available height.
 */
export function paginateBook(chapters, options = {}) {
  const { 
    fontSize = 'md', 
    lineHeight = 1.4, // Tighter line height like Kindle
    viewWidth = window.innerWidth - 36, // Match CSS padding (18px * 2)
    viewHeight = window.innerHeight - 80 // Maximize space
  } = options;

  // 1. Create a measurement sandbox
  const sandbox = document.createElement('div');
  sandbox.style.cssText = `
    position: fixed;
    top: -9999px;
    left: 0;
    width: ${viewWidth}px;
    font-size: ${FONT_SIZES[fontSize]};
    line-height: ${lineHeight};
    visibility: hidden;
    font-family: Georgia, serif;
    padding: 0;
    margin: 0;
    word-wrap: break-word;
  `;
  document.body.appendChild(sandbox);

  const pages = [];
  const tocMap = {};

  // Front Matter
  pages.push({ type: 'cover' });

  chapters.forEach((chapter) => {
    // Record TOC entry
    tocMap[chapter.chapter] = pages.length;

    // Chapter Title Page
    pages.push({ 
      type: 'chapter-title', 
      chapterNumber: chapter.chapter, 
      title: chapter.title 
    });

    // Content Pages
    let currentBucket = [];
    let currentHeight = 0;
    const body = chapter.body || chapter.content || [];

    // 1. Break body into words for perfect flow
    const allWords = body.flatMap(paragraph => {
      // Split into words but preserve a "paragraph-end" marker
      const words = (paragraph + " ").split(" ");
      if (words.length > 0) {
        words[words.length - 1] = { text: words[words.length - 1], isEndOfParagraph: true };
      }
      return words;
    }).filter(word => word !== "");

    allWords.forEach((wordObj) => {
      const isObject = typeof wordObj === 'object';
      const wordText = isObject ? wordObj.text : wordObj;
      
      const tempItem = document.createElement('span');
      tempItem.textContent = wordText + " ";
      sandbox.appendChild(tempItem);
      
      if (isObject && wordObj.isEndOfParagraph) {
        const spacer = document.createElement('div');
        spacer.style.height = '0.8em';
        sandbox.appendChild(spacer);
      }

      if (sandbox.offsetHeight > viewHeight && currentBucket.length > 0) {
        // Pop the last word that caused the overflow
        sandbox.removeChild(tempItem);
        
        pages.push({
          type: 'content',
          chapter: chapter.chapter,
          content: [...currentBucket]
        });

        // Reset for next page
        currentBucket = [wordObj];
        sandbox.innerHTML = wordText + " "; 
      } else {
        currentBucket.push(wordObj);
      }
    });

    // Final bucket for the chapter
    if (currentBucket.length > 0) {
      pages.push({
        type: 'content',
        chapter: chapter.chapter,
        content: currentBucket
      });
    }
  });

  document.body.removeChild(sandbox);
  return { pages, tocMap };
}
