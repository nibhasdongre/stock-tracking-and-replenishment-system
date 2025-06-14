
export const categories = ["Electronics", "Apparel", "Toys", "Home", "Books"];
export const productList = [
  "Product Alpha", "Product Beta", "Product Gamma", "Product Delta", "Product Zeta",
  "Product Lambda", "Product Xi", "Product Kappa", "Product Pi", "Product Sigma",
];

export const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const chartsDummy = (mode: "sales" | "quantity") => {
  let sorted = productList.map((name, idx) => ({
    name,
    category: categories[idx % categories.length],
    sales: getRandomInt(5000, 20000),
    quantity: getRandomInt(25, 300),
  }));
  sorted = sorted.sort((a, b) =>
    mode === "sales" ? b.sales - a.sales : b.quantity - a.quantity
  );
  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();
  // Combine top5 and bottom5, de-duplicated
  const combined = [...top5, ...bottom5.filter(item => !top5.some(t => t.name === item.name))];
  return {
    top5,
    bottom5,
    combined,
    all: sorted,
  };
};

export const pieColors = ["#4884d8", "#d8a448", "#6ed84d", "#e04db7", "#4dc9d8", "#fd5050"];

export const trendDummy = (products: string[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months.map(month => {
    const entry: any = { month };
    products.forEach(product => {
      entry[product] = getRandomInt(3000, 16000);
    });
    return entry;
  });
};
