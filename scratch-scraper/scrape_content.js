const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    console.log('Navigating to phitron.io...');
    await page.goto('https://phitron.io/', { waitUntil: 'networkidle0', timeout: 60000 });

    console.log('Extracting page content...');
    
    // Evaluate and extract all text content structured by headings and paragraphs
    const content = await page.evaluate(() => {
      // Try to get a structural representation
      let result = '';
      
      // Helper function to process nodes
      function processNode(node, depth) {
        if (!node) return;
        
        // Skip hidden elements or scripts
        if (node.nodeType === 1) { // Element node
          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'NOSCRIPT' || node.tagName === 'SVG') {
            return;
          }
        }
        
        if (node.nodeType === 3) { // Text node
          const text = node.textContent.trim();
          if (text.length > 0) {
            result += '  '.repeat(depth) + text + '\\n';
          }
        } else if (node.nodeType === 1) {
          // If it's a heading, add markdown-like formatting
          const tag = node.tagName.toLowerCase();
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            result += '\\n' + '#'.repeat(parseInt(tag[1])) + ' ' + node.innerText.trim() + '\\n';
            return; // innerText already gets children, so don't recurse
          }
          
          if (tag === 'button' || tag === 'a') {
             result += '\\n[' + tag.toUpperCase() + '] ' + node.innerText.trim() + '\\n';
             return;
          }
          
          // Otherwise process children
          for (const child of node.childNodes) {
            processNode(child, depth + 1);
          }
        }
      }
      
      const root = document.querySelector('#root') || document.body;
      processNode(root, 0);
      
      // Clean up the text by removing excessive newlines
      return result.replace(/\\n{3,}/g, '\\n\\n');
    });
    
    fs.writeFileSync('phitron_content.txt', content);
    console.log('Content saved to phitron_content.txt');
    
    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
