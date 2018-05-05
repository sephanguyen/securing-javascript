"use strict";

import helmet from "helmet"

const reponseHeaderConfig = (app) => {

    app.use(helmet.hsts({
        maxAge: 1000 * 60 * 60 * 24 * 365,
        includeSubdomains: true,
        preload: true
    }));

    app.use(helmet.xssFilter());

    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none"],
            scriptSrc: ["'self'", "https", "'unsafe-inline", "http://code.jquery.com"],
            styleSrc: ["'self'", "https", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "https", "data:"],
            fontSrc: ["'self'", "https", "https://fonts.gstatic.com", "data:"],
            connectSrc: ["'self'", "https"],
            reportUri: "/cspviolation"
        }
    }));

    
}

export default reponseHeaderConfig;