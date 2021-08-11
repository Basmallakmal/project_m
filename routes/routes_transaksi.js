module.exports = function(app){
    var model = require('../models/m_transaksi');

    app.post('/transaksi',[
        model.createcodetr,
        model.addtransaksi
    ]);

    app.get('/transaksi',[
        model.getalltransaksi
    ]);

    app.post('/transaksi/:id',[
        model.cektruser,
        model.gettransaksidetail
    ]);

    app.delete('/transaksi/:id',[
        model.deletetransaksi
    ])

    app.post('/gettransaksi',[
        model.getransaksiperuser
    ]);



    
}