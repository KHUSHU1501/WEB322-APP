/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Khushwant Singh Rao     Student ID: 145931192    Date: 05/12/2021
*
* Online (Heroku) Link: https://obscure-coast-19516.herokuapp.com/
*
********************************************************************************/
const Sequelize = require('sequelize');
var sequelize = new Sequelize('d9ehln43l0u9nm', 'jpuckdvnjgprsg', '1c6ddc9f8b6ef3386c7fa8ca1ce99949544481d03e3c2f17576a4f67f67b17f3', {
    host: 'ec2-54-88-154-67.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    }
   });

sequelize
.authenticate()
.then(function() {
    console.log('Connection has been established successfully.');
})
.catch(function(err) {
    console.log('Unable to connect to the database:', err);
});

var Employee = sequelize.define('Employee', {
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
    hireDate: Sequelize.STRING, 
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING});

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize=()=>
{
    return new Promise((resolve,reject) =>{
        sequelize.sync()
                .then(resolve('database synced'))
                .catch(reject('unable to sync the database'));
        reject();
    });
}

module.exports.getAllEmployees = ()=>
{
    return new Promise((resolve,reject)=>{
        Employee.findAll().then(function(data){
            //console.log(data);
            resolve(data)
        }).catch(()=>{
            console.log('employess not found');
            reject('no results returned')
        })
    });
    //
}

module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Department.findAll().then(function (data) {
            resolve(data);
        }).catch((err) => {
            reject("query returned 0 results"); return;
        });
    });
}

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var prop in employeeData) {
            if(employeeData[prop] == '')
                employeeData[prop] = null;
        }

        Employee.create(employeeData).then(() => {
            console.log("Success");
            resolve();
        }).catch((err)=>{
            reject("unable to create employee"); return;
        });

    });

};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status: status
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("query returned 0 results"); return;
        });
    });
};

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department: department
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("query returned 0 results"); return;
        });
    });
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("query returned 0 results"); return;
        });
    });
};

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("query returned 0 results"); return;
        });
    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var prop in employeeData) {
            if (employeeData[prop] == '')
                employeeData[prop] = null;
        }

        Employee.update(employeeData, {
            where: { employeeNum: employeeData.employeeNum } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update employee"); return;
        });
    });
};


module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {

        for (var prop in departmentData) {
            if(departmentData[prop] == '')
                departmentData[prop] = null;
        }

        Department.create(departmentData).then(() => {
            resolve();
        }).catch((e)=>{
            reject("unable to create department"); return;
        });

    });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {

        for (var prop in departmentData) {
            if (departmentData[prop] == '')
                departmentData[prop] = null;
        }

        Department.update(departmentData, {
            where: { departmentId: departmentData.departmentId } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update department"); return;
        });
    });

};

module.exports.getDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("query returned 0 results"); return;
        });
    });
};

module.exports.deleteDepartmentById = function(depId){
    return new Promise(function (resolve, reject) {
        Department.destroy({
            where: {
                departmentId: depId
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete department"); return;
        });
    });
}
//Like department destory funct
module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete employee"); return;
        });
    });
}
