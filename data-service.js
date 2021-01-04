const Sequelize = require('sequelize');

const sequelize = new Sequelize('dd784l2aep9nf6', 'uvexekvrbkfavp', 'd6bcd8ced1dc5890eaca418f8cf52cb0e232385ec7cc714a3e5e8c94645930d6', {
    host: 'ec2-34-237-166-54.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});

//authentication with db
sequelize.authenticate()
.then(() => {
    console.log('Connection success');
})
.catch((err) => {
    console.log("Unable to connect to DB", err);
});

//define employees table
const Employees = sequelize.define('Employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
});

//define departments table
const Departments = sequelize.define('Departments', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    departmentName: Sequelize.STRING,
});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {
            console.log("postgres connected!");
           resolve();
        })

        .catch((err) => {
            reject("Unable to synchronize with the database!", err);
        })
    })
}

module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        Employees.findAll({
            order: ['employeeNum']
        })
        .then((data) => {
            resolve(data);
        })
        .catch(() => {
            reject("No employees found");
        })
    })
}

module.exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Departments.findAll({
            order: ['departmentId']
        })
        .then((data) => {
            resolve(data);
        })
        .catch(() => {
            reject("No results found!");
        })
    })
}

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (const prop in employeeData) {
            if(employeeData[prop] == '') {
                employeeData[prop] = null;
            }
        }

        Employees.create({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate,
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            console.log(err);
            reject("Unable to create employee!");
        })
    })
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        Employees.findAll({
            where: {
                status: status
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch(() => {
            reject("No results found!");
        })
    })
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        Employees.findAll({
            where: {
                department: department
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch(() => {
            reject("No results found!");
        })
    })
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        Employees.findAll({
            where: {
                employeeManagerNum: manager
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch(() => {
            reject("No results found!");
        })
    })
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        Employees.findAll({
            where: {
                employeeNum: num
            }
        })
        .then((data) => {
            resolve(data[0]);
        })
        .catch(() => {
            reject("No results found!");
        })
    })
}

module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (const emp in employeeData) {
            if (emp.isManager == "") {
                emp.isManager = null;
            }
        }

        Employees.update({
            firstName: employeeData.firstname,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate,
        },  {
            where: { employeeNum: employeeData.employeeNum }
        })
        .then(() => {
            resolve();
        })
        .catch(() => {
            reject("Unable to update")
        })
    })
}

module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for (const dep in departmentData) {
            if (dep.departmentId == "") {
                dep.departmentId = null;
            }

            if (dep.departmentName == "") {
                dep.departmentName = null;
            }
        }

        Departments.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })

    })
}

module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for (const dep in departmentData) {
            if (dep.departmentId == "") {
                dep.departmentId = null;
            }

            if (dep.departmentName == "") {
                dep.departmentName = null;
            }
        }
        console.log(departmentData);
        Departments.update({
            departmentName: departmentData.departmentName
        }, {
            where: { departmentId: departmentData.departmentId }
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Departments.findAll({
            where: {
                departmentId: id
            }
        })
        .then((data) => {
            resolve(data[0]);
        })
        .catch((err) => {
            reject("No results found", err);
        })
    })
}

module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise((resolve, reject) => {
        Employees.destroy({
            where: {
                employeeNum: empNum
            }
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject("Unable to remove employee");
        })
    })
}