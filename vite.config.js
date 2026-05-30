import { defineConfig } from 'vite';

export default defineConfig({
  // Dynamically set base path based on compilation environment
  base: process.env.DEPLOY_TARGET === 'github' ? '/omar-desoke.github.io/' : '/',
  build: {
    outDir: 'dist'
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        const isGithub = process.env.DEPLOY_TARGET === 'github';
        // For Vercel deployments, substitute the canonical URLs in OpenGraph and Schema data
        const siteUrl = isGithub 
          ? 'https://adhamdesouky.github.io/omar-desoke.github.io/' 
          : 'https://omardesoke.vercel.app/';
        
        return html.replace(/https:\/\/adhamdesouky\.github\.io\/omar-desoke\.github\.io\//g, siteUrl);
      }
    }
  ]
});
