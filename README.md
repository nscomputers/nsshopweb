# NS Computers & Electronics - Storefront & Admin Portal

Official web store and inventory management system for **NS Computers And Electronics** (Helpline / WhatsApp: **0717592590**).

Built with React 19, TypeScript, Tailwind CSS, Lucide Icons, and Firebase Firestore / LocalStorage multi-tier persistent architecture.

---

## 🚀 Deploy to GitHub Pages (Public & Free)

This project is pre-configured for automated deployment to GitHub Pages via GitHub Actions.

### Quick 3-Step Deployment:

1. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name your repository (e.g., `ns-computers-store`)
   - Select **Public** and create the repository (leave it empty without initializing a README).

2. **Push the Workspace to GitHub**:
   Run the following commands in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Deploy NS Computers Store & Admin"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, open **Settings** &rarr; **Pages**.
   - Under **Build and deployment &rarr; Source**, choose **GitHub Actions**.
   - Your site will automatically build and publish to:
     `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

*(Alternative manual CLI deployment is also available via `npm run deploy` using the pre-installed `gh-pages` package).*

---

## 💾 Permanent Data Save on GitHub Pages

Because GitHub Pages hosts static web applications, this application includes a **multi-tier persistence architecture**:

1. **Real-Time Worldwide Cloud Sync (Firebase Firestore)**:
   - In the **Admin Portal** &rarr; **Cloud & Permanent Save** tab, paste your free Firebase project credentials.
   - Any customer anywhere in the world placing an order on your public GitHub Pages site will instantly record the order in your database and update the live inventory count.
2. **Local Offline-First Storage**:
   - Even without cloud setup, every product, stock change, customer order, and setting is saved permanently in the browser storage.
3. **1-Click Database Backup & Restore**:
   - Download complete JSON database backups at any time.
   - Export & Import products and orders as CSV for Excel and Google Sheets.

---

## 🔐 Site Admin Access

- **Username**: `admin`
- **Access**: Enter your admin password on the Site Admin login screen. Password is verified securely at runtime and is never saved to localStorage, files, or database backups.

---

## 📞 Store Contact Information

- **Helpline / WhatsApp**: `0717592590`
- **Delivery**: Islandwide express delivery
