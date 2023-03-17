const BASE_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUHT_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzYjZhZGM1NmIzNjAwMTMzZmU1NzAiLCJpYXQiOjE2NzkwMTM1NDksImV4cCI6MTY4MDIyMzE0OX0.gh0JCLPZVXRqvfKOawV7S1-YNSH44zJ48CyW3Vv0mkc";

const resp = async (url, method = "GET", body = false) => {
  const params = {
    method,
    headers: {
      Authorization: AUHT_KEY
    }
  };

  if (method === "POST" || method === "PUT") {
    params.headers["Content-Type"] = "application/json";
    params.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, params);

    console.log(response);
    if (!response.ok) {
      if (response.status === 401) throw new Error("Network response was not OK, Status 401");
      if (response.status === 400) throw new Error("Network response was not OK, Status 400");
      if (response.status === 404) throw new Error("Network response was not OK, Status 404");
      throw new Error("Network response was not OK");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const toastMsg = document.getElementById("toast_msg");
    toastMsg.innerText = error;

    const toastBs = document.getElementById("liveToast");
    const toast = new bootstrap.Toast(toastBs);
    toast.show();

    console.dir(error.message);
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
