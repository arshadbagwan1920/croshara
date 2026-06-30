const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
  const contactFile = path.join(__dirname, "data", "contacts.json");
  let contacts = [];
  try {
    contacts = JSON.parse(fs.readFileSync(contactFile, "utf-8"));
  } catch {
    contacts = [];
  }
  contacts.push({ id: uuidv4(), name, email, phone, message, createdAt: new Date().toISOString() });
  fs.writeFileSync(contactFile, JSON.stringify(contacts, null, 2));
  res.json({ success: true, message: "Thank you! We'll get back to you soon." });
});

app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  const newsletterFile = path.join(__dirname, "data", "newsletter.json");
  let subs = [];
  try {
    subs = JSON.parse(fs.readFileSync(newsletterFile, "utf-8"));
  } catch {
    subs = [];
  }
  if (subs.find((s) => s.email === email)) {
    return res.json({ success: true, message: "Already subscribed!" });
  }
  subs.push({ email, createdAt: new Date().toISOString() });
  fs.writeFileSync(newsletterFile, JSON.stringify(subs, null, 2));
  res.json({ success: true, message: "Subscribed! Welcome to CROSHARA family." });
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  🧶 CROSHARA — Live at http://0.0.0.0:${PORT}`);
  console.log(`  📬 Orders via Instagram DM\n`);
});
