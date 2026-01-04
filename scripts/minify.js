const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const filesToMinify = [
    'main.js',
    'components/lp-app-nav.js',
    'components/lp-auth-page.js',
    'components/lp-cart-page.js',
    'components/lp-category-pill.js',
    'components/lp-food-card.js',
    'components/lp-home-page.js',
    'components/lp-order-page.js',
    'components/lp-profile-page.js',
    'components/lp-saved-page.js',
    'components/lp-search-bar.js',
    'src/api/client.js'
];

async function minifyFile(filePath) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);
        const code = fs.readFileSync(fullPath, 'utf8');
        
        const result = await minify(code, {
            compress: {
                drop_console: false, 
                drop_debugger: true,
                pure_funcs: ['console.debug', 'console.trace']
            },
            mangle: false,
            format: {
                comments: false
            }
        });
        
        if (result.error) {
            console.error(`Error minifying ${filePath}:`, result.error);
            return;
        }
        
    
        const distDir = path.join(__dirname, '..', 'dist');
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        const distPath = path.join(distDir, filePath);
        const distPathDir = path.dirname(distPath);
        if (!fs.existsSync(distPathDir)) {
            fs.mkdirSync(distPathDir, { recursive: true });
        }
        
        fs.writeFileSync(distPath, result.code);
        
        const originalSize = Buffer.byteLength(code, 'utf8');
        const minifiedSize = Buffer.byteLength(result.code, 'utf8');
        const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
        
        console.log(`✓ ${filePath}: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% reduction)`);
    } catch (error) {
        console.error(`minify хийхэд алдаа гарлаа ${filePath}:`, error.message);
    }
}

async function minifyAll() {
    console.log('Starting minification...\n');
    
    for (const file of filesToMinify) {
        await minifyFile(file);
    }
    
    console.log('\n✓ Minification complete! Files saved to dist/');

}

minifyAll().catch(console.error);

