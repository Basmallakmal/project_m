var crypto = require("crypto");
var jwt = require('jsonwebtoken');
const config = require("../middleware/config");
var connection = require('../db/connections');



exports.generatetoken = (req, res) => {
    let jwtbody = {
        id: req.body.id,
        permissionlevel: req.body.permissionlevel,
    }

    let refresh_token = jwt.sign({ id: req.body.id }, config.refresh_secret, { algorithm: 'HS512' });
    let token = jwt.sign(jwtbody, config.token_secret,{expiresIn : "1h"});
    return res.status(201).send({
        token: token,
        refreshtoken: refresh_token,
        body: req.body,
    });
};

exports.refreshacctoken = (req, res) => {
    let jwtbody = {
        id: req.jwt.id,
        permissionlevel: req.jwt.permissionlevel,
    }

    let token = jwt.sign(jwtbody, config.token_secret,{expiresIn : "1h"});
    return res.status(201).send({
        token: token
    });
};

exports.validatetoken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], config.token_secret);
                return next();
            }
        } catch (err) {
            // token can be expired or invalid. Send appropriate errors in each case:
            if (err.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ error: "Token expired" });
            } else if (err.name === "JsonWebTokenError") {
                return res
                    .status(401)
                    .json({ error: "Invalid token" });
            } else {
                //catch other unprecedented errors
                return res.status(400).json({ err });
            }
        }
    } else {
        return res.status(401).send();
    }
};

exports.validate_exptoken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], config.token_secret);
                return res
                    .status(401)
                    .json({ error: "Token not expired" });
            }
        } catch (err) {
            // token can be expired or invalid. Send appropriate errors in each case:
            if (err.name === "TokenExpiredError") {

                return next();
                
            } else if (err.name === "JsonWebTokenError") {
                return res
                    .status(401)
                    .json({ error: "Invalid token" });
            } else {
                //catch other unprecedented errors
                return res.status(400).json({ err });
            }
        }
    } else {
        return res.status(401).send();
    }
};

exports.validate_refreshtoken = (req, res, next) => {
    if (req.body.refreshtoken) {
        try {
            req.jwt = jwt.verify(req.body.refreshtoken, config.refresh_secret);
            return next();
        } catch (err) {
            // token can be expired or invalid. Send appropriate errors in each case:
            if (err.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ error: "Token expired" });
            } else if (err.name === "JsonWebTokenError") {
                return res
                    .status(401)
                    .json({ error: "Invalid token" });
            } else {
                //catch other unprecedented errors
                return res.status(400).json({ err });
            }
        }
    } else {
        return res.status(401).send();
    }
};

exports.cekbannedrefreshtoken = (req,res,next) => {
    let sql = 'SELECT * FROM banned_refresh_token where refresh_token = ?'
    connection.query(sql, [req.body.refreshtoken], function (error, results) {
        if(!results[0]){
            next();
        }else{
            return res.status(400).send({errors : 'Invalid refresh token'})
        }
    });
}
