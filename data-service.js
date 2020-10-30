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

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        if (employeeData.isManager == undefined) {
            employeeData.isManager = false;
        }

        else {
            employeeData.isManager = true;
        } 

        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);

        resolve();
    })
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        let statusEmployees = [];

        for (var i = 0; i < employees.length; ++i) {
            if (employees[i].status == status) {
                statusEmployees.push(employees[i]);
            }
        }

        if (statusEmployees.length > 0) {
            resolve(statusEmployees);
        }

        else {
            reject("No employees found!");
        }
    })
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        let depEmployees = [];

        for (var i = 0; i < employees.length; ++i) {
            if (employees[i].department == department) {
                depEmployees.push(employees[i]);
            }
        }

        if (depEmployees.length > 0) {
            resolve(depEmployees);
        }

        else {
            reject("No employees found!");
        }
    })
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        let manEmployees = [];

        for (var i = 0; i < employees.length; ++i) {
            if (employees[i].employeeManagerNum == manager) {
                manEmployees.push(employees[i]);
            }
        }

        if (manEmployees.length > 0) {
            resolve(manEmployees);
        }

        else {
            reject("No employees found!");
        }
    })
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        let found = false;
        for (var i = 0; i < employees.length && !found; ++i) {
            if (employees[i].employeeNum == num) {
                resolve(employees[i]);
            }
        }

        reject("Employee not found!");
    })
}