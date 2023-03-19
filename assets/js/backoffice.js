const URLParams = new URLSearchParams(window.location.search);
const productId = URLParams.get("id");
const url = `${BASE_URL}${productId}`;

const startLoader = () => {
  const loader = document.getElementById("loader");
  loader.classList.remove("invisible");
  loader.classList.add("visible");
};
document.addEventListener("DOMContentLoaded", async (e) => {
  const btnDelete = document.getElementById("btn_delete");
  const btnSubmit = document.getElementById("btn_submit");

  const formProduct = document.getElementById("form_product");
  const nameField = document.getElementById("name");
  const descriptionField = document.getElementById("description");
  const priceField = document.getElementById("price");
  const brandField = document.getElementById("brand");
  const imageField = document.getElementById("image");

  const modal = document.getElementById("modal_warning");
  const btnConfirm = document.getElementById("btn_confirm");

  if (productId) {
    startLoader();
    btnDelete.classList.remove("d-none");
    //btnReset.classList.add("d-none");
    btnSubmit.innerText = "Save";
    const product = await resp(url);
    const { brand, description, imageUrl, name, price } = product;
    nameField.value = name;
    descriptionField.value = description;
    priceField.value = price;
    brandField.value = brand;
    imageField.value = imageUrl;
  }

  modal.addEventListener("show.bs.modal", (event) => {
    const action = event.relatedTarget.dataset.action;
    const msg =
      action === "delete"
        ? "Are you sure you want to delete the article?"
        : "Are you sure you want to delete the entered data?";

    const modalBody = modal.querySelector("#modal_body");
    const btnConfirm = modal.querySelector("#btn_confirm");
    modalBody.innerText = msg;
    btnConfirm.dataset.action = action;
  });

  btnConfirm.addEventListener("click", (e) => {
    startLoader();
    const action = e.target.dataset.action;
    action === "delete" ? resp(url, "DELETE", true).then(window.location.assign("./index.html")) : formProduct.reset();
  });

  formProduct.addEventListener("submit", (e) => {
    e.preventDefault();

    e.target.classList.add("was-validated");
    if (e.target.checkValidity()) {
      startLoader();
      const msgBody = {
        name: nameField.value,
        description: descriptionField.value,
        brand: brandField.value,
        imageUrl: imageField.value,
        price: priceField.value
      };

      if (productId) {
        resp(url, "PUT", true, JSON.stringify(msgBody));
      } else {
        resp(BASE_URL, "POST", true, JSON.stringify(msgBody));
      }
    }
  });
});
