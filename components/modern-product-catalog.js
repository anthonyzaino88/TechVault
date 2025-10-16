class ModernProductCatalog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.products = [];
        this.filteredProducts = [];
        this.selectedCategory = 'all';
        this.selectedPriceRange = 'all';
        this.sortBy = 'name';
        this.searchQuery = '';
    }

    connectedCallback() {
        this.render();
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            
            // Flatten the hierarchical structure into individual products
            this.products = this.flattenProducts(data);
            this.filteredProducts = [...this.products];
            
            // Add dynamic category filters
            this.addDynamicCategoryFilters();
            
            this.renderProducts();
            this.updateProductCount();
        } catch (error) {
            console.error('Failed to load products:', error);
            this.shadowRoot.querySelector('.product-grid').innerHTML = 
                '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Error loading products</p>';
        }
    }

    flattenProducts(categories) {
        const flattened = [];
        let productId = 1;

        categories.forEach(category => {
            category.series.forEach(series => {
                series.models.forEach(model => {
                    flattened.push({
                        id: productId++,
                        name: model.name,
                        fullName: `${category.name} - ${series.name} - ${model.name}`,
                        price: model.price || 'Contact for price',
                        priceValue: this.extractPriceValue(model.price),
                        image: model.image || series.image,
                        category: category.name,
                        categoryId: category.id,
                        series: series.name,
                        seriesId: series.id,
                        description: series.description,
                        specs: model.specs || [],
                        submittals: series.submittals || [],
                        otherDocs: series.otherDocs || []
                    });
                });
            });
        });

        return flattened;
    }

    extractPriceValue(priceString) {
        if (!priceString || typeof priceString !== 'string') return 0;
        const match = priceString.match(/[\d,]+/);
        return match ? parseInt(match[0].replace(/,/g, '')) : 0;
    }

    applyFilters() {
        let filtered = [...this.products];

        // Category filter
        if (this.selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.selectedCategory);
        }

        // Price range filter
        if (this.selectedPriceRange !== 'all') {
            const [min, max] = this.selectedPriceRange.split('-').map(Number);
            filtered = filtered.filter(p => {
                if (max) {
                    return p.priceValue >= min && p.priceValue <= max;
                } else {
                    return p.priceValue >= min;
                }
            });
        }

        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.series.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.fullName.toLowerCase().includes(query)
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            switch(this.sortBy) {
                case 'price-low':
                    return a.priceValue - b.priceValue;
                case 'price-high':
                    return b.priceValue - a.priceValue;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        this.filteredProducts = filtered;
        this.renderProducts();
        this.updateProductCount();
    }

    getUniqueCategories() {
        return [...new Set(this.products.map(p => p.category))];
    }

    renderProducts() {
        const grid = this.shadowRoot.querySelector('.product-grid');
        
        if (this.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <p style="font-size: 1.5rem; color: #64748b; margin-bottom: 1rem;">No products found</p>
                    <p style="color: #94a3b8;">Try adjusting your filters or search term</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="quick-view-overlay">
                        <button class="quick-view-btn" data-product-id="${product.id}">
                            👁️ Quick View
                        </button>
                    </div>
                    ${product.priceValue > 1500 ? '<span class="badge premium">Premium</span>' : ''}
                    ${product.priceValue < 100 ? '<span class="badge budget">Best Value</span>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-series">${product.series}</div>
                    <div class="product-footer">
                        <div class="product-price">${product.price}</div>
                        <a href="https://anthony-zaino-portfolio.vercel.app/" 
                           target="_blank" 
                           class="view-details-btn"
                           onclick="event.stopPropagation();">
                            👨‍💻 Dev
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners for quick view
        this.shadowRoot.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                this.showQuickView(productId);
            });
        });
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = this.shadowRoot.querySelector('.quick-view-modal');
        const modalContent = modal.querySelector('.modal-content-inner');
        
        modalContent.innerHTML = `
            <button class="modal-close">&times;</button>
            <div class="modal-product-layout">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-details">
                    <div class="modal-breadcrumb">${product.category} / ${product.series}</div>
                    <h2 class="modal-product-name">${product.name}</h2>
                    <div class="modal-product-price">${product.price}</div>
                    <div class="modal-product-description">
                        <p>${product.description}</p>
                    </div>
                    <div class="modal-actions">
                        <a href="https://anthony-zaino-portfolio.vercel.app/" 
                           target="_blank" 
                           class="modal-btn modal-btn-primary">
                            👨‍💻 View Developer Portfolio
                        </a>
                        <button class="modal-btn modal-btn-secondary" onclick="this.getRootNode().host.closeQuickView()">
                            Close
                        </button>
                    </div>
                    ${product.submittals && product.submittals.length > 0 ? `
                        <div class="modal-documents">
                            <h3>Documentation</h3>
                            <ul>
                                ${product.submittals.map(doc => `
                                    <li><a href="${doc.url}" target="_blank">📄 ${doc.type}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Close button handler
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeQuickView());
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeQuickView();
        });
    }

    closeQuickView() {
        const modal = this.shadowRoot.querySelector('.quick-view-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateProductCount() {
        const countEl = this.shadowRoot.querySelector('.product-count');
        if (countEl) {
            countEl.textContent = `${this.filteredProducts.length} Products`;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.getStyles()}
            <div class="catalog-container">
                <!-- Breadcrumb -->
                <div class="breadcrumb">
                    <a href="../index.html">🏠 Home</a>
                    <span class="breadcrumb-separator">/</span>
                    <span>Products</span>
                </div>

                <!-- Header -->
                <div class="catalog-header">
                    <div class="header-left">
                        <h1 class="catalog-title">Product Catalog</h1>
                        <div class="product-count">Loading...</div>
                    </div>
                    <div class="header-right">
                        <div class="search-box">
                            <input type="text" 
                                   class="search-input" 
                                   placeholder="🔍 Search products..."
                                   id="product-search">
                        </div>
                        <select class="sort-select" id="sort-select">
                            <option value="name">Sort: Name</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div class="catalog-layout">
                    <!-- Sidebar Filters -->
                    <aside class="filters-sidebar">
                        <div class="filter-section">
                            <h3 class="filter-title">Category</h3>
                            <div class="filter-options" id="category-filters">
                                <label class="filter-option">
                                    <input type="radio" name="category" value="all" checked>
                                    <span>All Categories</span>
                                </label>
                            </div>
                        </div>

                        <div class="filter-section">
                            <h3 class="filter-title">Price Range</h3>
                            <div class="filter-options" id="price-filters">
                                <label class="filter-option">
                                    <input type="radio" name="price" value="all" checked>
                                    <span>All Prices</span>
                                </label>
                                <label class="filter-option">
                                    <input type="radio" name="price" value="0-100">
                                    <span>Under $100</span>
                                </label>
                                <label class="filter-option">
                                    <input type="radio" name="price" value="100-500">
                                    <span>$100 - $500</span>
                                </label>
                                <label class="filter-option">
                                    <input type="radio" name="price" value="500-1500">
                                    <span>$500 - $1,500</span>
                                </label>
                                <label class="filter-option">
                                    <input type="radio" name="price" value="1500-99999">
                                    <span>$1,500+</span>
                                </label>
                            </div>
                        </div>

                        <button class="reset-filters-btn">Reset Filters</button>
                    </aside>

                    <!-- Product Grid -->
                    <main class="main-content">
                        <div class="product-grid">
                            <!-- Products will be rendered here -->
                        </div>
                    </main>
                </div>

                <!-- Quick View Modal -->
                <div class="quick-view-modal">
                    <div class="modal-content">
                        <div class="modal-content-inner">
                            <!-- Modal content will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Category filters
        this.shadowRoot.querySelectorAll('input[name="category"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.selectedCategory = e.target.value;
                this.applyFilters();
            });
        });

        // Price filters
        this.shadowRoot.querySelectorAll('input[name="price"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.selectedPriceRange = e.target.value;
                this.applyFilters();
            });
        });

        // Sort
        this.shadowRoot.querySelector('#sort-select').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // Search
        const searchInput = this.shadowRoot.querySelector('#product-search');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.applyFilters();
        });

        // Reset filters
        this.shadowRoot.querySelector('.reset-filters-btn').addEventListener('click', () => {
            this.selectedCategory = 'all';
            this.selectedPriceRange = 'all';
            this.sortBy = 'name';
            this.searchQuery = '';
            
            this.shadowRoot.querySelector('input[name="category"][value="all"]').checked = true;
            this.shadowRoot.querySelector('input[name="price"][value="all"]').checked = true;
            this.shadowRoot.querySelector('#sort-select').value = 'name';
            searchInput.value = '';
            
            this.applyFilters();
        });
    }

    // Add dynamic category filters after products load
    addDynamicCategoryFilters() {
        const categoryFilters = this.shadowRoot.querySelector('#category-filters');
        const categories = this.getUniqueCategories();
        
        // Keep "All Categories" and add specific ones
        const existingAll = categoryFilters.querySelector('label');
        categories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `
                <input type="radio" name="category" value="${category}">
                <span>${category}</span>
            `;
            categoryFilters.appendChild(label);
            
            // Add event listener
            label.querySelector('input').addEventListener('change', (e) => {
                this.selectedCategory = e.target.value;
                this.applyFilters();
            });
        });
    }

    getStyles() {
        return `
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                :host {
                    display: block;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .catalog-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 100px 20px 100px 20px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e3e8ef 100%);
                    min-height: 100vh;
                }

                /* Breadcrumb */
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    font-size: 14px;
                    color: #64748b;
                }

                .breadcrumb a {
                    color: #2563eb;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .breadcrumb a:hover {
                    color: #1e40af;
                }

                .breadcrumb-separator {
                    color: #cbd5e1;
                }

                /* Header */
                .catalog-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    gap: 20px;
                    flex-wrap: wrap;
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                }

                .header-left {
                    display: flex;
                    align-items: baseline;
                    gap: 16px;
                }

                .catalog-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .product-count {
                    font-size: 1rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .header-right {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .search-box {
                    position: relative;
                }

                .search-input {
                    padding: 12px 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 14px;
                    width: 280px;
                    transition: all 0.3s;
                    background: #f8fafc;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #2563eb;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .sort-select {
                    padding: 12px 20px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 14px;
                    background: #f8fafc;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .sort-select:focus {
                    outline: none;
                    border-color: #2563eb;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                /* Layout */
                .catalog-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 24px;
                }

                /* Sidebar */
                .filters-sidebar {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    height: fit-content;
                    position: sticky;
                    top: 100px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                }

                .filter-section {
                    margin-bottom: 28px;
                    padding-bottom: 28px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .filter-section:last-of-type {
                    border-bottom: none;
                    margin-bottom: 20px;
                }

                .filter-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .filter-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .filter-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: background 0.2s;
                }

                .filter-option:hover {
                    background: #f8fafc;
                }

                .filter-option input[type="radio"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    accent-color: #2563eb;
                }

                .filter-option span {
                    font-size: 14px;
                    color: #475569;
                    font-weight: 500;
                }

                .reset-filters-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .reset-filters-btn:hover {
                    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
                    transform: translateY(-1px);
                }

                /* Product Grid */
                .main-content {
                    background: transparent;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 24px;
                }

                /* Product Card */
                .product-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(37, 99, 235, 0.08);
                    animation: fadeInUp 0.4s ease-out backwards;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 32px rgba(37, 99, 235, 0.2);
                    border-color: #2563eb;
                }

                .product-image-container {
                    position: relative;
                    width: 100%;
                    height: 260px;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    padding: 20px;
                    transition: transform 0.3s;
                }

                .product-card:hover .product-image {
                    transform: scale(1.08);
                }

                .quick-view-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(37, 99, 235, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .product-card:hover .quick-view-overlay {
                    opacity: 1;
                }

                .quick-view-btn {
                    padding: 12px 24px;
                    background: white;
                    color: #2563eb;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                }

                .quick-view-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
                }

                .badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .badge.premium {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                }

                .badge.budget {
                    background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
                    color: white;
                }

                .product-info {
                    padding: 20px;
                }

                .product-category {
                    font-size: 12px;
                    color: #2563eb;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }

                .product-name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }

                .product-series {
                    font-size: 13px;
                    color: #64748b;
                    margin-bottom: 16px;
                }

                .product-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #e2e8f0;
                }

                .product-price {
                    font-size: 20px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .view-details-btn {
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
                }

                .view-details-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
                }

                /* Quick View Modal */
                .quick-view-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s;
                    padding: 20px;
                }

                .quick-view-modal.active {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-content {
                    background: white;
                    border-radius: 20px;
                    max-width: 900px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    transform: scale(0.9);
                    transition: transform 0.3s;
                }

                .quick-view-modal.active .modal-content {
                    transform: scale(1);
                }

                .modal-content-inner {
                    padding: 40px;
                    position: relative;
                }

                .modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #f1f5f9;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    z-index: 10;
                }

                .modal-close:hover {
                    background: #e2e8f0;
                    transform: rotate(90deg);
                }

                .modal-product-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                }

                .modal-product-image img {
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                }

                .modal-breadcrumb {
                    font-size: 13px;
                    color: #2563eb;
                    font-weight: 600;
                    margin-bottom: 12px;
                }

                .modal-product-name {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 16px;
                }

                .modal-product-price {
                    font-size: 32px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 24px;
                }

                .modal-product-description {
                    color: #475569;
                    line-height: 1.7;
                    margin-bottom: 32px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .modal-btn {
                    flex: 1;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-btn-primary {
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    color: white;
                    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
                }

                .modal-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(37, 99, 235, 0.4);
                }

                .modal-btn-secondary {
                    background: #f1f5f9;
                    color: #475569;
                }

                .modal-btn-secondary:hover {
                    background: #e2e8f0;
                }

                .modal-documents {
                    margin-top: 24px;
                }

                .modal-documents h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 12px;
                }

                .modal-documents ul {
                    list-style: none;
                }

                .modal-documents li {
                    margin-bottom: 8px;
                }

                .modal-documents a {
                    color: #2563eb;
                    text-decoration: none;
                    font-size: 14px;
                    transition: color 0.2s;
                }

                .modal-documents a:hover {
                    color: #1e40af;
                    text-decoration: underline;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .catalog-layout {
                        grid-template-columns: 1fr;
                    }

                    .filters-sidebar {
                        position: static;
                    }

                    .product-grid {
                        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    }

                    .modal-product-layout {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .catalog-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .header-left {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .header-right {
                        flex-direction: column;
                    }

                    .search-input {
                        width: 100%;
                    }

                    .product-grid {
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 16px;
                    }

                    .modal-content-inner {
                        padding: 24px;
                    }
                }
            </style>
        `;
    }
}

customElements.define('modern-product-catalog', ModernProductCatalog);

