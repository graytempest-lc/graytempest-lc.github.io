// Compatibility entry point. Content JSON is authoritative; rendered HTML is not re-imported.
// For a legacy publisher: npm run import:legacy -- /path/YYYY-MM-DD.html, then npm run build.
import './prepare-data.mjs';
console.log('Calendar data prepared. Run npm run build to regenerate the complete site in dist/.');
