//Variables

const criptoMonedaSelect = document.querySelector("#criptomoneda");
const monedaSelect = document.querySelector("#moneda");
const formularies = document.querySelector("#formulario");
const result = document.querySelector("#resultado");
const quote = {
  moneda: "",
  criptomoneda: "",
};

//Promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

//Eventos
document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();
  formularies.addEventListener("submit", submitFormulario);
  criptoMonedaSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

//Funciones
async function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  try {
    const response = await fetch(url);
    const result = await response.json();
    const criptomonedas = await obtenerCriptomonedas(result.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    mostrarAlerta(error);
  }
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptoMonedaSelect.appendChild(option);
  });
}

function leerValor(e) {
  quote[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  //validar
  const { moneda, criptomoneda } = quote;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  //obtener cotizacion de la app
  consultarApi();
}

function mostrarAlerta(msg) {
  Swal.fire({
    html: `<h3 class='error'>${msg}</h3>`,
    //text: msg,
    icon: "error",
    confirmButtonText: "Continuar",
    background: "#F4D03F",
    backdrop: true,
    position: "center",
    allowOutsideClick: false,
    imageUrl: "img/bitcoin-3014614_640.jpg",
    imageWidth: "150px",
  });
}

async function consultarApi() {
  const { moneda, criptomoneda } = quote;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  try {
    const response = await fetch(url);
    const quote = await response.json();
    mostrarCotizacionHTML(quote.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    mostrarAlerta(error);
  }
}

function mostrarCotizacionHTML(quote) {
  limpiarHTML();
  const { PRICE, CHANGEPCT24HOUR, HIGHDAY, LOWDAY } = quote;
  const price = document.createElement("h2");
  price.innerHTML = `Valuacion  :  <span>${PRICE}</span>`;
  const variation = document.createElement("p");
  variation.innerHTML = `Variacion %  :  <span>${CHANGEPCT24HOUR}</span>`;
  const priceHigher = document.createElement("p");
  priceHigher.innerHTML = `Precio mas alto del dia  :  <span>${HIGHDAY}</span>`;
  const priceLower = document.createElement("p");
  priceLower.innerHTML = `Precio mas bajo del dia  :  <span>${LOWDAY}</span>`;

  result.appendChild(price);
  result.appendChild(variation);
  result.appendChild(priceHigher);
  result.appendChild(priceLower);
}

function limpiarHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}
