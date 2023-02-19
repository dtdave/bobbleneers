const express = require("express");
import axios from "axios";

const app = express();

setInterval(() => {
  // Increment post tracker
  console.log("Wait for 2 second...");

  // Make GET Request on every 2 second
  axios
    .get(`https://jsonplaceholder.typicode.com/posts/${num}`)

    // Print data
    .then((response) => {
      const { id, title } = response.data;
      console.log(`Post ${id}: ${title}\n`);
    })

    // Print error message if occur
    .catch((error) => console.log("Error to fetch data\n"));
}, 2000);
