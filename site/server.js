const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ADMIN_USER = "admin";
const ADMIN_PASS = "croshara123";

app.use((req, res, next) => {
  if (!req.path.startsWith("/admin")) return next();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="CROSHARA Admin"');
    return res.status(401).send("Authentication required");
  }
  const decoded = Buffer.from(auth.slice(6), "base64").toString();
  const [user, pass] = decoded.split(":");
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    res.set("WWW-Authenticate", 'Basic realm="CROSHARA Admin"');
    return res.status(401).send("Invalid credentials");
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8")); }
  catch { return []; }
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "live", brand: "CROSHARA", time: new Date().toISOString() });
});

app.get("/api/products", (req, res) => {
  res.json({
    products: [
      {
        id: "newborn-set",
        name: "Newborn Wool Booties",
        price: 599,
        originalPrice: 799,
        sizes: ["0-3mo", "3-6mo"],
        colors: ["Blush Pink", "Mint Green", "Cream", "Navy Blue", "Grey", "Walnut Brown"],
        description: "Ultra-soft pure wool booties for delicate newborn feet. Barefoot-friendly flexible sole.",
        features: ["100% Natural Wool", "Barefoot-Friendly Sole", "Handmade by Artisans", "Zero Chemicals"],
        inStock: true,
      },
      {
        id: "infant-set",
        name: "Infant Wool Booties",
        price: 799,
        originalPrice: 999,
        sizes: ["6-9mo", "9-12mo"],
        colors: ["Blush Pink", "Mint Green", "Cream", "Navy Blue", "Grey", "Walnut Brown"],
        description: "Perfect for crawlers and early walkers. Stretchy wool fit that stays on active feet.",
        features: ["Stretchy Ribbed Ankle", "Non-Slip Grip", "Breathable Wool", "Machine Washable"],
        inStock: true,
      },
      {
        id: "toddler-set",
        name: "Toddler Wool Booties",
        price: 1299,
        originalPrice: 1599,
        sizes: ["12-18mo", "18-24mo"],
        colors: ["Blush Pink", "Mint Green", "Cream", "Navy Blue", "Grey", "Walnut Brown"],
        description: "Built for active toddlers. Durable wool construction with reinforced stitching.",
        features: ["Reinforced Stitching", "Extra Durable Sole", "Thermal Wool Lining", "Easy On/Off"],
        inStock: true,
      },
    ],
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  const contacts = readJSON("contacts.json");
  contacts.push({ id: uuidv4(), name, email, phone, message, createdAt: new Date().toISOString() });
  writeJSON("contacts.json", contacts);
  res.json({ success: true, message: "Thank you! We'll get back to you soon." });
});

app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  const subs = readJSON("newsletter.json");
  if (subs.find((s) => s.email === email)) {
    return res.json({ success: true, message: "Already subscribed!" });
  }
  subs.push({ email, subscribedAt: new Date().toISOString(), welcomeSent: false });
  writeJSON("newsletter.json", subs);
  res.json({ success: true, message: "Subscribed! Welcome to CROSHARA family." });
});

app.get("/api/contacts", (req, res) => {
  res.json({ contacts: readJSON("contacts.json") });
});

app.get("/api/newsletter/count", (req, res) => {
  res.json({ count: readJSON("newsletter.json").length });
});

app.get("/api/newsletter/list", (req, res) => {
  res.json({ subscribers: readJSON("newsletter.json") });
});

app.post("/api/orders", (req, res) => {
  const { customerName, email, phone, product, size, color, price, source } = req.body;
  const orders = readJSON("orders.json");
  const order = {
    id: "ORD-" + uuidv4().slice(0, 8).toUpperCase(),
    customerName, email, phone, product, size, color, price: price || 0,
    source: source || "Instagram DM",
    status: "confirmed",
    createdAt: new Date().toISOString(),
    emailSequence: { welcome: false, deliveryCheck: false, reviewRequest: false, nextSize: false },
  };
  orders.push(order);
  writeJSON("orders.json", orders);
  res.json({ success: true, order });
});

app.get("/api/orders", (req, res) => {
  res.json({ orders: readJSON("orders.json") });
});

app.put("/api/orders/:id/status", (req, res) => {
  const orders = readJSON("orders.json");
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });
  orders[idx].status = req.body.status || orders[idx].status;
  writeJSON("orders.json", orders);
  res.json({ success: true, order: orders[idx] });
});

app.post("/api/referral/generate", (req, res) => {
  const { customerName, email } = req.body;
  const referrals = readJSON("referrals.json");
  const code = "CRO" + Math.random().toString(36).slice(2, 8).toUpperCase();
  referrals.push({
    code, customerName, email, createdAt: new Date().toISOString(),
    clicks: 0, conversions: 0,
  });
  writeJSON("referrals.json", referrals);
  res.json({ success: true, code, referralLink: `https://croshara.onrender.com?ref=${code}` });
});

app.get("/api/referral/:code", (req, res) => {
  const referrals = readJSON("referrals.json");
  const ref = referrals.find(r => r.code === req.params.code);
  if (ref) {
    ref.clicks = (ref.clicks || 0) + 1;
    writeJSON("referrals.json", referrals);
  }
  res.json({ valid: !!ref, code: req.params.code });
});

app.post("/api/referral/:code/convert", (req, res) => {
  const referrals = readJSON("referrals.json");
  const ref = referrals.find(r => r.code === req.params.code);
  if (ref) {
    ref.conversions = (ref.conversions || 0) + 1;
    writeJSON("referrals.json", referrals);
  }
  res.json({ success: true });
});

app.get("/api/referrals", (req, res) => {
  res.json({ referrals: readJSON("referrals.json") });
});

app.get("/api/admin/dashboard", (req, res) => {
  const contacts = readJSON("contacts.json");
  const subs = readJSON("newsletter.json");
  const orders = readJSON("orders.json");
  const referrals = readJSON("referrals.json");
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const confirmedOrders = orders.filter(o => o.status === "confirmed").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  res.json({
    subscribers: subs.length,
    contacts: contacts.length,
    totalOrders: orders.length,
    confirmedOrders,
    deliveredOrders,
    totalRevenue,
    referrals: referrals.length,
    referralClicks: referrals.reduce((s, r) => s + (r.clicks || 0), 0),
    recentContacts: contacts.slice(-5).reverse(),
    recentOrders: orders.slice(-5).reverse(),
  });
});

app.post("/api/content-calendar/generate", (req, res) => {
  const { month, year } = req.body;
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();
  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const themes = {
    1: "Winter Baby Care", 2: "Valentine's Gifts for New Moms",
    3: "Spring Baby Fashion", 4: "Baby Milestones",
    5: "Mother's Day Gifting", 6: "Monsoon Baby Safety",
    7: "Baby Shower Guide", 8: "Independence Day + Raksha Bandhan",
    9: "Festive Baby Gifts", 10: "Diwali Gifting Guide",
    11: "Winter Prep + Baby Care", 12: "Christmas Gifts",
  };

  const contentTypes = ["📸 Product Photo", "🎬 Reel", "📝 Carousel Post", "📖 Blog", "📱 Story", "📌 Pin", "💬 WhatsApp Broadcast"];
  const pillars = ["Product", "Process", "Emotion", "Education", "Community"];

  const daysInMonth = new Date(y, m, 0).getDate();
  const calendar = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m - 1, d);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const postIdeas = [
      `Showcase your ${["newborn", "infant", "toddler"][d % 3]} wool booties`,
      `Behind the scenes: knitting process time-lapse`,
      `Customer testimonial spotlight`,
      `"Why wool is best for babies" educational carousel`,
      `Festive/seasonal post: ${themes[m] || "Seasonal content"}`,
      `Baby wearing the shoes — emotional moment`,
      `Quick tip: How to measure baby's feet at home`,
    ];
    calendar.push({
      day: d, dayName: dayNames[date.getDay()],
      contentType: contentTypes[d % contentTypes.length],
      pillar: pillars[d % pillars.length],
      theme: themes[m] || "General",
      postIdea: postIdeas[d % postIdeas.length],
      suggestedTime: date.getDay() === 0 || date.getDay() === 6 ? "7:00 PM" : "12:00 PM",
    });
  }

  res.json({ month: monthNames[m], year: y, days: calendar });
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  🧶 CROSHARA — Live at http://0.0.0.0:${PORT}`);
  console.log(`  📬 Orders via Instagram DM`);
  console.log(`  📊 Admin: /admin (admin / croshara123)\n`);
});
