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
            scriptSrc: ["'self'", "'unsafe-inline", "http://code.jquery.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            connectSrc: ["'self'"],
            reportUri: "/cspviolation"
        }
    }));

    
}

export default reponseHeaderConfig;