// Verify script loading
console.log('popup.js loaded');

// Storage key
const STORAGE_KEY = 'ksbcl_indent_data';

// Wait for DOM to be ready before accessing elements
function initializePopup() {
    // Get DOM elements AFTER they're available
    const productSelect = document.getElementById('product-select');
    const quantitySelect = document.getElementById('quantity-select');
    const saveBtn = document.getElementById('save-btn');
    const successMsg = document.getElementById('success-msg');

    // Check if elements exist
    if (!productSelect || !quantitySelect || !saveBtn) {
        console.error('❌ DOM elements not found. Retrying...');
        setTimeout(initializePopup, 100);
        return;
    }

    console.log('✅ DOM elements found, initializing popup...');

    /**
     * Load saved data from extension storage when popup opens
     */
    function loadSavedData() {
        chrome.storage.local.get(['ksbcl_indent_data'], (result) => {
            const data = result.ksbcl_indent_data;
            if (data) {
                productSelect.value = data.product || '';
                quantitySelect.value = data.quantity || '';
                console.log('✅ Loaded product/quantity from chrome.storage.local:', data);
            } else {
                console.log('ℹ️ No saved data found in chrome.storage.local');
            }
        });
    }

    /**
     * Save current selections to extension storage
     */
    function saveData() {
        const product = productSelect.value;
        const quantity = quantitySelect.value;

        console.log('Attempting to save - Product:', product, 'Quantity:', quantity);

        if (!product || !quantity) {
            alert('❌ Please select both a product and quantity');
            return;
        }

        const data = {
            product: product,
            quantity: quantity,
            savedAt: new Date().toISOString()
        };

        chrome.storage.local.set({ ksbcl_indent_data: data }, () => {
            if (chrome.runtime.lastError) {
                console.error('❌ chrome.storage.local.set error:', chrome.runtime.lastError);
                alert('Failed to save data: ' + chrome.runtime.lastError.message);
                return;
            }
            console.log('✅ Data saved successfully to chrome.storage.local:', data);

            if (successMsg) {
                successMsg.classList.add('show');
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 1500);
            }

            // Auto-close popup after save
            setTimeout(() => window.close(), 600);
        });

        // Also keep a copy in localStorage for debugging (optional)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('⚠️ localStorage write failed (not required):', error);
        }
    }

    // Attach event listeners
    saveBtn.addEventListener('click', (e) => {
        console.log('💾 Save button clicked');
        e.preventDefault();
        saveData();
    });

    // Load data when popup opens
    loadSavedData();

    console.log('✅ Popup initialized successfully');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePopup);
} else {
    // DOM already loaded
    setTimeout(initializePopup, 0);
}

// Note: getIndentData is now asynchronous if you want the latest storage values.
function getIndentData(callback) {
    chrome.storage.local.get(['ksbcl_indent_data'], (result) => {
        const data = result.ksbcl_indent_data;
        if (data) {
            callback({
                product: data.product || 'DK Double Kick Fine Whisky-Aseptic Brick Pack 180MLx48ABP(0022)',
                quantity: data.quantity || '22'
            });
        } else {
            callback({
                product: 'DK Double Kick Fine Whisky-Aseptic Brick Pack 180MLx48ABP(0022)',
                quantity: '22'
            });
        }
    });
}