module.exports = function (app) {
    var model = require('../models/m_auth');

    app.post('/login',[
        model.loginuser
    ]);

    app.post('/register',[
        model.registeruser
    ]);

      
};