const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
require('dotenv').config(); // secret file

//This tells express to set up our template engine has handlebars
app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");

// load static resources
app.use(express.static("public"));

// This tells express to make form data available via req.body in every request
app.use(bodyParser.urlencoded({ extended: false }));



// Home ROUTE
app.get("/", (req,res) => {
    res.render("home", {
        title : "Home Page"
    });
})

// sendtext ROUTE
app.get("/sendtext", (req,res)=>{
    res.render("sms", {
        title : "SMS Page"
    });
})

// POST ROUTE -- Handle the submitted data from the sms form
app.post("/sendText", (req,res)=>{

    const errors = [];

    if(req.body.phoneNo == ""){
        errors.push("You must enter a phone number");
    }

    if(req.body.message == ""){
        errors.push("You must enter a message");
    }

    // This is if the user failed the validation
    if (errors.length > 0) {
        res.render("sms", {
            title : "SMS Page",
            errorMessages : errors
        });
    }
    // There are no errors
    else {
        const accountSID = process.env.accountSid;
        const authToken = process.env.authToken;

        const client = require('twilio')(accountSID, authToken);

        client.messages
        .create({
            body: `${req.body.message}`,
            from: '+12029317250',
            to: `${req.body.phoneNo}`
        })
        .then(message => {
            console.log(message.sid);
            res.redirect("/");
        });
        
    }
});


// LISTEN TO PORT
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Web Application is up and running!!!");
})