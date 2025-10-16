class ModernDocumentLibrary extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.documents = [];
        this.filteredDocuments = [];
        this.selectedCategory = 'all';
        this.selectedType = 'all';
        this.searchQuery = '';
    }

    connectedCallback() {
        this.render();
        this.loadDocuments();
    }

    async loadDocuments() {
        try {
            const response = await fetch('../data/documents.json');
            const data = await response.json();
            
            // Flatten documents structure
            this.documents = this.flattenDocuments(data);
            this.filteredDocuments = [...this.documents];
            
            this.addDynamicCategoryFilters();
            this.renderDocuments();
            this.updateDocumentCount();
        } catch (error) {
            console.error('Failed to load documents:', error);
            this.shadowRoot.querySelector('.document-grid').innerHTML = 
                '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Error loading documents</p>';
        }
    }

    flattenDocuments(data) {
        const flattened = [];
        let docId = 1;

        data.forEach(category => {
            category.documents.forEach(doc => {
                flattened.push({
                    id: docId++,
                    title: doc.title,
                    type: doc.type,
                    category: category.category,
                    categoryId: category.id,
                    url: doc.url,
                    description: doc.description || `${doc.type} for ${category.category}`,
                    icon: this.getDocIcon(doc.type),
                    color: this.getDocColor(doc.type)
                });
            });
        });

        return flattened;
    }

    getDocIcon(type) {
        const icons = {
            'User Manual': '📖',
            'Spec Sheet': '📋',
            'Warranty Info': '🛡️',
            'Installation Guide': '🔧',
            'Quick Start': '⚡',
            'Technical Specifications': '📊',
            'Datasheet': '📄'
        };
        return icons[type] || '📄';
    }

    getDocColor(type) {
        const colors = {
            'User Manual': '#3b82f6',
            'Spec Sheet': '#8b5cf6',
            'Warranty Info': '#10b981',
            'Installation Guide': '#f59e0b',
            'Quick Start': '#ef4444',
            'Technical Specifications': '#06b6d4',
            'Datasheet': '#6366f1'
        };
        return colors[type] || '#2563eb';
    }

    applyFilters() {
        let filtered = [...this.documents];

        // Category filter
        if (this.selectedCategory !== 'all') {
            filtered = filtered.filter(d => d.category === this.selectedCategory);
        }

        // Type filter
        if (this.selectedType !== 'all') {
            filtered = filtered.filter(d => d.type === this.selectedType);
        }

        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(d => 
                d.title.toLowerCase().includes(query) ||
                d.category.toLowerCase().includes(query) ||
                d.type.toLowerCase().includes(query) ||
                d.description.toLowerCase().includes(query)
            );
        }

        // Sort by category, then by type
        filtered.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.type.localeCompare(b.type);
        });

        this.filteredDocuments = filtered;
        this.renderDocuments();
        this.updateDocumentCount();
    }

    getUniqueCategories() {
        return [...new Set(this.documents.map(d => d.category))];
    }

    getUniqueTypes() {
        return [...new Set(this.documents.map(d => d.type))];
    }

    renderDocuments() {
        const grid = this.shadowRoot.querySelector('.document-grid');
        
        if (this.filteredDocuments.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <p style="font-size: 1.5rem; color: #64748b; margin-bottom: 1rem;">No documents found</p>
                    <p style="color: #94a3b8;">Try adjusting your filters or search term</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredDocuments.map(doc => `
            <div class="document-card" data-doc-id="${doc.id}">
                <div class="doc-icon-container" style="background: ${doc.color}20;">
                    <div class="doc-icon">${doc.icon}</div>
                    <div class="doc-type-badge" style="background: ${doc.color};">${doc.type}</div>
                </div>
                <div class="doc-info">
                    <div class="doc-category">${doc.category}</div>
                    <h3 class="doc-title">${doc.title}</h3>
                    <p class="doc-description">${doc.description}</p>
                    <div class="doc-actions">
                        <a href="${doc.url}" 
                           target="_blank" 
                           class="view-doc-btn"
                           style="background: linear-gradient(135deg, ${doc.color} 0%, ${doc.color}dd 100%);"
                           onclick="event.stopPropagation();">
                            📄 View Document
                        </a>
                        <a href="${doc.url}" 
                           download 
                           class="download-doc-btn"
                           onclick="event.stopPropagation();">
                            ⬇️ Download
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateDocumentCount() {
        const countEl = this.shadowRoot.querySelector('.document-count');
        if (countEl) {
            countEl.textContent = `${this.filteredDocuments.length} Documents`;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.getStyles()}
            <div class="library-container">
                <!-- Breadcrumb -->
                <div class="breadcrumb">
                    <a href="../index.html">🏠 Home</a>
                    <span class="breadcrumb-separator">/</span>
                    <span>Document Library</span>
                </div>

                <!-- Header -->
                <div class="library-header">
                    <div class="header-left">
                        <h1 class="library-title">📚 Document Library</h1>
                        <div class="document-count">Loading...</div>
                    </div>
                    <div class="header-right">
                        <div class="search-box">
                            <input type="text" 
                                   class="search-input" 
                                   placeholder="🔍 Search documents..."
                                   id="document-search">
                        </div>
                    </div>
                </div>

                <div class="library-layout">
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
                            <h3 class="filter-title">Document Type</h3>
                            <div class="filter-options" id="type-filters">
                                <label class="filter-option">
                                    <input type="radio" name="type" value="all" checked>
                                    <span>All Types</span>
                                </label>
                            </div>
                        </div>

                        <button class="reset-filters-btn">Reset Filters</button>
                    </aside>

                    <!-- Document Grid -->
                    <main class="main-content">
                        <div class="document-grid">
                            <!-- Documents will be rendered here -->
                        </div>
                    </main>
                </div>
            </div>
        `;

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

        // Type filters
        this.shadowRoot.querySelectorAll('input[name="type"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.selectedType = e.target.value;
                this.applyFilters();
            });
        });

        // Search
        const searchInput = this.shadowRoot.querySelector('#document-search');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.applyFilters();
        });

        // Reset filters
        this.shadowRoot.querySelector('.reset-filters-btn').addEventListener('click', () => {
            this.selectedCategory = 'all';
            this.selectedType = 'all';
            this.searchQuery = '';
            
            this.shadowRoot.querySelector('input[name="category"][value="all"]').checked = true;
            this.shadowRoot.querySelector('input[name="type"][value="all"]').checked = true;
            searchInput.value = '';
            
            this.applyFilters();
        });
    }

    addDynamicCategoryFilters() {
        const categoryFilters = this.shadowRoot.querySelector('#category-filters');
        const categories = this.getUniqueCategories();
        
        categories.forEach(category => {
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `
                <input type="radio" name="category" value="${category}">
                <span>${category}</span>
            `;
            categoryFilters.appendChild(label);
            
            label.querySelector('input').addEventListener('change', (e) => {
                this.selectedCategory = e.target.value;
                this.applyFilters();
            });
        });

        // Add dynamic type filters
        const typeFilters = this.shadowRoot.querySelector('#type-filters');
        const types = this.getUniqueTypes();
        
        types.forEach(type => {
            const label = document.createElement('label');
            label.className = 'filter-option';
            label.innerHTML = `
                <input type="radio" name="type" value="${type}">
                <span>${type}</span>
            `;
            typeFilters.appendChild(label);
            
            label.querySelector('input').addEventListener('change', (e) => {
                this.selectedType = e.target.value;
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

                .library-container {
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
                .library-header {
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

                .library-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e293b;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .document-count {
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
                    width: 320px;
                    transition: all 0.3s;
                    background: #f8fafc;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #2563eb;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                /* Layout */
                .library-layout {
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
                    max-height: 300px;
                    overflow-y: auto;
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

                /* Document Grid */
                .main-content {
                    background: transparent;
                }

                .document-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                }

                /* Document Card */
                .document-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                    border: 1px solid rgba(37, 99, 235, 0.08);
                    display: flex;
                    flex-direction: column;
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

                .document-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
                }

                .doc-icon-container {
                    position: relative;
                    padding: 40px 20px 20px 20px;
                    text-align: center;
                    border-bottom: 1px solid #e2e8f0;
                }

                .doc-icon {
                    font-size: 64px;
                    margin-bottom: 12px;
                }

                .doc-type-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 20px;
                    color: white;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .doc-info {
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .doc-category {
                    font-size: 12px;
                    color: #2563eb;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }

                .doc-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 12px;
                    line-height: 1.3;
                }

                .doc-description {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    flex: 1;
                }

                .doc-actions {
                    display: flex;
                    gap: 8px;
                }

                .view-doc-btn,
                .download-doc-btn {
                    flex: 1;
                    padding: 12px 16px;
                    border-radius: 10px;
                    text-decoration: none;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .view-doc-btn {
                    color: white;
                    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
                }

                .view-doc-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
                }

                .download-doc-btn {
                    background: #f1f5f9;
                    color: #475569;
                }

                .download-doc-btn:hover {
                    background: #e2e8f0;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .library-layout {
                        grid-template-columns: 1fr;
                    }

                    .filters-sidebar {
                        position: static;
                    }

                    .document-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .library-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .header-left {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .search-input {
                        width: 100%;
                    }

                    .document-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                }
            </style>
        `;
    }
}

customElements.define('modern-document-library', ModernDocumentLibrary);

