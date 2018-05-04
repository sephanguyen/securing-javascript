"use static"

import { registrationSchema } from "../validation/validationSchemas";

export default function validationSchemaConfig(app) {
    app.use(function (req, res, next) {
        if(req.url != "api/user/register") {
            next();
        }else {
            req.checkBody(registrationSchema);
            const errors = req.validationErrors();

            if (errors) {
                return res.status(500).json("There were errors registering ");
            }
            next();
        }
    })
}