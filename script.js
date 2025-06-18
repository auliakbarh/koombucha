// Product data
const PRODUCTS = [
    {
        id: 1,
        name: "Original 250mL",
        price: 17000,
        description: "Kombucha klasik dengan rasa asli yang menyegarkan. Sempurna untuk pemula yang ingin mencoba kombucha."
    },
    {
        id: 2,
        name: "Original 1L",
        price: 68000,
        description: "Kombucha klasik dalam kemasan besar. Hemat dan cocok untuk keluarga."
    },
    {
        id: 3,
        name: "Cinnamon & Cloves 250mL",
        price: 20000,
        description: "Perpaduan hangat kayu manis dan cengkeh yang memberikan sensasi rasa eksotis."
    },
    {
        id: 4,
        name: "Cinnamon & Cloves 1L",
        price: 75000,
        description: "Varian rempah dalam kemasan besar dengan aroma yang menggugah selera."
    },
    {
        id: 5,
        name: "Peppermint 250mL",
        price: 24000,
        description: "Kesegaran mint yang menyejukkan, sempurna untuk cuaca panas Medan."
    },
    {
        id: 6,
        name: "Peppermint 1L",
        price: 85000,
        description: "Sensasi dingin peppermint dalam kemasan besar untuk kesegaran sepanjang hari."
    },
    {
        id: 7,
        name: "Apple Cinnamon Mint 250mL",
        price: 28000,
        description: "Kombinasi unik apel, kayu manis, dan mint yang memberikan rasa kompleks dan menyegarkan."
    },
    {
        id: 8,
        name: "Apple Cinnamon Mint 1L",
        price: 100000,
        description: "Varian premium dengan tiga rasa harmonis dalam kemasan besar."
    },
    {
        id: 9,
        name: "Coffee Kombucha 250mL",
        price: 20000,
        description: "Inovasi unik perpaduan kombucha dengan kopi untuk pecinta kopi yang ingin sehat."
    },
    {
        id: 10,
        name: "Coffee Kombucha 1L",
        price: 80000,
        description: "Energi kopi dengan manfaat kombucha dalam kemasan besar."
    },
    {
        id: 11,
        name: "SCOBY Starter 250mL",
        price: 24000,
        description: "Starter SCOBY untuk Anda yang ingin membuat kombucha sendiri di rumah."
    }
];

// Cart state
let CART = [];
let isPartner = false;

// Check for partner parameter
function checkPartnerStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const partner = urlParams.get('partner');
    isPartner = partner === 'soesun';

    if (isPartner) {
        document.getElementById('partnerNotice').style.display = 'block';
    }
}

// Calculate discounted price
function getDiscountedPrice(originalPrice) {
    return isPartner ? Math.round(originalPrice * 0.5882) : originalPrice; // 41.18% discount
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    PRODUCTS.forEach(product => {
        const originalPrice = product.price;
        const discountedPrice = getDiscountedPrice(originalPrice);
        const hasDiscount = isPartner && discountedPrice < originalPrice;

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image"></div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-pricing">
                <span class="product-price">${formatCurrency(discountedPrice)}</span>
                ${hasDiscount ? `
                    <span class="product-original-price">${formatCurrency(originalPrice)}</span>
                    <span class="product-discount">-41%</span>
                ` : ''}
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Tambah ke Keranjang
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const existingItem = CART.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        CART.push({
            id: product.id,
            name: product.name,
            price: getDiscountedPrice(product.price),
            quantity: 1
        });
    }

    updateCartUI();

    // Add visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Ditambahkan!';
    button.style.background = '#48bb78';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1000);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = CART.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    if (CART.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Keranjang kosong</div>';
    } else {
        cartItems.innerHTML = CART.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = CART.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: ${formatCurrency(total)}`;

    // Update order button
    const orderButton = document.querySelector('.order-button');
    orderButton.disabled = CART.length === 0;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = CART.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            CART = CART.filter(cartItem => cartItem.id !== productId);
        }
        updateCartUI();
    }
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');

    // Prevent body scroll when cart is open
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Send WhatsApp order
function sendWhatsAppOrder() {
    if (CART.length === 0) return;

    const phoneNumber = '6285161831593';
    const total = CART.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let message = `Halo! Saya ingin memesan kombucha:\n\n`;

    CART.forEach(item => {
        message += `• ${item.name} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}\n`;
    });

    message += `\n*Total: ${formatCurrency(total)}*\n\n`;
    message += `Mohon konfirmasi ketersediaan dan waktu pengiriman. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    // Clear cart after order
    CART = [];
    updateCartUI();
    toggleCart();
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    });

    // Initialize
    checkPartnerStatus();
    renderProducts();
    updateCartUI();

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartIcon = document.querySelector('.cart-icon');

        if (cartSidebar.classList.contains('open') &&
            !cartSidebar.contains(e.target) &&
            !cartIcon.contains(e.target)) {
            toggleCart();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar.classList.contains('open')) {
                toggleCart();
            }
        }
    });
});

// Add loading animation for products
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
