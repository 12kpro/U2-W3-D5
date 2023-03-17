const URLParams = new URLSearchParams(window.location.search);
const productId = URLParams.get("id");
const url = `${BASE_URL}${productId}`;

document.addEventListener("DOMContentLoaded", async (e) => {
  const product = await resp(url);
  const { brand, description, imageUrl, name, price, createdAt } = product;

  const productImg = document.getElementById("product_image");
  const productDetails = document.getElementById("product_details");
  productImg.src = imageUrl;

  const productName = document.createElement("h1");
  const productBrand = document.createElement("span");
  const dateCreated = document.createElement("p");
  const productPrice = dateCreated.cloneNode();
  const productDescription = dateCreated.cloneNode();

  productName.classList.add("fw-bold");
  productName.innerText = name;

  productBrand.classList.add("badge", "text-bg-primary");
  productBrand.innerText = brand;

  dateCreated.classList.add("font-monospace");
  dateCreated.innerHTML = createdAt;

  productPrice.innerText = price;
  productDescription.innerText = description;

  productDetails.append(productName, productBrand, dateCreated, productPrice, productDescription);
});
