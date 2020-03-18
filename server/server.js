var express = require("express");
var request = require("request");

// Setting up express app
const app = express();
// All files in the ./files directory will be served
// The homepage will be login.html
app.use(express.static("./files", {index: 'login.html'}));
app.use(express.urlencoded());
const port = 8080;
app.listen(port);

// Endpoint to authenticate using database
app.post("/authenticate", function(req, res) {
    var username = req.body.username;
    var pw = req.body.password;
    // Query the database to check if password matches given username
    res.send(JSON.stringify({"success": 1, "error": 0}))
})