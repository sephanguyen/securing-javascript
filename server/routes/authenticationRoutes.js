"use strict";

// ====================
//  /api/user
// ====================

/* eslint-disable no-console */

import {Router}                     from "express";
import cors                         from "cors";
import {getUserModel, getLoginsModel}               from "../data_access/modelFactory";
import colors                       from "colors";
import Promise                      from "bluebird";
import {registrationSchema, loginSchema}         from "../validation/validationSchemas";

const authenticationRouter = Router();

authenticationRouter.route("/api/user/register")
    .post(cors(), async function (req, res) {
        try {
            const User = await getUserModel();

            req.checkBody(registrationSchema);
            const errors = req.validationErrors();

            if (errors) {
                return res.status(500).json(errors);
            }

            const {email, password, firstName, lastName} = req.body;
            const existingUser = await User.findOne({username: email}).exec();
            if (existingUser) {
                return res.status(409).send(`The specified email ${email} address already exists.`);
            }

            const submittedUser = {
                firstName: firstName,
                lastName: lastName,
                username: email,
                email: email,
                password: password,
                created: Date.now()
            };

            const user = new User(submittedUser);

            await user.save()
                .then(function (doc) {
                    if (doc) {
                        console.log(colors.yellow(`Created User ${JSON.stringify(doc)}`));
                    }
                })
                .catch(function (err) {
                    if (err) {
                        console.log(colors.yellow(`Error occurred saving User ${err}`));
                    }
                });

            res.status(201).json({user: {firstName: user.firstName, lastName: user.lastName, email: user.email}});
        } catch (err) {
            console.log(colors.red(err));
            res.status(500).send("There was an error creating user.  Please try again later");
        }
    });


authenticationRouter.route("/api/user/login")
    .post(cors(), async function (req, res) {
        const delayResponse = response => {
            setTimeout(() => {
                response();
            }, 1000);
        };

        try {
            const User = await getUserModel();

            const {clientIp} = req;
            const {email, password} = req.body;

            req.checkBody(loginSchema);
            const errors = req.validationErrors();

            if (errors) {
                return delayResponse(() => res.status(401).send("Invalid username or password"));
            }

            const identityKey = `${email}-${clientIp}`;
            const Login = await getLoginsModel();

            if(!await Login.canAuthenticate(identityKey)) {
                return delayResponse(() => res.status(500).send("The account is temporarily locked out."));
            }

            const existingUser = await User.findOne({username: email}).exec();

            if (existingUser && await existingUser.passwordIsValid(password)) {
                const userInfo = {
                    _id: existingUser._id,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    username: existingUser.email
                };

                req.session.login(userInfo);
                await Logins.successfulLoginAttempt(identityKey);

                return delayResponse(() =>  res.status(200).json({
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    username: existingUser.email
                }));
            } else {
                await Logins.failedLoginAttempt(identityKey);
                return delayResponse(() => res.status(401).send("Invalid username or password"));
            }
        }
        catch (err) {
            console.log(err);
            return delayResponse(() => res.status(500).send("There was an error attempting to login. Please try again later."));
        }
    });

authenticationRouter.route("/api/user/logout")
    .get(cors(), function (req, res) {
        return new Promise(function (resolve, reject) {
            try {
                if (req.session) {
                    req.session.destroy();
                    resolve(res.sendStatus(200));
                }
            }
            catch (err) {
                return reject(res.sendStatus(500));
            }
        });

    });

export default authenticationRouter;