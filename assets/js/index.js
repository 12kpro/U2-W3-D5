const loadArticless = async () => {
  const cnt = document.getElementById("grid-products");
  cnt.innerHTML = "";
  const products = await resp(BASE_URL);
  for (const product of products) {
    const { brand, imageUrl, name, price, _id } = product;
    cnt.insertAdjacentHTML("beforeend", cardTpl(_id, imageUrl, name, brand, price)); //per praticità
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  setTimeout(() => {
    loadArticless();
  }, 1000);
});
