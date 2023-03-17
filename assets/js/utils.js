const BASE_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUHT_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzYjZhZGM1NmIzNjAwMTMzZmU1NzAiLCJpYXQiOjE2NzkwMTM1NDksImV4cCI6MTY4MDIyMzE0OX0.gh0JCLPZVXRqvfKOawV7S1-YNSH44zJ48CyW3Vv0mkc";

class ServerError extends Error {
  constructor(status, statusMsg) {
    super();
    this.status = status;
    this.statusMsg = statusMsg;
  }
}

const showToast = (apearence, title, msg) => {
  const toastBs = document.getElementById("toast");
  toastBs.classList.add(apearence);
  const toasStatus = toastBs.querySelector("#toast_status");
  const toastMsg = toastBs.querySelector("#toast_status_msg");

  toasStatus.innerText = title;
  toastMsg.innerText = msg;

  const toast = new bootstrap.Toast(toastBs);
  toast.show();
};

const resp = async (url, method, body) => {
  const params = {
    method,
    headers: {
      Authorization: AUHT_KEY
    },
    body
  };

  if (method === "POST" || method === "PUT") {
    params.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, params);
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new ServerError(response.status, response.statusText);
  } catch (error) {
    showToast("text-bg-danger", error.status, error.statusMsg);
  } finally {
    const loader = document.getElementById("loader");
    loader.classList.add("invisible");
  }
};

const cardTpl = (id, img, name, brand, description, price) => `
    <div class="col">
      <div class="card mb-4 shadow-sm">
        <img src="${img}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <div class="badge text-bg-primary">${brand}</div>
          <p class="card-text">${description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <a href="./details.html?id=${id}" class="btn btn-sm btn-outline-secondary">Scopri di più</a>
              <a href="./backoffice.html?id=${id}" class="btn btn-sm btn-outline-secondary">Modifica</a>
            </div>
            <small class="text-muted">${price}€</small>
          </div>
        </div>
      </div>
    </div>
`;
