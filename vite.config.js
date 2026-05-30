import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative paths to make the build completely environment-agnostic (works on GitHub Pages, Vercel, and custom domains out of the box!)
  base: './',
  build: {
    outDir: 'dist'
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        const isGithub = process.env.DEPLOY_TARGET === 'github';
        // Substitute the canonical URLs in OpenGraph and Schema data
        const siteUrl = isGithub 
          ? 'https://adhamdesouky.github.io/omar-desoke.github.io/' 
          : 'https://ownyoursystem.vercel.app/';
        
        return html.replace(/https:\/\/adhamdesouky\.github\.io\/omar-desoke\.github\.io\//g, siteUrl);
      }
    }
  ]
});
