const BASE_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUHT_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzYjZhZGM1NmIzNjAwMTMzZmU1NzAiLCJpYXQiOjE2NzkwMTM1NDksImV4cCI6MTY4MDIyMzE0OX0.gh0JCLPZVXRqvfKOawV7S1-YNSH44zJ48CyW3Vv0mkc";

const resp = async (url, method = "GET", body = false) => {
  const params = {
    method,
    headers: {
      //Authorization: AUHT_KEY
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
      if (response.status === 401) throw new Error({ status: response.status, msg: response.statusText });
      if (response.status === 400) throw new Error({ status: response.status, msg: response.statusText });
      if (response.status === 404) throw new Error({ status: response.status, msg: response.statusText });
      throw new Error("Network response was not OK");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  } finally {
    const loader = document.getElementById("loader");
    loader.classList.add("invisible");
  }
};

const toastTpl = (code, msg) => `
  <div class="toast text-bg-danger bottom-0 end-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">${code}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">${msg}</div>
  </div>
`;

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
              <a href="./details.html?id=${id}" class="btn btn-sm btn-outline-secondary">View</a>
              <a href="./backoffice.html?id=${id}" class="btn btn-sm btn-outline-secondary">Edit</a>
            </div>
            <small class="text-muted">${price}€</small>
          </div>
        </div>
      </div>
    </div>
`;
