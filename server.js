/***************************************************************************************************
 * BTI325 – Assignment 2 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source 
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: Raymond Chu Student ID: 113429195 Date: 2020 - 10 - 10 
 * 
 * Online (Heroku) Link: https://agile-badlands-56742.herokuapp.com/
 * 
 **************************************************************************************************/
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const Dataservice = require('./data-service.js');
const bodyParser = require('body-parser');
const fs = require('fs');
const HTTP_PORT = process.env.PORT || 8080;

//Middlewares
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

//Storage
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

//Tells multer to use diskStorage function for naming files instead of default
const upload = multer({ storage: storage });

//Routes

//Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

//About Route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

//Route that checks if there is a query first to display the appropriate employees
app.get('/employees', (req, res) => {

    if (req.query) {
        if (req.query.status) {
            Dataservice.getEmployeesByStatus(req.query.status)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.send(err);
            })
        }

        if (req.query.department) {
            Dataservice.getEmployeesByDepartment(req.query.department) 
            .then((data => {
                res.json(data);
            }))
            .catch((err) => {
                res.send(err);
            })
        }

        if (req.query.manager) {
            Dataservice.getEmployeesByManager(req.query.manager) 
            .then((data => {
                res.json(data);
            }))
            .catch((err) => {
                res.send(err);
            })
        }
    }

    else {
        Dataservice.getAllEmployees()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.send(err);
        }) 
    }
});

//Managers Route
app.get('/managers', (req, res) => {
    Dataservice.getManagers()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.send(err);
    })
});

//Departments Route
app.get('/departments', (req, res) => {
    Dataservice.getDepartments()
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.send(err);
    })
});

//Route to html page to add an employee
app.get('/employees/add', (req, res) => {
    res.sendFile(path.join(__dirname, "views/addEmployee.html"));
})

//Rooute to html page too add an image
app.get('/images/add', (req, res) => {
    res.sendFile(path.join(__dirname, "views/addImage.html"));
})

//Route to post image and save image into the public/images/uplaoded directory
app.post('/images/add',upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
})

//Route that reads the directory where the images are saved and returns a JSON string to screen
app.get('/images', (req, res) => {
    fs.readdir("./public/images/uploaded", (err, items) => {
        if (err) throw err;
        res.json({"images" : items});
    })
})

//Route that posts the newly added employee into the employees array
app.post('/employees/add', (req, res) => {
    Dataservice.addEmployee(req.body)
    .then(res.redirect('/employees'));
})

//Route that retrieves an employee with a given employee number in the param
app.get('/employee/:value', (req, res) => {
    Dataservice.getEmployeeByNum(req.params.value)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        res.send(err);
    })
})




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