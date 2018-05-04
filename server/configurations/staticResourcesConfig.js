"use static";

import favicon                      from "serve-favicon";
import path                         from "path";
import express                      from "express";

const staticResourcesConfig = (app) => {
    app.use("/fonts/", express.static(path.join(__dirname, "./shared/assets/fonts")));
    app.use(favicon("./shared/assets/images/favicon.ico"));
    express.static.mime.define({"text/css": ["css"]});
    express.static.mime.define({"application/x-font-woff": ["woff"]});
    express.static.mime.define({"application/x-font-ttf": ["ttf"]});
    express.static.mime.define({"application/vnd.ms-fontobject": ["eot"]});
    express.static.mime.define({"font/opentype": ["otf"]});
};

export default staticResourcesConfig;