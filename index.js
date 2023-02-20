const express = require("express");
const axios = require("axios").default;
const crypto = require("crypto");

const app = express();
const uri = "https://" + process.env.tenantUri + "/api/v2/logs/ingest";
const token = process.env.tenantToken;
//console.log("uri", uri);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const headers = {
  accept: "application/json; charset=utf-8",
  "Content-Type": "application/json; charset=utf-8",
  Authorization: "Api-Token " + token,
};

const newPost = async () => {
  const logIngest = [];
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
  const customerName = names[Math.floor(Math.random() * names.length)];
  const productOrdered = names[Math.floor(Math.random() * names.length)];
  const productNickName = productOrdered.split(" ")[0];
  const goodFeedback = [
    "Product is awesome, shipped as advertised!",
    "Great product, shipped fast",
    "High quality- my kids are enormous fans of " + productNickName + "!",
    "Can't believe how great this is.  Now I've got " + productNickName + " cheering me on all day at my desk!",
    "This is great- and got here in 2 days.  So impressive!",
    "I can't believe I have " +
      productNickName +
      " with me all of the time.  I imagine they're cheering '" +
      customerName +
      "! " +
      customerName +
      "!'  every time I write an email.",
  ];
  const badFeedback = [
    "LightningBobble, more like Lame-o-Bobble.  Took forever to arrive.",
    "I purchased " + productOrdered + " for my niece's birthday.  Arrived 4 days later- she was devastated.",
    "YOU ALL SUCK.  REFUNDED!!ONEONE!!ONE!",
    "Wow, way to ruin my week.  I told everyone at work I'd bring in " +
      productOrdered +
      " to show them, but I still haven't got it yet.  Company did refund shipping as promised.",
    "Confidence totally shaken in an otherwise outstanding company.  Their new shipping service is awful.  Immediately requested shipping refund.",
  ];

  const customeruid = crypto.randomUUID();
  const orderid = crypto.randomUUID();
  const shipDelay = getRandomInt(18, 28);
  const logDate = new Date();
  const dateModifier = getRandomInt(0, 14);
  const baseDate = new Date(new Date(logDate).setDate(logDate.getDate() - dateModifier));
  const baseDay = baseDate.getDay();
  var mondayDelay, warehouseLocation, shipTime, deliveryTime, distVersion, lightningStatus, content, review, rating;
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
  console.log(mondayDelay);

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
    review = badFeedback[Math.floor(Math.random() * badFeedback.length)];
    rating = 1;
  } else {
    //happy customer
    review = goodFeedback[Math.floor(Math.random() * goodFeedback.length)];
    rating = getRandomInt(3, 5);
  }
  console.log("base ", baseDate, shipTime, review);
  //return customeruid;

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
    serviceName: "reviews",
    timestamp: new Date(),
    serviceEvent: "reviewreceived",
    customerID: customeruid,
    log: "/var/log/reviewservice",
    rating: rating,
    review: review,
    ServiceVersion: ".8",
    event: baseDate,
  };
  const orderLightningDist = {
    company: "Bobbleneers",
    serviceName: "lightningDistribution",
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
    serviceName: "shipping",
    serviceEvent: "delivered",
    timestamp: new Date(),
    orderid: orderid,
    log: "/var/log/shippingservice",
    ServiceVersion: "1.1",
    event: deliveryTime,
  };
  logIngest.push(orderTaken, orderReview, orderLightningDist, orderShipment, orderDelivered);
  if (scenarioNumber == 1) {
    logIngest.push(orderBatchDist);
  }
  return logIngest;
};

const sendPostRequest = async () => {
  const data = await newPost();
  try {
    const resp = await axios.post(uri, data, { headers: headers });
    console.log("data", resp);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};
//console.log(newPost());
setInterval(() => {
  sendPostRequest();
}, 2000);

// Increment post tracker
// console.log("Wait for 2 second...");
//sendPostRequest();
// Make GET Request on every 2 second
//   const res = await axios.post('https://httpbin.org/post', { hello: 'world' }, {
//   headers: {
//     // 'application/json' is the modern content-type for JSON, but some
//     // older servers may use 'text/json'.
//     // See: http://bit.ly/text-json
//     'content-type': 'text/json'
//   }
// });

// res.data.headers['Content-Type']; // text/json
// axios
//   .get(`https://jsonplaceholder.typicode.com/posts/${num}`)

//   // Print data
//   .then((response) => {
//     const { id, title } = response.data;
//     console.log(`Post ${id}: ${title}\n`);
//   })

//   // Print error message if occur
//   .catch((error) => console.log("Error to fetch data\n"));
