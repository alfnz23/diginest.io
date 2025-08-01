const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// === 🔧 Připojení ROUTY /products ===
const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

// === Statické soubory pro frontend (Render deploy) ===
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server běží na portu ${PORT}`));
