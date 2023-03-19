const URLParams = new URLSearchParams(window.location.search);
const productId = URLParams.get("id");
const url = `${BASE_URL}${productId}`;

//creo la pagina dettagli sulla base dei dati proveenienti dal server
document.addEventListener("DOMContentLoaded", async (e) => {
  const product = await resp(url);
  const { _id, brand, description, imageUrl, name, price, createdAt } = product;

  const productImgCnt = document.getElementById("product_image");
  const productDetailsCnt = document.getElementById("product_details");

  productImgCnt.classList.add("mb-4", "mb-md-0");
  const div = document.createElement("div");
  const productImg = document.createElement("img");
  productImg.classList.add("object-fit-contain");
  productImg.src = imageUrl;

  const productId = div.cloneNode();
  productId.classList.add("small", "mb-1");
  productId.innerText = `id: ${_id}`;

  const productName = document.createElement("h1");
  const productPrice = div.cloneNode();
  const productDescription = document.createElement("p");

  const productBrand = div.cloneNode();
  const productDate = document.createElement("p");
  const productEdit = document.createElement("a");

  productName.classList.add("display-5", "fw-bolder");
  productName.innerText = name;

  productPrice.classList.add("fs-5", "mb-5");
  productPrice.innerText = `€${price}`;

  productDescription.classList.add("lead");
  productDescription.innerText = description;

  productBrand.classList.add("brand-label", "mb-3");
  productBrand.innerText = brand;

  productDate.classList.add("font-monospace");
  productDate.innerHTML = `${new Date(createdAt).toLocaleString("it-IT")}`;

  productEdit.classList.add("btn", "btn-outline-dark", "rounded-0");
  productEdit.innerHTML = '<i class="bi bi-pencil-square"></i> Edit';
  productEdit.href = `./backoffice.html?id=${_id}`;
  productImgCnt.append(productImg);

  productDetailsCnt.append(
    productBrand,
    productId,
    productName,
    productPrice,
    productDescription,
    productDate,
    productEdit
  );
});
