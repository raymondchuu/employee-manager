/***************************************************************************************************
 * BTI325 – Assignment 2 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source 
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: Raymond Chu Student ID: 113429195 Date: 2020 - 10 - 10 
 * 
 * Online (Heroku) Link: ________________________________________________________ 
 * 
 **************************************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const Dataservice = require('./data-service.js');
const HTTP_PORT = process.env.PORT || 8080;

//Middlewares
app.use(express.static('public'));

//Routes

//Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

//About Route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

//Employees Route -- returns JSON
app.get('/employees', (req, res) => {
    Dataservice.getAllEmployees()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    })
});

//Managers Route
app.get('/managers', (req, res) => {
    Dataservice.getManagers()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    })
});

//Departments Route
app.get('/departments', (req, res) => {
    Dataservice.getDepartments()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    })
});

//Catches all requests that do not match any of the URL of the routes above
app.use((req, res) => {
    res.status(404).send("Page Not Found");
})

//Listening for port
Dataservice.initialize()
.then(
    app.listen(HTTP_PORT, console.log('Express http server listening on ' + HTTP_PORT))
)
.catch((err) => {
    console.log(err);
})