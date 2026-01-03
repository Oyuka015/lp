// Search Bar Component for FoodRush App
class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.searchTimeout = null;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --bg-primary: #0A0A0A;
                    --bg-secondary: #1A1A1A;
                    --accent-primary: #00D4FF;
                    --accent-secondary: #FF006B;
                    --text-primary: #FFFFFF;
                    --text-secondary: #B0B0B0;
                    --font-body: 'Inter', sans-serif;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .search-container {
                    position: relative;
                    width: 100%;
                }

                .search-input {
                    width: 100%;
                    padding: 16px 50px 16px 50px;
                    background: rgba(26, 26, 26, 0.8);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-family: var(--font-body);
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
                }

                .search-input::placeholder {
                    color: var(--text-secondary);
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: var(--text-secondary);
                    pointer-events: none;
                }

                .clear-search {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: none;
                    transition: all 0.3s ease;
                    border: none;
                    background: none;
                    font-size: 16px;
                }

                .clear-search:hover {
                    color: var(--accent-secondary);
                    transform: translateY(-50%) scale(1.1);
                }

                .clear-search.show {
                    display: block;
                }

                /* Search suggestions dropdown */
                .search-suggestions {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(26, 26, 26, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 8px;
                    margin-top: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    display: none;
                    z-index: 1000;
                }

                .search-suggestions.show {
                    display: block;
                }

                .suggestion-item {
                    padding: 12px 16px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .suggestion-item:last-child {
                    border-bottom: none;
                }

                .suggestion-item:hover {
                    background: rgba(0, 212, 255, 0.1);
                    color: var(--accent-primary);
                }

                .suggestion-highlight {
                    color: var(--accent-primary);
                    font-weight: 600;
                }

                /* Loading indicator */
                .search-loading {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    border: 2px solid transparent;
                    border-radius: 50%;
                    border-top-color: var(--accent-primary);
                    animation: spin 1s ease-in-out infinite;
                    display: none;
                }

                @keyframes spin {
                    to { transform: translateY(-50%) rotate(360deg); }
                }

                .search-loading.show {
                    display: block;
                }
            </style>
            
            <div class="search-container">
                <div class="search-icon">🔍</div>
                <input type="text" class="search-input" id="search-input" placeholder="Search for food, restaurant, or cuisine...">
                <div class="search-loading" id="search-loading"></div>
                <button class="clear-search" id="clear-search">✕</button>
                
                <div class="search-suggestions" id="search-suggestions">
                    <!-- Suggestions will be dynamically loaded -->
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const searchInput = this.shadowRoot.getElementById('search-input');
        const clearSearch = this.shadowRoot.getElementById('clear-search');
        const searchSuggestions = this.shadowRoot.getElementById('search-suggestions');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });

        searchInput.addEventListener('blur', () => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => this.hideSuggestions(), 200);
        });

        clearSearch.addEventListener('click', () => {
            this.clearSearch();
        });

        // Handle suggestion clicks
        searchSuggestions.addEventListener('click', (e) => {
            const suggestion = e.target.closest('.suggestion-item');
            if (suggestion) {
                const text = suggestion.dataset.value;
                this.selectSuggestion(text);
            }
        });

        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    handleSearch(query) {
        const clearSearch = this.shadowRoot.getElementById('clear-search');
        
        if (query.trim()) {
            clearSearch.classList.add('show');
        } else {
            clearSearch.classList.remove('show');
        }

        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);

        // Dispatch search event
        this.dispatchEvent(new CustomEvent('search-input', {
            detail: { query },
            bubbles: true,
            composed: true
        }));
    }

    performSearch(query) {
        if (!window.foodRushApp || !query.trim()) {
            this.hideSuggestions();
            return;
        }

        // Show loading
        this.showLoading();

        // Simulate search delay
        setTimeout(() => {
            const results = window.foodRushApp.searchFoods(query);
            this.showSearchSuggestions(results, query);
            this.hideLoading();
        }, 500);
    }

    showSearchSuggestions(results, query) {
        const suggestions = this.shadowRoot.getElementById('search-suggestions');
        
        if (results.length === 0) {
            suggestions.innerHTML = '<div class="suggestion-item">No results found</div>';
        } else {
            suggestions.innerHTML = results.slice(0, 5).map(food => {
                const highlightedName = this.highlightMatch(food.name, query);
                return `
                    <div class="suggestion-item" data-value="${food.name}">
                        <span>${highlightedName}</span> - 
                        <span style="color: var(--text-secondary);">${food.restaurant}</span>
                    </div>
                `;
            }).join('');
        }

        suggestions.classList.add('show');
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
    }

    selectSuggestion(text) {
        const searchInput = this.shadowRoot.getElementById('search-input');
        searchInput.value = text;
        this.hideSuggestions();
        
        // Trigger search with selected suggestion
        this.performSearch(text);
    }

    clearSearch() {
        const searchInput = this.shadowRoot.getElementById('search-input');
        const clearSearch = this.shadowRoot.getElementById('clear-search');
        
        searchInput.value = '';
        clearSearch.classList.remove('show');
        this.hideSuggestions();
        
        // Trigger empty search
        this.performSearch('');
    }

    showSuggestions() {
        const input = this.shadowRoot.getElementById('search-input').value;
        if (input.trim()) {
            this.showSearchSuggestions([], input);
        }
    }

    hideSuggestions() {
        const suggestions = this.shadowRoot.getElementById('search-suggestions');
        suggestions.classList.remove('show');
    }

    showLoading() {
        const loading = this.shadowRoot.getElementById('search-loading');
        loading.classList.add('show');
    }

    hideLoading() {
        const loading = this.shadowRoot.getElementById('search-loading');
        loading.classList.remove('show');
    }

    handleKeyboardNavigation(e) {
        const suggestions = this.shadowRoot.getElementById('search-suggestions');
        const items = suggestions.querySelectorAll('.suggestion-item');
        const activeItem = suggestions.querySelector('.suggestion-item:hover');
        
        if (!suggestions.classList.contains('show') || items.length === 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestions('down', items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestions('up', items);
                break;
            case 'Enter':
                e.preventDefault();
                if (activeItem) {
                    const text = activeItem.dataset.value;
                    this.selectSuggestion(text);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    navigateSuggestions(direction, items) {
        const currentIndex = Array.from(items).findIndex(item => 
            item.matches(':hover')
        );

        let nextIndex;
        if (direction === 'down') {
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }

        items[nextIndex].dispatchEvent(new Event('mouseenter'));
    }

    // Public method to get current search query
    getValue() {
        return this.shadowRoot.getElementById('search-input').value;
    }

    // Public method to set search query
    setValue(value) {
        const searchInput = this.shadowRoot.getElementById('search-input');
        searchInput.value = value;
        this.handleSearch(value);
    }

    // Public method to focus search input
    focus() {
        this.shadowRoot.getElementById('search-input').focus();
    }
}

// Register the component
customElements.define('search-bar', SearchBar);