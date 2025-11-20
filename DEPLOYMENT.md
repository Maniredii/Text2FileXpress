# Deploying Text2FileXpress to Netlify

## Quick Deploy

### Option 1: Netlify CLI (Recommended)

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your project**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Netlify Dashboard

1. **Build your project locally**:
   ```bash
   npm run build
   ```

2. **Go to Netlify Dashboard**:
   - Visit https://app.netlify.com
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder

### Option 3: Connect GitHub Repository (Best for Continuous Deployment)

1. **Push your code to GitHub**:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your repository

3. **Build Settings** (auto-filled from netlify.toml):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Click "Deploy site"

## Build Commands

- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview Build**: `npm run preview`

## Environment Variables

No environment variables are required for this application as it runs 100% client-side.

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## Post-Deployment Checklist

- ✅ Test PDF generation
- ✅ Test DOCX generation
- ✅ Test all templates
- ✅ Test dark mode
- ✅ Test on mobile devices
- ✅ Verify all formatting options work

## Troubleshooting

If build fails:
1. Make sure all dependencies are installed: `npm install`
2. Check that `package.json` has the correct build script
3. Verify Node.js version is 18 or higher
4. Clear cache and rebuild: `rm -rf node_modules dist && npm install && npm run build`

## Performance Optimization

The app is already optimized with:
- Vite for fast builds
- Code splitting
- Lazy loading
- Minification in production

Your site will be live at: `https://your-site-name.netlify.app`
