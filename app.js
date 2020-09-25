//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); //to make the post request and send the data

const app = express();

app.use(express.static("public")) //to add static files like images or styles
app.use(bodyParser.urlencoded({
  extended: true
})); //set up body parser to be used client-server

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//grab the data from the signup form to console log it from our server
app.post("/", function(req, res) {
  //using body parser
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.eMail;
  // this is the way mailchimp needs tha data, read de API
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data); //converting the object into JSON in order to be sent

  const url = "https://us4.api.mailchimp.com/3.0/lists/89cecf8678" //us + last number of key + API EndPonit + id list

  const options = { //to make the post and aunthentification, read http node module and its methods
    method: "POST",
    auth: "aza:58ea2cf979acab4fd8b047dcfdd3b946-us4" //also read api doc
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode == 200) { //check for failure or success
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) { //check the date mailchimp sends
      console.log(JSON.parse(data)); //convert string into JSON and display it
    });
  });
  request.write(jsonData); //send the info to mailchimp server
  request.end();

});
//try again button
app.post("/failure", function(req, res) { //in case of failure, redirect to home route an try again
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
})

// APi key 58ea2cf979acab4fd8b047dcfdd3b946-us4
//unique id 89cecf8678
//https://$API_SERVER.api.mailchimp.com/3.0/lists
