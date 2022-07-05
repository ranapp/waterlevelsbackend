// index.js
// This is our main server file

// include express
const express = require("express");
const bodyParser = require('body-parser');
const fetch = require("cross-fetch");
const path = require('path');
// create object to interface with express
const app = express();

app.use(express.json());



// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(function(req, res, next) {
  console.log("body contains",req.body);
  next();
});


// Hidden example of getting data from CDEC
app.post("/query/reservoirData", async function(req,res){
  let month = req.body.month;
  let year = req.body.year;
  console.log(month);
  console.log(year);
  console.log("getting data");
  let water = await lookupWaterData(month, year);
  // extract the date, the value, and stationID so we can map it
  // to the right axis
  console.log(water);
  res.json(water);
})

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"})
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const port = process.env.PORT || 8080;
app.listen(port);
console.log('App is listening on port ' + port);

async function lookupWaterData(month, year) {
  console.log("goes here");
  const api_url =  `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=${year}-${month}&End=${year}-${month}`;
  // const api_url2 = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=2022-01&End=2022-01";
  // send it off
  let fetchResponse = await fetch(api_url);
  let data = await fetchResponse.json();
  console.log(data);
  return data;
}