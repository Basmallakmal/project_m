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

    app.patch('/editpassword/:id',[
        validation.validatetoken,
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
        validation.validate_refreshtoken,
        validation.cekbannedrefreshtoken,
        model.banrefresh_token
    ])

      
};