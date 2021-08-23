var crypto = require("crypto");
var jwt = require('jsonwebtoken');
const config = require("../middleware/config");



  exports.generatetoken = (req,res) => {
      let salt = crypto.randomBytes(16).toString('base64');
      let hash = crypto.createHmac('sha512',salt).digest('base64');
      let b = Buffer.from(hash);
      let refresh_token = b.toString('base64');
      let token = jwt.sign(req.body, config.secret);
      return res.status(201).send({token : token,refreshtoken : refresh_token});
    };

  exports.validatetoken = (req,res,next) => {
      if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], config.secret);
                return next();
            }
        } catch (err) {
            return res.status(403).send();
        }
      } else {
          return res.status(401).send();
      }
  };