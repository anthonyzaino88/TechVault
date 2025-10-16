class ProductGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        this.fetchProducts();
    }

    async fetchProducts() {
        try {
            const response = await fetch('../data/products.json');
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            this.shadowRoot.innerHTML = `<p>Error loading products.</p>`;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                }

                .hidden { 
                    display: none; 
                }

                .product-wrapper {
                    background: linear-gradient(135deg, #f5f7fa 0%, #e3e8ef 100%);
                    min-height: 100vh;
                    padding-bottom: 100px;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 24px;
                    padding: 24px;
                    margin-top: 7rem;
                    margin-bottom: 6rem;
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .product-listing {
                    cursor: pointer;
                    border: 1px solid rgba(37, 99, 235, 0.1);
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    padding: 0;
                    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
                    height: auto;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .product-listing::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.4s ease;
                }

                .product-listing:hover::before {
                    transform: scaleX(1);
                }

                .product-listing:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 12px 32px rgba(37, 99, 235, 0.25);
                    border-color: #2563eb;
                }

                .product-image-wrapper {
                    width: 100%;
                    height: 140px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(102, 126, 234, 0.03) 100%);
                    position: relative;
                    overflow: hidden;
                }

                .product-image-wrapper::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .product-listing:hover .product-image-wrapper::after {
                    opacity: 1;
                }

                .product-image {
                    width: 100%;
                    height: 100%;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    transition: transform 0.3s ease;
                    border-radius: 12px;
                    z-index: 1;
                }

                .product-listing:hover .product-image {
                    transform: scale(1.1);
                }

                .product-title {
                    padding: 16px 12px;
                    font-size: 15px;
                    font-weight: 600;
                    text-align: center;
                    background: white;
                    width: 100%;
                    color: #1e40af;
                    line-height: 1.3;
                    letter-spacing: 0.3px;
                    border-top: 1px solid rgba(37, 99, 235, 0.08);
                    transition: all 0.3s ease;
                }

                .product-listing:hover .product-title {
                    color: #2563eb;
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%);
                }

                .models-container {
                    margin-top: 8rem;
                }

                /* Add subtle animation on load */
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .product-listing {
                    animation: fadeInScale 0.4s ease-out backwards;
                }

                .product-listing:nth-child(1) { animation-delay: 0.05s; }
                .product-listing:nth-child(2) { animation-delay: 0.1s; }
                .product-listing:nth-child(3) { animation-delay: 0.15s; }
                .product-listing:nth-child(4) { animation-delay: 0.2s; }
                .product-listing:nth-child(5) { animation-delay: 0.25s; }
                .product-listing:nth-child(6) { animation-delay: 0.3s; }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .product-grid {
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                        gap: 16px;
                        padding: 16px;
                    }
                    
                    .product-image-wrapper {
                        height: 120px;
                    }
                }
            </style>
    
            <div class="product-wrapper">
                <div class="product-grid"></div>
            </div>
        `;
    }

    renderProducts(products) {
        const grid = this.shadowRoot.querySelector('.product-grid');
        products.forEach(product => {
            const productListing = document.createElement('div');
            productListing.className = 'product-listing';

            // Wrap image in container for better styling
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'product-image-wrapper';

            const productImage = document.createElement('div');
            productImage.className = 'product-image';
            productImage.style.backgroundImage = `url('${product.series[0]?.image}')`;
            imageWrapper.appendChild(productImage);
            productListing.appendChild(imageWrapper);

            const productTitle = document.createElement('div');
            productTitle.className = 'product-title';
            productTitle.textContent = product.name;
            productListing.appendChild(productTitle);

            productListing.onclick = () => {
                this.selectProduct(product);
                this.shadowRoot.querySelector('.product-wrapper').classList.add('hidden');
            };
            
            grid.appendChild(productListing);
        });
    }

    selectProduct(product) {
        console.log("Dispatching product-selected event for product:", product);
        this.dispatchEvent(new CustomEvent('product-selected', {
            detail: { product: product },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('product-grid', ProductGrid);
