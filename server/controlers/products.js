// server/controllers/products.js
const getProducts = (req, res) => {
  const products = [
    { id: 1, title: "Web Design", description: "Moderní responzivní web", price: 15000 },
    { id: 2, title: "SEO Optimization", description: "Lepší pozice ve vyhledávačích", price: 7000 },
    { id: 3, title: "Správa sociálních sítí", description: "Postování a budování značky", price: 5000 },
  ];

  res.json(products);
};

module.exports = { getProducts };
