/***************************************************************************************************
 * BTI325 – Assignment 4
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source 
 * (including 3rd party web sites) or distributed to other students. 
 * 
 * Name: Raymond Chu Student ID: 113429195 Date: 2020 - 11 - 07 
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
const exphbs = require('express-handlebars');
const HTTP_PORT = process.env.PORT || 8080;

//Middlewares
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

//express-handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: (url, options) => {
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
            },
        equal: (lvalue, rvalue, options) => {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) 
                return options.inverse(this);
            else 
                return options.fn(this);
            
        }
    }
 }));
app.set('view engine', '.hbs');

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
    res.render('home');
});

//About Route
app.get('/about', (req, res) => {
    res.render('about')
});

//Route to addEmployee hbs
app.get('/employees/add', (req, res) => {
    res.render('addEmployee');
})

//Route addImage hbs
app.get('/images/add', (req, res) => {
    res.render('addImage');
})


//Route that checks if there is a query first to display the appropriate employees
app.get('/employees', (req, res) => {
    if (req.query.status) {
        callfunction = Dataservice.getEmployeesByStatus(req.query.status)
    }
 
    else if (req.query.department) {
        callfunction = Dataservice.getEmployeesByDepartment(req.query.department) 
    }

    else if (req.query.manager) {
        callfunction = Dataservice.getEmployeesByManager(req.query.manager) 
    }

    else {
        callfunction = Dataservice.getAllEmployees();
    }

    callfunction
    .then((data) => {
        res.render("employees", {
            employees: data
        })
    })
    .catch((err) => {
        res.render("employees", {
            message: "no results"
        })
    }) 

});

//Departments Route
app.get('/departments', (req, res) => {
    Dataservice.getDepartments()
    .then((data) => {
        res.render("departments", {
            departments: data
        })
    })
    .catch((err) => {
        res.render("departments", {
            message: "no results" 
        })
    })
});


//Route to post image and save image into the public/images/uplaoded directory
app.post('/images/add',upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
})

//Route that reads the directory where the images are saved and returns a JSON string to screen
app.get('/images', (req, res) => {
   /*  fs.readdir("./public/images/uploaded", (err, items) => {
        if (err) throw err;
        res.json({"images" : items});
    }) */
    fs.readdir("./public/images/uploaded", (err, items) => {
        if (err) throw err;
        res.render("images", {
            image: items
        });
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
        res.render("employee", {
            employee: data
        })
    })
    .catch((err) => {
        res.render("employee", {
            message: "no results"
        })
    })
})

//updates employee route
app.post('/employee/update', (req, res) => {
    Dataservice.updateEmployee(req.body)
    .then(res.redirect('/employees'))
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