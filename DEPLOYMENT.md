# 🚀 Deployment Guide

## Push to GitHub

### **Step 1: Initialize Git (if not already done)**

```bash
cd C:\Users\zaino\Desktop\products-pwa\sp-app
git init
```

### **Step 2: Add Remote**

```bash
git remote add origin https://github.com/anthonyzaino88/TechVault.git
```

### **Step 3: Add All Files**

```bash
git add .
```

### **Step 4: Commit**

```bash
git commit -m "Initial commit: TechVault PWA with modern features"
```

### **Step 5: Push to GitHub**

```bash
git branch -M main
git push -u origin main
```

---

## Enable GitHub Pages

### **Method 1: Via GitHub Website**

1. Go to: https://github.com/anthonyzaino88/TechVault
2. Click **Settings** (top menu)
3. Scroll to **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** / (root)
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Access your live site at: `https://anthonyzaino88.github.io/TechVault/`

### **Method 2: Via GitHub CLI (if installed)**

```bash
gh repo edit --enable-pages
```

---

## Update Service Worker Path (Important!)

After GitHub Pages is live, verify the paths work correctly. The service worker and manifest are already configured with the correct base path (`/TechVault/`).

---

## Verify Deployment

### **Check these URLs:**

✅ Home Page: https://anthonyzaino88.github.io/TechVault/  
✅ Products: https://anthonyzaino88.github.io/TechVault/pages/products.html  
✅ Analytics: https://anthonyzaino88.github.io/TechVault/pages/analytics.html  
✅ About: https://anthonyzaino88.github.io/TechVault/pages/about.html  

### **Test PWA Features:**

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Worker** - should be active
4. Check **Manifest** - should load correctly
5. Try **Add to Home Screen** on mobile

---

## Troubleshooting

### **Issue: 404 Errors**
- Verify GitHub Pages is enabled
- Check branch is set to `main`
- Ensure folder is set to `/` (root)
- Wait 2-3 minutes after enabling

### **Issue: Service Worker Not Working**
- Check browser console for errors
- Verify paths in `service-worker.js` match `/TechVault/`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### **Issue: Manifest Not Loading**
- Check `manifest.json` paths
- Verify `start_url` is set to `/TechVault/`
- Check browser console for manifest errors

---

## Update After Deployment

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild (takes 1-2 minutes).

---

## Custom Domain (Optional)

If you want a custom domain like `techvault.yourdomain.com`:

1. Buy domain (Namecheap, Google Domains, etc.)
2. Go to GitHub Settings → Pages
3. Add custom domain
4. Configure DNS records:
   - Add CNAME record pointing to: `anthonyzaino88.github.io`
5. Enable HTTPS

---

## 🎉 You're Live!

Your TechVault PWA is now accessible worldwide at:
**https://anthonyzaino88.github.io/TechVault/**

Share it on:
- LinkedIn
- Your portfolio
- Resume
- Job applications

---

**Need help?** Check GitHub Pages documentation: https://docs.github.com/en/pages

