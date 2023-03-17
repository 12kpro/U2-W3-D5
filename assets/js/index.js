const loadArticless = async () => {
  const cnt = document.getElementById("grid-products");
  cnt.innerHTML = "";
  const products = await resp(BASE_URL);
  console.log(products);
  for (const product of products) {
    const { brand, description, imageUrl, name, price, _id } = product;
    cnt.insertAdjacentHTML("beforeend", cardTpl(_id, imageUrl, name, brand, description, price));
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  setTimeout(() => {
    loadArticless();
  }, 2000);
});
