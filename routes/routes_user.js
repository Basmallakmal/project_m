module.exports = function (app) {
    var model = require('../models/m_user');

    app.get('/getuser', [
        model.getuser
    ]);

    app.get('/getuser/:id', [
        model.getuserperid
    ]);

    app.post('/deteleuser', [
        model.deleteuser
    ]);

    app.post('/updateuser/:id', [
        model.cekuserid,
        model.edituserdata
    ]);
};