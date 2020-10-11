const fs = require('fs');

var employees = [];
var departments = [];

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {

        fs.readFile('./data/employees.json', (err, data) => { //reads employees.json data as a string
            if (err) throw err;
            employees = JSON.parse(data); //parses the JSON string data and converts it into an array of objects
            if (employees.length <= 0) {
                console.log("Employees array is empty!");
                reject(); // Rejects if employees array is still empty
            }

            // Reads the departments.json file only if employees array is filled up first
            else {
                fs.readFile('./data/departments.json', (err, data) => { //read departments.json data as a string
                    if (err) throw err;
                    departments = JSON.parse(data);
                    if (departments.length <= 0) {
                        console.log("Departments array is empty!");
                        reject(); // Rejects if department array is empty
                    }

                    else {
                        resolve(); // wiil only resolve when it gets to this point where employees and departments array is filled up
                    }
                })
            }
        })
    })
}

module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        if (employees <= 0) {
            reject("No results returned!");
        }
        
        else {
            resolve(employees);
        }
    })
}

module.exports.getManagers = () => {
    let managers = [];
    return new Promise ((resolve, reject) => {
        for (let i = 0; i < employees.length; ++i) {
            if (employees[i].isManager == true) {
                managers.push(employees[i]);
            }
        }

        if (managers.length > 0) {
            resolve(managers);
        }

        else {
            reject("There are no managers!");
        }
    })
}

module.exports.getDepartments = () => {
    return new Promise ((resolve, reject) => {
        if (departments <= 0) {
            reject("No results returned!");
        }

        else {
            resolve(departments);
        }
    })
}