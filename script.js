const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 2499,
        image: "images/headphones.jpg"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 3999,
        image: "images/smartwatch.jpg"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "clothing",
        price: 2999,
        image: "images/runningshoes.jpg"
    },
    {
        id: 4,
        name: "Cotton T-Shirt",
        category: "clothing",
        price: 799,
        image: "images/cottonTshirt.jpg"
    },
    {
        id: 5,
        name: "Backpack",
        category: "accessories",
        price: 1499,
        image: "images/backpack.jpg"
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "accessories",
        price: 999,
        image: "images/sunglasses.jpg"
    },
    {
        id: 7,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 1799,
        image: "images/speakers.jpg"
    },
    {
        id: 8,
        name: "Baseball Cap",
        category: "clothing",
        price: 599,
        image: "images/baseballcap.jpg"
    }
];

let cart = [];
let discountPercent = 0;

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function displayProducts() {
    let filtered = [...products];

    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sort = sortSelect.value;

    if (search) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(search)
        );
    }

    if (category !== "all") {
        filtered = filtered.filter(product => product.category === category);
    }

    if (sort === "priceLow") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHigh") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    productsContainer.innerHTML = "";

    if (filtered.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    filtered.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="category">${product.category}</div>
                <h3>${product.name}</h3>
                <div class="price">${formatPrice(product.price)}</div>
                <button class="add-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        const product = products.find(item => item.id === productId);
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-info">
                    <strong>${item.name}</strong>
                    <p>${formatPrice(item.price)} × ${item.quantity}</p>
                </div>

                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <strong>${formatPrice(item.price * item.quantity)}</strong>

                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `).join("");
    }

    calculateTotal();
}

function calculateTotal() {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const discountAmount = subtotal * discountPercent / 100;
    const total = subtotal - discountAmount;

    document.getElementById("subtotal").textContent = formatPrice(subtotal);
    document.getElementById("discount").textContent = formatPrice(discountAmount);
    document.getElementById("total").textContent = formatPrice(total);
}

document.getElementById("couponBtn").addEventListener("click", () => {
    const coupon = document.getElementById("couponInput").value.trim().toUpperCase();
    const message = document.getElementById("couponMessage");

    if (coupon === "SAVE10") {
        discountPercent = 10;
        message.textContent = "Coupon applied! You saved 10%.";
        message.style.color = "green";
    } else if (coupon === "") {
        discountPercent = 0;
        message.textContent = "Please enter a coupon code.";
        message.style.color = "red";
    } else {
        discountPercent = 0;
        message.textContent = "Invalid coupon code.";
        message.style.color = "red";
    }

    calculateTotal();
});

document.getElementById("cartBtn").addEventListener("click", () => {
    document.getElementById("cartModal").classList.remove("hidden");
    updateCart();
});

document.getElementById("closeCart").addEventListener("click", () => {
    document.getElementById("cartModal").classList.add("hidden");
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    document.getElementById("cartModal").classList.add("hidden");
    document.getElementById("checkoutModal").classList.remove("hidden");
});

document.getElementById("closeCheckout").addEventListener("click", () => {
    document.getElementById("checkoutModal").classList.add("hidden");
});

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();

    document.getElementById("orderMessage").textContent =
        "Order placed successfully! Thank you for shopping with us.";
    document.getElementById("orderMessage").style.color = "green";

    cart = [];
    discountPercent = 0;
    updateCart();
    event.target.reset();
});

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);
sortSelect.addEventListener("change", displayProducts);

displayProducts();
updateCart();
