const amountA = document.getElementById("inputCurrency");
const currencyA = document.getElementById("fromCurrencyList");
const amountB = document.getElementById("outputCurrency");
const currencyB = document.getElementById("toCurrencyList");
const form = document.querySelector(".Converter form");
const url =
  "https://v6.exchangerate-api.com/v6/b6e00d2108290fa42ab7b5f0/latest/";
const ratesByBase = {};

// List of currencies available for the options in the selector
const currencies = {
  AED: `UAE Dirham`,
  ALL: `Lek`,
  AMD: `Armenian Dram`,
  ANG: `Netherlands Antillean guilder`,
  AOA: `Kwanza`,
  ARS: `Argentine Peso`,
  AUD: `Australian Dollar`,
  AWG: `Aruban Guilder/Florin`,
  AZN: `Azerbaijanian Manat`,
  BAM: `Konvertibilna Marka`,
  BBD: `Barbados Dollar`,
  BDT: `Taka`,
  BGN: `Bulgarian Lev`,
  BHD: `Bahraini Dinar`,
  BIF: `Burundi Franc`,
  BMD: `Bermudian Dollar`,
  BND: `Brunei Dollar`,
  BOB: `Boliviano`,
  BRL: `Brazilian Real`,
  BSD: `Bahamian Dollar`,
  BTC: `Bitcoin`,
  BTN: `Ngultrum`,
  BWP: `Pula`,
  BYN: `Belarusian Ruble`,
  BZD: `Belize Dollar`,
  CAD: `Canadian Dollar`,
  CDF: `Congolese Franc`,
  CHF: `Swiss Franc`,
  CLF: `Chilean Unit of Account (UF)`,
  CLP: `Chilean Peso`,
  CNY: `Yuan`,
  COP: `Colombian Peso`,
  CRC: `Costa Rican Colon`,
  CUP: `Cuban Peso`,
  CVE: `Cape Verde Escudo`,
  CZK: `Czech Koruna`,
  DJF: `Djibouti Franc`,
  DKK: `Danish Krone`,
  DOP: `Dominican Peso`,
  DZD: `Algerian Dinar`,
  EGP: `Egyptian Pound`,
  ERN: `Nakfa`,
  ETB: `Ethiopian Birr`,
  EUR: `Euro`,
  FJD: `Fiji Dollar`,
  FKP: `Falkland Islands Pound`,
  GBP: `Pound Sterling`,
  GEL: `Lari`,
  GHS: `Cedi`,
  GIP: `Gibraltar Pound`,
  GMD: `Dalasi`,
  GNF: `Guinea Franc`,
  GTQ: `Quetzal`,
  GYD: `Guyana Dollar`,
  HKD: `Hong Kong Dollar`,
  HNL: `Lempira`,
  HRK: `Croatian Kuna`,
  HTG: `Gourde`,
  HUF: `Forint`,
  IDR: `Rupiah`,
  ILS: `New Israeli Shekel`,
  INR: `Indian Rupee`,
  IQD: `Iraqi Dinar`,
  IRR: `Iranian Rial`,
  ISK: `Iceland Krona`,
  JMD: `Jamaican Dollar`,
  JOD: `Jordanian Dinar`,
  JPY: `Yen`,
  KES: `Kenyan Shilling`,
  KGS: `Som`,
  KHR: `Riel`,
  KPW: `North Korean Won`,
  KRW: `South Korean Won`,
  KWD: `Kuwaiti Dinar`,
  KYD: `Cayman Islands Dollar`,
  KZT: `Tenge`,
  LAK: `Kip`,
  LBP: `Lebanese Pound`,
  LKR: `Sri Lanka Rupee`,
  LRD: `Liberian Dollar`,
  LSL: `Loti`,
  LYD: `Libyan Dinar`,
  MAD: `Moroccan Dirham`,
  MDL: `Moldovan Leu`,
  MGA: `Malagasy Ariary`,
  MKD: `Denar`,
  MMK: `Kyat`,
  MNT: `Tugrik`,
  MOP: `Pataca`,
  MUR: `Mauritius Rupee`,
  MVR: `Rufiyaa`,
  MWK: `Kwacha`,
  MXN: `Mexican Peso`,
  MYR: `Malaysian Ringgit`,
  MZN: `Metical`,
  NAD: `Namibia Dollar`,
  NGN: `Naira`,
  NIO: `Cordoba Oro`,
  NOK: `Norwegian Krone`,
  NPR: `Nepalese Rupee`,
  NZD: `New Zealand Dollar`,
  OMR: `Rial Omani`,
  PAB: `Balboa`,
  PEN: `Nuevo Sol`,
  PGK: `Kina`,
  PHP: `Philippine Peso`,
  PKR: `Pakistan Rupee`,
  PLN: `PZloty`,
  PYG: `Guarani`,
  QAR: `Qatari Rial`,
  RON: `Leu`,
  RSD: `Serbian Dinar`,
  RUB: `Russian Ruble`,
  RWF: `Rwanda Franc`,
  SAR: `Saudi Riyal`,
  SBD: `Solomon Islands Dollar`,
  SCR: `Seychelles Rupee`,
  SDG: `Sudanese Pound`,
  SEK: `Swedish Krona`,
  SGD: `Singapore Dollar`,
  SHP: `Saint Helena Pound`,
  SLL: `Leone`,
  SOS: `Somali Shilling`,
  SRD: `Suriname Dollar`,
  SYP: `Syrian Pound`,
  SZL: `Lilangeni`,
  THB: `Baht`,
  TJS: `Somoni`,
  TMT: `Manat`,
  TND: `Tunisian Dinar`,
  TOP: `Pa’anga`,
  TRY: `Turkish Lira`,
  TTD: `Trinidad and Tobago Dollar`,
  TWD: `Taiwan Dollar`,
  TZS: `Tanzanian Shilling`,
  UAH: `Hryvnia`,
  UGX: `Uganda Shilling`,
  USD: `US Dollar`,
  UYU: `Peso Uruguayo`,
  UZS: `Uzbekistan Sum`,
  VEF: `Bolivar Fuerte`,
  VND: `Dong`,
  VUV: `Vatu`,
  WST: `Tala`,
  XAF: `CFA Franc BCEAO`,
  XCD: `East Caribbean Dollar`,
  XPF: `CFP Franc`,
  YER: `Yemeni Rial`,
  ZAR: `Rand`,
  ZMW: `Zambian Kwacha`,
  ZWL: `Zimbabwe Dollar`,
};

// function to populate the <select> in the HTML
function generateSelectList(optionsObject, defaultOption) {
  let optionHTML = "";

  for (const item of Object.entries(optionsObject)) {
    if (item[0] == defaultOption) {
      optionHTML += `<option selected value="${item[0]}">${item[0]} - ${item[1]}</option>`;
    } else {
      optionHTML += `<option value="${item[0]}">${item[0]} - ${item[1]}</option>`;
    }
  }
  return optionHTML;
}

// Function to fetch the latest currencies from a web API, with a given base currency
async function fetchRates(base = "ZAR") {
  const res = await fetch(`${url}/${base}`);
  const rates = await res.json();
  return rates;
}

// Function to convert the given `amount` by multiplying the `from` by the `amount`
async function convert(amount, from, to) {
  // First check if we even have the rates to convert from that currency
  if (!ratesByBase[from]) {
    console.log(`Cant find ${from} rates to convert to ${to}.`);
    const rates = await fetchRates(from);
    console.log(rates);
    // Store them for next time, as to not spam the API
    ratesByBase[from] = rates;
  }
  // Convert that amount that they passed it
  const rate = ratesByBase[from].conversion_rates[to];
  const convertedAmount = rate * amount;
  console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);
  return convertedAmount;
}

// Function to format the currency
function formatCurrency(amount, currency) {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(
    amount
  );
}

// Function to handel the change of the number for top input and convert and output to the bottom box
async function onValueAChange(e) {
  const rawAmount = await convert(
    amountA.value,
    currencyA.value,
    currencyB.value
  );
  amountB.value = formatCurrency(rawAmount, currencyB.value);
}

// Function to handel the change of the number for bottom input and convert and output to the top box
async function onValueBChange(e) {
  const rawAmount = await convert(
    amountB.value,
    currencyB.value,
    currencyA.value
  );
  amountA.value = rawAmount;
}

// Fetch the default rates and store them in local memory
async function fetchDefaultRates() {
  ratesByBase["ZAR"] = await fetchRates("ZAR");
  ratesByBase["USD"] = await fetchRates("USD");
}

// Function to get the latest rates from the API
fetchDefaultRates();

amountA.addEventListener("input", onValueAChange);
amountA.addEventListener("wheel", onValueAChange);
amountB.addEventListener("input", onValueBChange);
amountB.addEventListener("wheel", onValueBChange);

const optionsHTML = generateSelectList(currencies);
currencyA.value = 0;
currencyB.value = 0;

// Generate the select values
const fromCurrencyListHTML = generateSelectList(currencies, "ZAR");
// assign the list of select populate the options elements
currencyA.innerHTML = fromCurrencyListHTML;
const toCurrencyListHTML = generateSelectList(currencies, "USD");
currencyB.innerHTML = toCurrencyListHTML;
