const API_BASE = window.location.origin;
const RAZORPAY_KEY_ID = window.RAZORPAY_KEY_ID || "rzp_test_placeholder";

let products = [];
let cart = JSON.parse(localStorage.getItem("croshara_cart") || "[]");
let currentCheckoutItems = [];

const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartModal = document.getElementById("cartModal");

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartUI();
  setupNavbar();
  setupScrollReveal();
  setupFAQ();
  setupHeroParticles();
  setupMobileMenu();
  setupSmoothScroll();

  document.getElementById("cartToggle")?.addEventListener("click", openCart);
  document.getElementById("cartClose")?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);
});

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    const data = await res.json();
    products = data.products;
    renderProducts();
  } catch {
    console.warn("API unavailable, using fallback products");
    products = [
      { id: "newborn-set", name: "Newborn Wool Booties", price: 599, originalPrice: 799, sizes: ["0-3mo", "3-6mo"], colors: ["Blush Pink", "Mint Green", "Cream", "Navy Blue", "Grey", "Walnut Brown"], description: "Ultra-soft pure wool booties for delicate newborn feet.", features: ["100% Natural Wool", "Barefoot Sole", "Handmade", "Zero Chemicals"], inStock: true },
      { id: "infant-set", name: "Infant Wool Booties", price: 799, originalPrice: 999, sizes: ["6-9mo", "9-12mo"], colors: ["Blush Pink", "Mint Green", "Cream", "Navy Blue", "Grey", "Walnut Brown"], description: "Perfect for crawlers and early walkers.", features: ["Stretchy Fit", "Non-Slip Grip", "Breathable", "Washable"], inStock: true },
      { id: "toddler-set", name: "Toddler Wool Booties", price: 1299, originalPrice: 1599, sizes: ["12-18mo", "18-24mo"], colors: ["Blush Pink", "Mint Green", "Cream", "Navy Blue", "Grey", "Walnut Brown"], description: "Built for active toddlers. Durable wool.", features: ["Reinforced Stitching", "Durable Sole", "Thermal Lining", "Easy On/Off"], inStock: true },
    ];
    renderProducts();
  }
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = products.map((p, i) => `
    <div class="product-card reveal reveal-delay-${i + 1}" data-product-id="${p.id}">
      <div class="product-badge">${p.inStock ? "In Stock" : "Coming Soon"}</div>
      <div class="product-emoji">${["🧶", "👟", "👶"][i]}</div>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.description}</p>
      <div class="product-price">
        <span class="price-current">₹${p.price}</span>
        <span class="price-original">₹${p.originalPrice}</span>
        <span class="price-save">Save ₹${p.originalPrice - p.price}</span>
      </div>
      <div class="product-features">
        ${p.features.map(f => `<span>${f}</span>`).join("")}
      </div>
      <button class="btn btn-primary" onclick="addToCart('${p.id}')">
        🛒 Add to Cart
      </button>
    </div>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1, selectedColor: product.colors[0], selectedSize: product.sizes[0] });
  }

  saveCart();
  updateCartUI();

  const btn = document.querySelector(`[data-product-id="${productId}"] .btn`);
  if (btn) {
    btn.textContent = "✅ Added!";
    setTimeout(() => { btn.innerHTML = "🛒 Add to Cart"; }, 1500);
  }
}

function saveCart() {
  localStorage.setItem("croshara_cart", JSON.stringify(cart));
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  if (cartCount) {
    cartCount.textContent = total;
    cartCount.classList.toggle("show", total > 0);
  }
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
  const checkoutForm = document.getElementById("checkoutForm");
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = `<div class="cart-empty"><div class="icon">🛒</div><h3>Your cart is empty</h3><p style="color:var(--text-light);margin-top:8px">Add some booties to get started!</p></div>`;
    if (footer) footer.style.display = "none";
    if (checkoutForm) checkoutForm.classList.remove("show");
    return;
  }

  if (footer) footer.style.display = "block";

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
      <div class="cart-item-img">🧶</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="meta">${item.selectedSize} · ${item.selectedColor}</div>
        <div class="cart-item-qty">
          <button onclick="updateQty(${idx}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${idx}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">₹${item.price * item.qty}</div>
    </div>
  `).join("");

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById("cartTotalAmount").textContent = `₹${total}`;
}

function updateQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartUI();
}

function openCart() {
  cartOverlay?.classList.add("open");
  cartModal?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay?.classList.remove("open");
  cartModal?.classList.remove("open");
  document.body.style.overflow = "";
  document.getElementById("checkoutForm")?.classList.remove("show");
  document.getElementById("cartItems")?.classList.remove("hidden");
}

function showCheckout() {
  if (!cart.length) return;
  currentCheckoutItems = [...cart];
  document.getElementById("cartItems").classList.add("hidden");
  document.getElementById("checkoutForm").classList.add("show");
}

function hideCheckout() {
  document.getElementById("checkoutForm").classList.remove("show");
  document.getElementById("cartItems").classList.remove("hidden");
}

async function placeOrder() {
  const name = document.getElementById("cfName").value.trim();
  const email = document.getElementById("cfEmail").value.trim();
  const phone = document.getElementById("cfPhone").value.trim();
  const address = document.getElementById("cfAddress").value.trim();

  if (!name || !email || !phone || !address) {
    alert("Please fill in all fields");
    return;
  }
  if (phone.length < 10) {
    alert("Please enter a valid phone number");
    return;
  }

  const items = cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty, size: c.selectedSize, color: c.selectedColor }));
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const btn = document.querySelector("#checkoutForm .btn-primary");
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const orderRes = await fetch(`${API_BASE}/api/order/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        customer: { name, email, phone, address },
      }),
    });
    const orderData = await orderRes.json();

    if (window.Razorpay) {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "CROSHARA",
        description: "Handmade Baby Wool Booties",
        order_id: orderData.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#E8A0B4" },
        handler: async function (response) {
          await fetch(`${API_BASE}/api/order/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: { name, email, phone, address },
              items,
            }),
          });
          alert("🎉 Order placed successfully! Thank you for choosing CROSHARA.");
          cart = [];
          saveCart();
          updateCartUI();
          closeCart();
        },
        modal: { ondismiss: function () { btn.disabled = false; btn.textContent = "💳 Pay Now"; } },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      const whatsappMsg = encodeURIComponent(
        `Hi CROSHARA! I'd like to order:\n${items.map(i => `${i.qty}x ${i.name} (${i.size} - ${i.color})`).join("\n")}\nTotal: ₹${total}\nName: ${name}\nAddress: ${address}`
      );
      window.open(`https://wa.me/91XXXXXXXXXX?text=${whatsappMsg}`, "_blank");
      alert("📱 WhatsApp opened for manual order. We'll confirm soon!");
      cart = [];
      saveCart();
      updateCartUI();
      closeCart();
    }
  } catch (err) {
    alert("Something went wrong. Please try ordering via WhatsApp.");
    const whatsappMsg = encodeURIComponent(
      `Hi CROSHARA! I'd like to order:\n${items.map(i => `${i.qty}x ${i.name} (${i.size} - ${i.color})`).join("\n")}\nTotal: ₹${total}\nName: ${name}\nAddress: ${address}`
    );
    window.open(`https://wa.me/91XXXXXXXXXX?text=${whatsappMsg}`, "_blank");
  }
  btn.disabled = false;
}

function setupNavbar() {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
  });
}

function setupScrollReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

function setupFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

function setupHeroParticles() {
  const container = document.querySelector(".hero-particles");
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "hero-particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animationDuration = `${15 + Math.random() * 20}s`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    p.style.width = p.style.height = `${3 + Math.random() * 6}px`;
    container.appendChild(p);
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav-links");
  toggle?.addEventListener("click", () => {
    nav?.classList.toggle("open");
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => nav?.classList.remove("open"));
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
