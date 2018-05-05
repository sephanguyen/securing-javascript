"use strict";
/* eslint-disable no-console */

require("../shared/lib/extensions");
import express, {Router}            from "express";
import favicon                      from "serve-favicon";
import bodyParser                   from "body-parser";
import {initialize}                 from "./initializationTasks";
import webpack                      from "webpack";
import sessionManagementConfig      from "./configurations/sessionsManagementConfig";
import apiRouteConfig               from "./configurations/apiRoutesConfig";
import validationSchemaConfig       from "./configurations/validationSchemaConfig";
import staticResourcesConfig        from "./configurations/staticResourcesConfig";
import reponseHeaderConfig          from "./configurations/reponseHeaderConfig";
import redirectRequest              from "./configurations/redirectRequest";

import webpackConfig                from "../webpack.config.dev.js";
import open                         from "open";
import path                         from "path";
import React                        from "react";
import expressValidator             from "express-validator";
import fs                           from "fs";
import https                        from "https";

const insecurePort = 7000;
const app = express();
const compiler = webpack(webpackConfig);
const insecureApp = express();
const options = {
    key: fs.readFileSync("server/data/hackershall.key"),
    cert: fs.readFileSync("server/data/hackershall.crt")
}

redirectRequest(insecureApp);
sessionManagementConfig(app);
staticResourcesConfig(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.json());
validationSchemaConfig(app);
reponseHeaderConfig(app);


app.use("/fonts/", express.static(path.join(__dirname, "./shared/assets/fonts")));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use(favicon("./shared/assets/images/favicon.ico"));
express.static.mime.define({"text/css": ["css"]});
express.static.mime.define({"application/x-font-woff": ["woff"]});
express.static.mime.define({"application/x-font-ttf": ["ttf"]});
express.static.mime.define({"application/vnd.ms-fontobject": ["eot"]});
express.static.mime.define({"font/opentype": ["otf"]});

app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
}));

app.use(require("webpack-hot-middleware")(compiler));

apiRouteConfig(app);

initialize()
    .then(function () {
        app.listen(insecurePort, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Express server listening at http://localhost:${insecurePort}`);
                open(`http://localhost:${insecurePort}`);
            }
        });
        https.createServer(options, app).listen(1024);
}).catch(function (err) {
        console.log(err);
    });


