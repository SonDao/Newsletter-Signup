const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// specify a static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({textextended: true}));

// go to /signup.html @ homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  // this is something that is documented on mailchimp, not that important
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  // this stuff is important
  var jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/9fbc2410fb";
  // javascript object
  // readd more one Node.js https native module
  const option = {
    method: "POST",
    auth: "sondao:1c7f8eb4f0e089401c9f2b32f94a8c8b-us17"
  }
  const request = https.request(url, option, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
      // res.send("Success!");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
      // res.send("there was an error");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});

// api key 1c7f8eb4f0e089401c9f2b32f94a8c8b-us17
// list ID 9fbc2410fb
