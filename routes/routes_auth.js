module.exports = function (app) {
    var model = require('../models/m_auth');
    var validation = require('../middleware/validation');

    app.post('/login',[
        model.loginuser,
        validation.generatetoken
    ]);

    app.post('/register',[
        model.registeruser
    ]);

    app.post('/editpassword/:id',[
        model.cekuseroldpass,
        model.editpassword
    ]);

    app.post('/refreshtoken',[
        validation.validate_exptoken,
        validation.validate_refreshtoken,
        validation.cekbannedrefreshtoken,
        validation.refreshacctoken
    ])

    app.post('/logout',[
        model.banrefresh_token
    ])

      
};