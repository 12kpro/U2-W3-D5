const BASE_URL = "https://striveschool-api.herokuapp.com/api/product/";
const AUHT_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzYjZhZGM1NmIzNjAwMTMzZmU1NzAiLCJpYXQiOjE2NzkwMTM1NDksImV4cCI6MTY4MDIyMzE0OX0.gh0JCLPZVXRqvfKOawV7S1-YNSH44zJ48CyW3Vv0mkc";

// classe per gestione messaggi custom
class CustomMsg {
  static messages = [
    { code: "GET", txt: "retrived" },
    { code: "POST", txt: "created" },
    { code: "PUT", txt: "updated" },
    { code: "DELETE", txt: "deleted" },
    { code: "EMPTY", txt: "no data retrived" }
  ];
  static getTxt(code) {
    const msg = this.messages.find((item) => item.code === code);
    return msg.txt;
  }
}

// Estensione classe error per gestione messaggi alternativa
class ServerError extends Error {
  constructor(id, status, statusMsg) {
    super();
    this.id = id;
    this.status = status;
    this.statusMsg = statusMsg;
  }
}

// funzione che crea gli allert botstrap per la notifica
const createToast = (id, apearence, title, txt, save = false, showBody = false) => {
  if (save) storageAddMsg(id, apearence, title, txt);
  const bell = document.getElementById("bell");
  bell.classList.add("ringing");
  const offCanvasCnt = document.getElementById("server_messages_cnt");
  const toastCnt = document.createElement("div");
  toastCnt.classList.add("toast", "mt-3", apearence);
  toastCnt.setAttribute("role", "alert");
  toastCnt.setAttribute("aria-live", "assertive");
  toastCnt.setAttribute("aria-atomic", "true");
  toastCnt.setAttribute("data-bs-autohide", "false");
  toastCnt.dataset.id = id;

  const toastHeader = document.createElement("div");
  toastHeader.classList.add("toast-header");
  const toastStatus = document.createElement("strong");
  toastStatus.innerText = title;
  toastStatus.classList.add("me-auto");
  const toastBtn = document.createElement("button");
  toastBtn.classList.add("btn-close");
  toastBtn.setAttribute("data-bs-dismiss", "toast");
  toastBtn.setAttribute("type", "button");
  toastBtn.setAttribute("aria-label", "Close");
  const toastStatusMsg = document.createElement("div");
  toastStatusMsg.innerText = txt;
  toastStatusMsg.classList.add("toast-body");

  toastHeader.append(toastStatus, toastBtn);
  toastCnt.append(toastHeader, toastStatusMsg);

  offCanvasCnt.append(toastCnt);

  const toast = new bootstrap.Toast(toastCnt);
  toast.show();
  toastCnt.addEventListener("hidden.bs.toast", (e) => {
    storageRemoveMsg(e.target.dataset.id);
    e.target.remove();
    if (offCanvasCnt.childElementCount < 1) bell.classList.remove("ringing");
  });
  // clono l'alert e ne faccio apparire uno sulla pagina a richiesta
  if (showBody) {
    const mainToastCnt = toastCnt.cloneNode(true);
    mainToastCnt.classList.add("top-0", "start-50", "translate-middle-x", "position-absolute");
    mainToastCnt.setAttribute("data-bs-autohide", "true");
    document.body.append(mainToastCnt);
    const mainToast = new bootstrap.Toast(mainToastCnt);
    mainToast.show();
    mainToastCnt.addEventListener("hidden.bs.toast", (e) => {
      e.target.remove();
    });
  }
};

// gestisco aggiunta informazini alert in sessionstorage
const storageAddMsg = (id, apearence, title, txt) => {
  const storedMsgs = sessionStorage.getItem("msgs");
  const msgArray = storedMsgs ? JSON.parse(storedMsgs) : [];
  const msg = { id, apearence, title, txt };
  msgArray.push(msg);
  sessionStorage.setItem("msgs", JSON.stringify(msgArray));
};
// gestisco la rimozione informazini alert in sessionstorage
const storageRemoveMsg = (id) => {
  const msgArray = JSON.parse(sessionStorage.getItem("msgs"));
  const result = msgArray.filter((msg) => msg.id != id); //  != msg.id è un numero, id una stringa (html dataset)
  sessionStorage.setItem("msgs", JSON.stringify(result));
};

//gestisco fetch verso server
const resp = async (url, method, showmsg = false, body) => {
  const fetchId = Date.now();
  const params = {
    method,
    headers: {
      Authorization: AUHT_KEY,
      "Content-Type": "application/json; charset=utf-8" //fetch imposta di default application/json ????
    },
    body
  };
  try {
    const response = await fetch(url, params);

    if (response.ok) {
      //se la risposta è ok restituisco i dati
      const data = await response.json();
      if (!data) throw new ServerError(fetchId, "200", `Warning ${CustomMsg.getTxt("EMPTY")}`); //api ritorna un array vuoto(null) con status 200

      if (showmsg)
        createToast(
          fetchId,
          "text-bg-success",
          `Article with id: ${data._id}`,
          `Correctly ${CustomMsg.getTxt(method)}`,
          true
        );
      return data;
    }
    throw new ServerError(fetchId, response.status, response.statusText); // altrimenti genero un errore
  } catch (error) {
    //in caso di errore genero un alert e lo appendo alla pagina
    createToast(error.id, "text-bg-danger", error.status, error.statusMsg, true, true);
    return [];
  } finally {
    //rendo invisibile il loader
    const loader = document.getElementById("loader");
    loader.classList.add("invisible");
  }
};
// utility template per la creazione delle card in homepage
const cardTpl = (id, img, name, brand, price) => `
<div class="col">
<div class="card">
<div class="product-image">
    <div class="ratio ratio-16x9">
        <img src="${img}" />
    </div>
    <span class="brand-label">${brand}</span>
  <ul class="product-links">
    <li>
      <a href="./backoffice.html?id=${id}"><i class="bi bi-pencil-square"></i></a>
    </li>
    <li>
      <a href="./details.html?id=${id}"><i class="bi bi-eye"></i></a>
    </li>
  </ul>
</div>
<div class="product-content">
  <h3 class="title"><a href="./details.html?id=${id}">${name}</a></h3>
  <div class="price">€${price}</div>
</div>
</div>
</div>
`;
// utility per il caricamento bulk di articoli
const bulkPost = async (limit, skip) => {
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  console.log(url);
  try {
    const results = await fetch(url);
    const data = await results.json();
    console.log(data);
    for (const product of data.products) {
      const msgBody = {
        name: product.title,
        description: product.description,
        brand: product.brand,
        imageUrl: product.thumbnail,
        price: product.price
      };
      resp(BASE_URL, "POST", true, JSON.stringify(msgBody));
    }
  } catch (error) {
    console.log(error);
  }
};
//utility per la cancellazione bulk degli articoli
const bulkRemove = async () => {
  try {
    const products = await resp(BASE_URL);
    for (const product of products) {
      const url = `${BASE_URL}${product._id}`;
      resp(url, "DELETE", true);
    }
  } catch (error) {
    console.log(error);
  }
};

// se ci sono alert salvati in local storage vado a generarli e appenderli alla pagina
document.addEventListener("DOMContentLoaded", (e) => {
  const storedMsgs = sessionStorage.getItem("msgs");
  const msgArray = storedMsgs ? JSON.parse(storedMsgs) : [];
  for (const msg of msgArray) {
    createToast(msg.id, msg.apearence, msg.title, msg.txt);
  }
});
