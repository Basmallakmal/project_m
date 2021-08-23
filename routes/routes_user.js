module.exports = function (app) {
    var model = require('../models/m_user');
    var validation = require('../middleware/validation');

    app.get('/getuser', [
        validation.validatetoken,
        model.getuser
    ]);

    app.get('/getuser/:id', [
        validation.validatetoken,
        model.cekuserid,
        model.getuserperid
    ]);

    app.post('/deteleuser/:id', [
        validation.validatetoken,
        model.cekuserid,
        model.deleteuser
    ]);

    app.post('/updateuser/:id', [
        validation.validatetoken,
        model.cekuserid,
        model.edituserdata
    ]);
};