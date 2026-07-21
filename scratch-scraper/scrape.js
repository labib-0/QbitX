const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    console.log('Navigating to phitron.io...');
    await page.goto('https://phitron.io/', { waitUntil: 'networkidle2' });

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'phitron_screenshot.png', fullPage: true });
    
    console.log('Extracting design data...');
    const data = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h1Styles = h1 ? window.getComputedStyle(h1) : null;
      const body = document.querySelector('body');
      const bodyStyles = window.getComputedStyle(body);
      const firstButton = document.querySelector('button, .btn, a[class*="btn"]');
      const btnStyles = firstButton ? window.getComputedStyle(firstButton) : null;
      
      return {
        bodyBg: bodyStyles.backgroundColor,
        bodyColor: bodyStyles.color,
        bodyFont: bodyStyles.fontFamily,
        h1Font: h1Styles ? h1Styles.fontFamily : 'none',
        h1Size: h1Styles ? h1Styles.fontSize : 'none',
        h1Color: h1Styles ? h1Styles.color : 'none',
        h1Text: h1 ? h1.innerText : 'none',
        btnBg: btnStyles ? btnStyles.backgroundColor : 'none',
        btnRadius: btnStyles ? btnStyles.borderRadius : 'none',
      };
    });
    console.log(JSON.stringify(data, null, 2));
    
    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
