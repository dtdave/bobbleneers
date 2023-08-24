// Variables
const axios = require("axios").default;
const crypto = require("crypto");
const querystring = require("querystring");
if (!process.env.tenantUri) {
  console.log("Warning!  Variables not set!");
}
const authUri = "https://sso.dynatrace.com/sso/oauth2/token";
const logUri = "https://" + process.env.tenantUri + "/api/v2/logs/ingest";
const bizUri = "https://" + process.env.tenantUri + "/api/v2/bizevents/ingest";

const token = process.env.tenantToken;
const oAuthClientId = process.env.clientId;
const oAuthSecret = process.env.clientSecret;
var oAuthCredentials; // oAuth creds
var oAuthTimer = new Date(); // set a timer for refreshing oAuth token

//Functions
function setTimer(minutes) {
  rightNow = new Date();
  // console.log(rightNow);
  return new Date(rightNow.getTime() + minutes * 60000);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const names = [
  "Richard L. Lambert",
  "Robert E. Williams",
  "Troy S. Igney",
  "David Manes",
  "Gary Carr",
  "Michael Hoernemann",
  "Anthony Pope-cruz",
  "Matthew Caminiti",
  "Jaime A. Chavez Barragan",
  "Alan D. Paoloni",
  "Alejandro Nunez Valdivia",
  "Francisco Merino Menares",
  "Uriel S. Ramirez Castaño",
  "Andrea Calderon",
  "Alejandro Mercado",
  "Carlos A. Fernandez Garcia",
  "Angel Aleman Santos",
  "Jorge Ricardo Rea Santiago",
  "Jose Angel Estrada Sanchez",
  "Raymundo Nunez Pena",
  "Ricardo J. Julia Diaz",
  "Handerson Medeiros",
  "Andrey R. Intima",
  "Alan R. Delcaro",
  "Alexandre Sacco",
  "Francisco Merino Menares",
  "Igor Simoes",
  "Gabriel Marques",
  "Willian Rodrigues",
  "Marcelo B. Coletta",
  "John Rath",
  "Thomas Lagona",
  "Nathan Mcclain",
  "Daniel Petreyko",
  "Kevin M. Colton",
  "David E. Thomas",
  "Shawn Pearson",
  "Richard St. John",
  "Michael Ferguson",
  "Jerry Lobenstein",
  "Michael S. Ditmar",
  "Robert Stojan",
  "Joshua Wood",
  "Jeffrey Neau",
  "Lawrence Cuneaz",
  "Nathan Kunz",
  "Sean M. Feeney",
  "Cooper J. Fecteau",
  "Devon Mitchell",
  "Jigar Pithwa",
  "Pravin Dandra",
  "Michael Sarbacker",
  "David Rupert",
  "Timothy J. Finkbeiner",
  "Keith Ellis",
  "Cynthia L. Harper",
  "Kirk Sievers",
  "Eric Monterastelli",
  "Rodrigo Alvarez Seoane",
  "Matthew S. Gardner",
  "Willie F. Hicks Jr.",
  "Susan R. StClair",
  "Carl Audet",
  "David Jones",
  "Kyle Harrington",
  "Shivashish Pati",
  "Ryan Shaw",
  "Joseph Nguyen",
  "Jason Bortolotti",
  "Brendan Steiner",
  "Michael Taylor",
  "Paul D. Brugan",
  "Arun Gopal",
  "James Conrad",
  "John DeBlasio",
  "Scott Zillitto",
  "Phillip Rand",
  "William Abbott",
  "Douglas Pak",
  "Alexander R. Brewers",
  "Benjamin W. Styx",
  "Jacob Norkus",
  "Nicoe Welch",
  "Santiago F. Palacios Garcia",
  "Aditya Ganesh",
  "Sara Al-Hayale",
  "Andrew Chasin",
  "Markie Duby",
  "Arihant Polavarapu",
  "Edin D. Cristofi",
  "Justin Phelps",
  "Aakash Kadakia",
  "Stephen Schleh",
  "Kendon Cowart",
  "Elijah W. Gillis-Watson",
  "Mateusz Gibiec",
  "Brian Chandler",
  "Jason Ostroski",
  "Joseph Bologna",
  "Eric Eiswerth",
  "Courtney D. Sparks",
  "Jeffery Yarbrough",
  "Timothy E. Yara",
  "Thomas J. Clinkenbeard",
  "Nish Rama",
  "Tory Clark",
  "Robin Beran",
  "Robert J. Vogler",
  "Kyle Kowalski",
  "Jacob R. Crawford",
  "Gregory Speckhart",
  "Jeffery Fynboh",
  "Brian J. Wilson",
];

function getGoodFeedback(productNickName) {
  const feedback = [
    "Product is awesome, shipped as advertised!",
    "Great product, shipped fast",
    "High quality- my kids are enormous fans of " + productNickName + "!",
    "Can't believe how great this is.  Now I've got " + productNickName + " cheering me on all day at my desk!",
    "This is great- and got here in 2 days.  So impressive!",
    "I can't believe I have " +
      productNickName +
      " with me all of the time.  I imagine they're cheering '" +
      productNickName +
      "! " +
      productNickName +
      "!'  every time I write an email.",
  ];
  review = feedback[Math.floor(Math.random() * feedback.length)];
  return review;
}

function getBadFeedback(productNickName) {
  const feedback = [
    "LightningBobble, more like Lame-o-Bobble.  Took forever to arrive.",
    "I purchased " + productNickName + " for my niece's birthday.  Arrived 4 days later- she was devastated.",
    "YOU ALL SUCK.  REFUNDED!!ONEONE!!ONE!",
    "Wow, way to ruin my week.  I told everyone at work I'd bring in " +
      productNickName +
      " to show them, but I still haven't got it yet.  Company did refund shipping as promised.",
    "Confidence totally shaken in an otherwise outstanding company.  Their new shipping service is awful.  Immediately requested shipping refund.",
  ];
  review = feedback[Math.floor(Math.random() * feedback.length)];
  return review;
}

function dayDelay(baseDay) {
  switch (baseDay) {
    case 0:
      mondayDelay = 1;
      break;
    case 1:
      mondayDelay = 0;
      break;
    case 2:
      mondayDelay = 6;
      break;
    case 3:
      mondayDelay = 5;
      break;
    case 4:
      mondayDelay = 4;
      break;
    case 5:
      mondayDelay = 3;
      break;
    case 6:
      mondayDelay = 2;
      break;
  }
  return mondayDelay;
}

function warehouse() {
  const scenarioNumber = getRandomInt(1, 7);

  switch (scenarioNumber) {
    case 1:
      warehouseLocation = "Nevada";
      break;
    case 2:
      warehouseLocation = "Michigan";
      break;
    case 3:
      warehouseLocation = "Florida";
      break;
    case 4:
      warehouseLocation = "Boston";
      break;
    case 5:
      warehouseLocation = "California";
      break;
    case 6:
      warehouseLocation = "Minnesota";
      break;
    case 7:
      warehouseLocation = "Oregon";
      break;
  }
  return warehouseLocation;
}

const newData = async () => {
  const logIngest = [];
  const bizIngest = [];
  const customerName = names[Math.floor(Math.random() * names.length)];
  const productOrdered = names[Math.floor(Math.random() * names.length)];
  const productNickName = productOrdered.split(" ")[0];
  const customeruid = crypto.randomUUID();
  const orderid = crypto.randomUUID();
  console.log("order id: ", orderid);
  const shipDelay = getRandomInt(18, 28);
  const logDate = new Date();
  const dateModifier = getRandomInt(0, 14);
  const baseDate = new Date(new Date(logDate).setDate(logDate.getDate() - dateModifier));
  const baseDay = baseDate.getDay();
  var mondayDelay, warehouseLocation, shipTime, deliveryTime, distVersion, lightningStatus, content, review, rating;
  mondayDelay = dayDelay(baseDay);
  warehouseLocation = warehouse();

  if (warehouseLocation == "Nevada") {
    //BAD scenario - likely too long and customer unhappy
    shipTime = new Date(new Date(baseDate).setHours(baseDate.getHours() + 24 + 24 * mondayDelay));
    deliveryTime = new Date(new Date(baseDate).setHours(baseDate.getHours() + shipDelay + 24 + 24 * mondayDelay));
    distVersion = "1.2";
    lightningStatus = "ERROR";
    content = "Shipment service returned: [ERROR ZipCode Required!]";
  } else {
    //GOOD scenario
    shipTime = new Date(new Date(baseDate).setHours(baseDate.getHours() + 24));
    deliveryTime = new Date(new Date(baseDate).setHours(baseDate.getHours() + shipDelay + 24));
    distVersion = "1.3";
    lightningStatus = "INFO";
    content = "Shipment sent for processing";
  }

  if (shipTime.getDate() - baseDate.getDate() > 2) {
    //Took too long to ship. customer angy.
    review = getBadFeedback(productNickName);
    rating = 1;
  } else {
    //happy customer
    review = getGoodFeedback(productNickName);
    rating = getRandomInt(3, 5);
  }
  // Log Event Creation
  const orderTaken = {
    company: "Bobbleneers",
    serviceName: "orders",
    timestamp: new Date(),
    content: "Order processed successfully",
    serviceEvent: "orderreceived",
    httpReturnCode: 200,
    customerID: customeruid,
    customerName: customerName,
    orderid: orderid,
    bobbleheadOrdered: productOrdered,
    log: "/var/log/orderservice",
    ServiceVersion: "3.1",
    event: baseDate,
  };
  const orderReview = {
    company: "Bobbleneers",
    content: "Review submitted successfully",
    serviceName: "reviews",
    timestamp: new Date(),
    serviceEvent: "reviewreceived",
    customerID: customeruid,
    orderid: orderid,
    log: "/var/log/reviewservice",
    rating: rating,
    review: review,
    ServiceVersion: ".8",
    event: baseDate,
  };
  const orderLightningDist = {
    company: "Bobbleneers",
    serviceName: "lightningDistribution",
    content: "LightningDistribution successful",
    timestamp: new Date(),
    serviceEvent: "warehousedistribution",
    orderid: orderid,
    log: "/var/log/distributionservice",
    ServiceVersion: distVersion,
    status: lightningStatus,
    content: content,
    warehouse: warehouseLocation,
    event: baseDate,
  };
  const orderBatchDist = {
    company: "Bobbleneers",
    serviceName: "oldfaithfulDistribution",
    content: "Monday night batch successful",
    timestamp: new Date(),
    serviceEvent: "warehousedistribution",
    orderid: orderid,
    log: "/var/log/oldfaithfulservice",
    warehouse: warehouseLocation,
    ServiceVersion: "6.8",
    content: "Weekly distribution process: Forwarding to distrubution center.",
    status: "INFO",
    event: new Date(new Date(baseDate).setDate(baseDate.getDate() + mondayDelay)),
  };
  const orderShipment = {
    company: "Bobbleneers",
    content: "Order Shipped",
    serviceName: "shipping",
    serviceEvent: "shipped",
    warehouse: warehouseLocation,
    timestamp: new Date(),
    orderid: orderid,
    log: "/var/log/shippingservice",
    ServiceVersion: "1.1",
    event: shipTime,
  };
  const orderDelivered = {
    company: "Bobbleneers",
    content: "Order Delivered",
    serviceName: "shipping",
    serviceEvent: "delivered",
    timestamp: new Date(),
    orderid: orderid,
    log: "/var/log/shippingservice",
    ServiceVersion: "1.1",
    event: deliveryTime,
  };
  logIngest.push(orderTaken, orderReview, orderLightningDist, orderShipment, orderDelivered);
  if (warehouseLocation == "Nevada") {
    logIngest.push(orderBatchDist);
  }

  // BizEvents version.  OW my brain.
  const cloudEventOrderTaken = {
    specversion: "1.0",
    id: orderid,
    source: "bobbleneers.local.orders",
    type: "com.bobbleneers.orders",
    data: orderTaken,
  };
  const cloudEventOrderReview = {
    specversion: "1.0",
    id: orderid,
    source: "bobbleneers.local.reviews",
    type: "com.bobbleneers.reviews",
    data: orderReview,
  };
  const cloudEventOrderLightningDist = {
    specversion: "1.0",
    id: orderid,
    source: "bobbleneers.local.lightning",
    type: "com.bobbleneers.lightning",
    data: orderLightningDist,
  };
  const cloudEventorderBatchDist = {
    specversion: "1.0",
    id: orderid,
    source: "bobbleneers.local.batch",
    type: "com.bobbleneers.batch",
    data: orderBatchDist,
  };
  const cloudEventOrderShipment = {
    specversion: "1.0",
    id: orderid,
    source: "bobbleneers.local.shipment",
    type: "com.bobbleneers.shipment",
    data: orderShipment,
  };
  const cloudEventOrderDelivered = {
    specversion: "1.0",
    id: orderid,
    source: "bobbleneers.local.delivery",
    type: "com.bobbleneers.delivery",
    data: orderDelivered,
  };
  bizIngest.push(
    cloudEventOrderTaken,
    cloudEventOrderReview,
    cloudEventOrderLightningDist,
    cloudEventOrderShipment,
    cloudEventOrderDelivered
  );
  if (warehouseLocation == "Nevada") {
    bizIngest.push(cloudEventorderBatchDist);
  }
  const ingest = { bizIngest: bizIngest, logIngest: logIngest };
  return ingest;
};

const sendLogEntry = async (data) => {
  const headers = {
    accept: "application/json; charset=utf-8",
    "Content-type": "application/json; charset=utf-8",
    Authorization: "Api-Token " + token,
  };
  try {
    const resp = await axios.post(logUri, data, { headers: headers });
    console.log("Log write successful: HTTP ", resp.status);
  } catch (err) {
    console.error("Log write failed: ", err.response.status);
  }
};

const sendBizEvent = async (data) => {
  // check oAuth
  const currentDate = new Date();
  const authTimeRemaining = (oAuthTimer.getTime() - currentDate.getTime()) / 1000;
  if (authTimeRemaining < 60) {
    console.log("Refreshing oAuth. Expiration in: ", authTimeRemaining, "s.");
    await getAuth();
  }
  const headers = {
    Authorization: "Bearer " + oAuthCredentials,
  };

  // Try to Write to API
  try {
    const resp = await axios.post(bizUri, data, { headers: headers });
    console.log("bizEvent write successful: HTTP ", resp.status);
  } catch (err) {
    // Handle Error Here
    console.error("BizEvent write failed: ", err.response);
  }
};

const getAuth = async () => {
  const oAuthHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const data = {
    grant_type: "client_credentials",
    client_id: oAuthClientId,
    client_secret: oAuthSecret,
  };

  try {
    const resp = await axios.post(authUri, querystring.stringify(data), { headers: oAuthHeaders });
    if (resp.status == 200) {
      oAuthCredentials = resp.data.access_token;
      oAuthTimer = setTimer(resp.data.expires_in);
    } else {
      console.log("Boo. I got non-200 response: ", resp.status);
    }
  } catch (err) {
    console.error(err);
  }
  console.log("refreshed token.  Timer is: ", oAuthTimer);
};

async function main() {
  const data = await newData();
  sendLogEntry(data.logIngest);
  sendBizEvent(data.bizIngest);
}

setInterval(() => {
  main();
}, 2000);
