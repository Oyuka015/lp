// Category Pill Component
class CategoryPill extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['category-id', 'name', 'icon', 'active'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const categoryId = this.getAttribute('category-id') || '';
        const name = this.getAttribute('name') || '';
        const icon = this.getAttribute('icon') || '';
        const active = this.hasAttribute('active');

        this.shadowRoot.innerHTML = /*css */ `
            <style>
                .category-pill {
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    background: ${
                      active
                        ? "linear-gradient(135deg, #00D4FF, #0099CC)"
                        : "rgba(26,26,26,0.6)"
                    };
                    color: ${active ? "#fff" : "#B0B0B0"};
                }
            </style>

            <div class="category-pill">
                <span class="category-icon">${icon}</span>
                <span>${name}</span>
            </div>  
        `;
    }

    setupEventListeners() {
        this.shadowRoot
            .querySelector('.category-pill')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('category-selected', {
                        detail: { categoryId: this.getAttribute('category-id') },
                        bubbles: true,
                        composed: true
                    })
                );
            });
    }
}

customElements.define('category-pill', CategoryPill);
