const loadArticless = async () => {
  const cnt = document.getElementById("grid-products");
  cnt.innerHTML = "";

  /*
  const loader = 
  loader.classList.remove("d-none");
  loader.classList.add("d-flex");
*/

  //const url = `${BASE_URL}search?${new URLSearchParams(param)}`;
  const products = await resp(BASE_URL);
  console.log(products);
  for (const product of products) {
    const { brand, description, imageUrl, name, price, _id } = product;
    cnt.insertAdjacentHTML("beforeend", cardTpl(_id, imageUrl, name, brand, description, price));

    //cnt.append(renderModal(photo));
  }
  //  loader.classList.remove("d-flex");
  //  loader.classList.add("d-none");
};

document.addEventListener("DOMContentLoaded", (e) => {
  loadArticless();
});
