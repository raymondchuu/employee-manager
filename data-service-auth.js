const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "userName": {
        "type": String, 
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User;
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        let db =  mongoose.connect("mongodb+srv://rchu14:senecabti325app@bti325-app.racjw.mongodb.net/bti325app?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
         .then(() => {
            User = mongoose.model("users", userSchema);
            console.log("DB connected successfully!");
            resolve();
        })
        .catch((err) => {
            console.log("Unable to connect to DB");
            reject(err);
        }) 
    })
}

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.userName === "" || userData.password === "" || userData.password2 === "") {
            reject("Error: user name or password cannot be empty or only white spaces!");
        }

        if (userData.password != userData.password2) {
            reject("Error: Passwords do not match!");
        }

        if (userData.password === userData.password2) {
            bcrypt.hash(userData.password, 10)
            .then((hashValue) => {
                const newUser = new User({
                    userName: userData.userName,
                    password: hashValue,
                    email: userData.email,
                });

                newUser.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        }

                        reject("There was an error creating the user: ", err);
                    }
        
                    else {
                        resolve();
                    }
                })
            });    
        }
    })
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            userName: userData.userName
        })
        .exec()
        .then((foundUser) => {
            bcrypt.compare(userData.password, foundUser.password)
            .then((res) => {
                if (res) {
                    foundUser.loginHistory.push({
                        dateTime:(new Date()).toString(), 
                        userAgent: userData.userAgent
                    });
    
                    User.updateOne(
                        { userName: userData.userName },
                        { $set: { loginHistory: foundUser.loginHistory } }
                    )
                    .exec()
                    .then(() => {
                        resolve(foundUser);
                    })
                    .catch((err) => {
                        reject("There was an error verifying the user: ", err);
                    })
                }
                else {
                    reject("Incorrect Password for user: " + foundUser.userName);
                }
            })
        })
        .catch((err) => {
            reject("Unable to find user: " + userData.userName);
        })
    })
}