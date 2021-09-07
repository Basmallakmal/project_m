module.exports = function(app){
    var model = require('../models/m_transaksi');
    var validation = require('../middleware/validation');

    app.post('/transaksi',[
        validation.validatetoken,
        model.createcodetr,
        model.addtransaksi
    ]);

    app.get('/transaksi',[
        validation.validatetoken,
        model.getalltransaksi
    ]);

    app.get('/transaksi/:id',[
        validation.validatetoken,
        model.cektruser,
        model.gettransaksidetail
    ]);

    app.delete('/transaksi/:id',[
        validation.validatetoken,
        model.deletetransaksi
    ])

    app.get('/gettransaksi',[
        validation.validatetoken,
        model.getransaksiperuser
    ]);



    
}