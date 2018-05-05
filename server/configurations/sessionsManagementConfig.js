"use strict";
import connectionProvider           from "../data_access/connectionProvider";
import {serverSettings}             from "../settings";
import session                      from "express-session";
import mongoStoreFactory            from "connect-mongo";

export default function sessionManagementConfig(app){

    session.Session.prototype.login = function(user, cb){
        const req = this.req;
        req.session.regenerate(function(err){
            if(err) {
                cb(err);
            }
        })
        //this.userInfo = user;
        req.session.userInfo = user;
        cb();
    };

    const MongoStore = mongoStoreFactory(session);

    app.use(session({
        store: new MongoStore({
            dbPromise: connectionProvider(serverSettings.serverUrl, serverSettings.database),
            ttl: (1 * 60 * 60)
        }),
        secret: serverSettings.session.password,
        saveUninitialized: true,
        resave: false,
        cookie: {
            path: "/",
            httpOnly: true,
            secure: true,
            maxAge: 1 * 60 * 60 * 1000,
            sameSite: true 
        }
    }));
}
