const INSTAGRAM_URL = "https://www.instagram.com/crosharahandmade/";
let allProducts = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupNavbar();
  setupScrollReveal();
  setupFAQ();
  setupHeroParticles();
  setupMobileMenu();
  setupSmoothScroll();
  setupNewsletter();
  setupContactForm();
  setupFilters();
});

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    allProducts = data.products;
  } catch {
    allProducts = [
      { id: "newborn-set", name: "Newborn Wool Booties", category: "newborn", price: 599, originalPrice: 799, description: "Ultra-soft pure wool booties.", features: ["100% Natural Wool", "Barefoot Sole", "Handmade", "Zero Chemicals"], inStock: true, color: "Blush Pink", badge: "Bestseller", image: "/images/product-newborn.jpg" },
      { id: "infant-set", name: "Infant Wool Booties", category: "infant", price: 799, originalPrice: 999, description: "Perfect for crawlers and early walkers.", features: ["Stretchy Fit", "Non-Slip Grip", "Breathable", "Washable"], inStock: true, color: "Mint Green", badge: "", image: "/images/product-infant.jpg" },
      { id: "toddler-set", name: "Toddler Wool Booties", category: "toddler", price: 1299, originalPrice: 1599, description: "Built for active toddlers.", features: ["Reinforced Stitching", "Durable Sole", "Thermal Lining", "Easy On/Off"], inStock: true, color: "Navy Blue", badge: "", image: "/images/product-toddler.jpg" },
    ];
  }
  renderProducts(allProducts);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const filtered = currentFilter === "all" ? products : products.filter(p => p.category === currentFilter);
  if (!filtered.length) {
    grid.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--text-light)">No products in this category yet. Check back soon!</div>`;
    return;
  }
  grid.innerHTML = filtered.map((p, i) => {
    const msg = encodeURIComponent(`Hi CROSHARA! I'm interested in ${p.name} (₹${p.price}). Please share details!`);
    return `
    <div class="product-card reveal" style="animation-delay:${i * 0.1}s">
      <div class="product-img-wrap">
        <img src="${p.image || '/images/product-newborn.jpg'}" alt="${p.name}" class="product-img" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="product-img-fallback" style="display:none">🧶</div>
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-price">
          <span class="price-current">₹${p.price}</span>
          <span class="price-original">₹${p.originalPrice}</span>
          <span class="price-save">Save ₹${p.originalPrice - p.price}</span>
        </div>
        <div class="product-colors">
          <span class="color-dot" style="background:${p.colorHex || '#E8A0B4'}" title="${p.color || ''}"></span>
          <span>${p.color || ''}</span>
        </div>
        <div class="product-features">
          ${p.features.slice(0, 3).map(f => `<span>${f}</span>`).join("")}
        </div>
        <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" class="btn btn-primary" style="display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;">
          📩 DM to Order
        </a>
      </div>
    </div>`;
  }).join("");
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderProducts(allProducts);
      document.querySelector(".product-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function dmOrder(productName, price) {
  const msg = encodeURIComponent(`Hi CROSHARA! I'd like to order ${productName} (₹${price}). Please help me place the order.`);
  window.open(INSTAGRAM_URL, "_blank");
}

function setupNavbar() {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => navbar?.classList.toggle("scrolled", window.scrollY > 50));
}

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("show")),
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function setupFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => item.classList.toggle("active"));
  });
}

function setupHeroParticles() {
  const container = document.querySelector(".hero-particles");
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "hero-particle";
    p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${15+Math.random()*20}s;animation-delay:${Math.random()*10}s;width:${3+Math.random()*6}px;height:${3+Math.random()*6}px`;
    container.appendChild(p);
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav-links");
  toggle?.addEventListener("click", () => nav?.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav?.classList.remove("open")));
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupNewsletter() {
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("newsletterMsg");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      msg.textContent = data.message;
      form.reset();
    } catch { msg.textContent = "Something went wrong. Try again!"; }
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("contactMsg");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = { name: document.getElementById("cfName").value, email: document.getElementById("cfEmail").value, phone: document.getElementById("cfPhone").value, message: document.getElementById("cfMessage").value };
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const d = await res.json();
      msg.textContent = d.message;
      form.reset();
    } catch { msg.textContent = "Something went wrong!"; }
  });
}
