const {
    Router
} = require('express');

const router = Router();
const bcrypt = require('bcrypt');
const signUpTemplateCopy = require('../Models/models');
const UserData = require('../Models/models');
const {
    default: mongoose
} = require('mongoose');


const saltRounds = 10;


router.route("/Register")
    .post(async (req, res, next) => {
        try {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                const user = new signUpTemplateCopy({
                    firstName: (req.body.firstname).toLowerCase(),
                    lastName: (req.body.lastname).toLowerCase(),
                    userName: (req.body.username).toLowerCase(),
                    email: (req.body.email).toLowerCase(),
                    password: hash
                });

                user.save();
                console.log(user);

                const createdUser = user;
                res.json({
                    username: createdUser.userName,
                    firstName: createdUser.firstName,
                    lastName: createdUser.lastName
                })

            })

        } catch (error) {
            if (error.constructor.name === 'ValidationError') {
                res.status(422);
            }
            next(error);

        }

    })


router.route('/Login')
    .post(async (req, res, next) => {
        try {
            const username = (req.body.username).toLowerCase();
            const password = req.body.password;

            UserData.findOne({userName: username}, (err, foundUser) => {
                if (err) {
                    console.log(err);
                } else if (!foundUser) {
                    res.send({message : "User does not exist"});
                } else {
                    if (foundUser) {
                        bcrypt.compare(password, foundUser.password, (err, result) => {
                            if (result === true) {
                                res.send({message : "Username and password match", user : {firstName : foundUser.firstName, lastName : foundUser.lastName}});
                                console.log("Logged in successfully");
                                
                            } else {
                                res.send({message : "Wrong username or password"})
                                console.log("Wrong username or password");
                            }
                        })
                    }
                }

            })
        } catch(error) {
            if(error.constructor.name === 'ValidationError'){
                res.status(422);
            }
            next(error);

        }
    })

module.exports = router;