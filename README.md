# 🚀 TechVault - Modern Product Catalog PWA

[![PWA](https://img.shields.io/badge/PWA-Enabled-blue)](https://web.dev/progressive-web-apps/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**A Progressive Web App showcasing modern e-commerce features, data visualization, and advanced web development capabilities**

[Live Demo](https://anthonyzaino88.github.io/TechVault/sp-app/) | [Features](#-key-features) | [Tech Stack](#-technology-stack) | [Installation](#-installation)

---

## 📖 Overview

TechVault is a fully-featured, production-ready product catalog Progressive Web App built with **vanilla JavaScript** - no frameworks required. This portfolio project demonstrates professional-grade PWA development, modern UI/UX design, and advanced web features including e-commerce filtering, analytics dashboards, and offline functionality.

**Perfect for showcasing:**
- Modern web development skills
- E-commerce architecture
- Data visualization capabilities
- PWA implementation expertise
- Responsive design mastery

---

## ✨ Key Features

### 🛒 **Modern E-Commerce Catalog**
- **Advanced Filtering** - Multi-criteria filtering by category and price range
- **Smart Search** - Real-time search across 60+ products
- **Sort Functionality** - Sort by name, price (high/low)
- **Quick View Modal** - Instant product details without page reload
- **Product Cards** - Modern card design with hover effects and badges
- **Breadcrumb Navigation** - Clear navigation path
- **60+ Products** - Comprehensive catalog with realistic data

### 📊 **Analytics Dashboard**
- **Interactive Charts** - 3 chart types using Chart.js
  - Doughnut Chart: Sales by Category
  - Line Chart: 6-month Revenue Trend
  - Bar Chart: Product Performance Comparison
- **Key Metrics** - 4 stat cards with trend indicators
- **Top Products Table** - Performance rankings
- **Mock Data** - Realistic business analytics

### ❤️ **Favorites/Wishlist System**
- **LocalStorage Integration** - Persistent favorites across sessions
- **CRUD Operations** - Add, remove, and manage favorites
- **Real-time Updates** - Dynamic UI updates
- **Empty State Design** - Beautiful placeholder messaging
- **Item Counter** - Live count of saved items

### 📚 **Document Library**
- **30+ Documents** - Organized technical documentation
- **Category Filtering** - Filter by product category
- **Document Type Filtering** - User Manuals, Spec Sheets, Warranties, etc.
- **Color-Coded Icons** - Visual document type identification
- **Search Functionality** - Find documents quickly
- **Download & View** - Multiple access options

### ℹ️ **About Page**
- **Project Overview** - Clear explanation of features
- **Tech Stack Display** - Comprehensive technology breakdown
- **Feature Cards** - 6 major capabilities highlighted
- **Project Statistics** - Key metrics and achievements
- **Portfolio Links** - Direct connection to developer

### 🚀 **Progressive Web App**
- **Offline-First** - Full functionality without internet
- **Installable** - Add to home screen (mobile/desktop)
- **Service Worker Caching** - Smart caching (V4)
- **Fast Loading** - Optimized performance
- **Responsive Icons** - Multiple sizes for all devices

### 🎨 **Modern UI/UX**
- **Gradient Design** - Professional blue gradient theme
- **Smooth Animations** - Micro-interactions throughout
- **Hover Effects** - Interactive card behaviors
- **Responsive Layout** - Mobile-first approach
- **Glass-morphism** - Modern backdrop blur effects
- **Typography** - System font stack for performance

---

## 🛠️ Technology Stack

### **Core Technologies**
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **Web Components** - Custom elements with Shadow DOM
- **CSS3** - Modern styling (Grid, Flexbox, Animations)
- **HTML5** - Semantic markup
- **JSON** - Data-driven architecture

### **Libraries & APIs**
- **Chart.js** - Data visualization
- **PDF.js** - Document viewing
- **LocalStorage API** - Persistent data
- **Service Worker API** - Offline functionality
- **Fetch API** - Asynchronous data loading

### **Features Implemented**
- ✅ State Management (Vanilla JS)
- ✅ Event-Driven Architecture
- ✅ Component-Based Design
- ✅ Filtering & Sorting Algorithms
- ✅ Real-time Search
- ✅ Modal System
- ✅ Responsive Design
- ✅ Browser History API
- ✅ Data Transformation

---

## 📁 Project Structure

```
sp-app/
├── assets/
│   ├── css/
│   │   ├── styles.css              # Main stylesheet
│   │   ├── cross-ref-style.css     # Table styling
│   │   └── globleStyles.css        # Global variables
│   ├── images/                     # Product images & icons
│   └── icons/                      # PWA icons (multiple sizes)
│
├── components/                     # Web Components
│   ├── modern-product-catalog.js   # E-commerce catalog
│   ├── modern-document-library.js  # Document system
│   ├── navbar.js                   # Bottom navigation
│   ├── document-viewer.js          # PDF viewer
│   ├── productGrid.js              # Grid view
│   ├── selectSeries.js             # Series selector
│   └── cross-reference-table.js    # Comparison table
│
├── data/                           # JSON Data
│   ├── products.json               # 60+ products, 5 categories
│   ├── documents.json              # 30+ documents
│   ├── competitors.json            # Brand list
│   └── cross-references.json       # Product comparisons
│
├── js/
│   ├── main.js                     # Core JavaScript
│   ├── router.js                   # URL routing
│   └── updatePrices.js             # Price utilities
│
├── pages/                          # HTML Pages
│   ├── products.html               # Product catalog
│   ├── productsgrid.html           # Grid view
│   ├── library.html                # Document library
│   ├── about.html                  # Project info
│   ├── analytics.html              # Dashboard
│   └── favorites.html              # Wishlist
│
├── index.html                      # Home page
├── manifest.json                   # PWA manifest
├── service-worker.js               # Offline support (V4)
└── README.md                       # This file
```

---

## 🎯 Features Demonstrated

### **PWA Excellence**
✅ Service Worker with smart caching  
✅ Offline-first architecture  
✅ Add to home screen capability  
✅ Standalone display mode  
✅ Responsive app icons (16px - 512px)  
✅ Cache versioning (V4)  

### **Development Skills**
✅ Vanilla JavaScript (ES6+)  
✅ Web Components & Shadow DOM  
✅ State Management  
✅ Event-Driven Architecture  
✅ Asynchronous Programming  
✅ Data Transformation  
✅ Browser APIs (Storage, History, Fetch)  
✅ Responsive CSS Design  
✅ Performance Optimization  

### **E-Commerce Features**
✅ Multi-criteria filtering  
✅ Real-time search  
✅ Sort functionality  
✅ Quick view modals  
✅ Shopping cart pattern  
✅ Product comparison  

### **Data Visualization**
✅ Chart.js integration  
✅ Interactive charts (3 types)  
✅ Real-time data updates  
✅ Responsive charts  
✅ Custom color schemes  

---

## 📦 Product Catalog

**5 Categories:**
- 💻 Laptops & Computers (16 models)
- 📱 Mobile Devices (15 models)
- 🎧 Audio Equipment (12 models)
- ⌨️ Accessories & Peripherals (12 models)
- 🏠 Smart Home & IoT (8 models)

**Total: 60+ Products** with realistic pricing, descriptions, and specifications.

---

## 🚀 Installation

### **Quick Start**

1. **Clone the repository**
```bash
git clone https://github.com/anthonyzaino88/TechVault.git
cd TechVault/sp-app
```

2. **Serve with a local server**

**Option A: Python**
```bash
python -m http.server 8000
```

**Option B: Node.js**
```bash
npx serve
```

**Option C: PHP**
```bash
php -S localhost:8000
```

**Option D: VS Code Live Server**
- Install Live Server extension
- Right-click `index.html` → "Open with Live Server"

3. **Open in browser**
```
http://localhost:8000
```

### **GitHub Pages Deployment**

1. Push to GitHub
2. Go to **Settings** → **Pages**
3. Select source: **main branch**
4. Set folder: **/ (root)**
5. Save and access via: `https://anthonyzaino88.github.io/TechVault/sp-app/`

**Important:** The `start_url` and base path are configured for GitHub Pages deployment.

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| iOS Safari | 14+ | ✅ Full Support |
| Chrome Mobile | Latest | ✅ Full Support |

---

## ⚡ Performance

- **First Load:** < 2s on 3G
- **Offline Load:** < 500ms
- **Lighthouse Scores:**
  - Performance: 95+
  - PWA: 100
  - Accessibility: 90+
  - Best Practices: 95+

---

## 📸 Screenshots

### Home Page
Modern grid layout with 6 main features

### Product Catalog
Advanced filtering, sorting, and search with 60+ products

### Analytics Dashboard
Interactive charts and data visualization

### Document Library
Organized documentation with filtering and search

### Favorites
Persistent wishlist with localStorage integration

---

## 🎨 Design System

### **Color Palette**
- Primary Blue: `#2563eb`
- Dark Blue: `#1e40af`
- Light Blue: `#3b82f6`
- Background: `#f5f7fa`
- Card Background: `#ffffff`

### **Typography**
- System Font Stack (performance optimized)
- Weights: 400 (regular), 600 (semi-bold), 700 (bold), 800 (extra-bold)

### **Animations**
- Transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Hover lift: translateY(-4px to -8px)
- Fade animations throughout

---

## 🔮 Future Enhancements

### Potential Features
- [ ] Backend API integration
- [ ] User authentication
- [ ] Shopping cart checkout flow
- [ ] Product reviews & ratings
- [ ] Image gallery/zoom
- [ ] Advanced analytics (more charts)
- [ ] Export data (CSV/PDF)
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Push notifications

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 👨‍💻 About This Project

### **Purpose**
This is a **portfolio demonstration project** showcasing modern web development skills, PWA capabilities, and e-commerce architecture. Originally built as an enterprise catalog application, it has been transformed into a comprehensive product catalog template.

### **What This Demonstrates**
- ✅ Production-grade code without frameworks
- ✅ Modern JavaScript (ES6+) expertise
- ✅ Progressive Web App best practices
- ✅ E-commerce feature implementation
- ✅ Data visualization skills
- ✅ Responsive design mastery
- ✅ Clean code architecture
- ✅ Performance optimization

### **Use Cases**
- Portfolio demonstration
- Learning PWA development
- E-commerce template
- Product catalog base
- Code reference for interviews

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome! Feel free to:
- Report issues
- Suggest features
- Fork and experiment
- Use as learning material

---

## 📫 Connect

**Portfolio:** [anthony-zaino-portfolio.vercel.app](https://anthony-zaino-portfolio.vercel.app/)  
**GitHub:** [@anthonyzaino88](https://github.com/anthonyzaino88)  
**LinkedIn:** [Connect on LinkedIn](https://linkedin.com/in/anthony-zaino)  
**Project Demo:** [Live TechVault Demo](https://anthonyzaino88.github.io/TechVault/sp-app/)

---

## 🙏 Acknowledgments

- Icons: SVG custom designs
- Charts: Chart.js library
- PDF Viewer: PDF.js
- Sample Images: Unsplash
- Inspiration: Modern e-commerce platforms

---

## ⭐ Show Your Support

If you found this project helpful or interesting, please consider:
- ⭐ Starring the repository
- 🍴 Forking for your own use
- 🐛 Reporting issues
- 💡 Suggesting improvements

---

**Built with ❤️ using Vanilla JavaScript, Web Components, and Modern Web Standards**

*No frameworks harmed in the making of this project* 🚀
