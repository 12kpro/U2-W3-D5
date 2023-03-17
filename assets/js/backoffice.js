const URLParams = new URLSearchParams(window.location.search);
const productId = URLParams.get("id");
const url = `${BASE_URL}${productId}`;

document.addEventListener("DOMContentLoaded", async (e) => {
  const btnDelete = document.getElementById("btn_delete");
  const btnReset = document.getElementById("btn_reset");
  const btnSubmit = document.getElementById("btn_submit");
  const formProduct = document.getElementById("form_product");
  const nameField = document.getElementById("name");
  const descriptionField = document.getElementById("description");
  const priceField = document.getElementById("price");
  const brandField = document.getElementById("brand");
  const imageField = document.getElementById("image");

  if (productId) {
    btnDelete.classList.remove("d-none");
    btnReset.classList.add("d-none");
    btnSubmit.innerText = "Save";
    const product = await resp(url);
    const { brand, description, imageUrl, name, price } = product;
    nameField.value = name;
    descriptionField.value = description;
    priceField.value = price;
    brandField.value = brand;
    imageField.value = imageUrl;
  }

  btnDelete.addEventListener("click", (e) => {
    const proceed = confirm("Sicuro di voler eliminare l'articolo?");
    if (proceed) resp(url, "DELETE").then(window.location.assign("./index.html"));
  });
  btnReset.addEventListener("click", (e) => {
    const proceed = confirm("Sicuro di voler cancellare i dati inseriti");
    if (proceed) formProduct.reset();
  });

  formProduct.addEventListener("submit", (e) => {
    e.preventDefault();

    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      const msgBody = {
        name: nameField.value,
        description: descriptionField.value,
        brand: brandField.value,
        imageUrl: imageField.value,
        price: priceField.value
      };

      if (productId) {
        resp(url, "PUT", msgBody);
      } else {
        resp(BASE_URL, "POST", msgBody);
      }
    }
  });
});
