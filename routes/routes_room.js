module.exports = function(app){
    var model = require('../models/m_room');
    var validation = require('../middleware/validation');

    app.post('/room',[
        validation.validatetoken,
        model.createroom
    ]);

    app.get('/room',[
        validation.validatetoken,
        model.getallroom
    ])

    app.patch('/room/:id',[
        validation.validatetoken,
        model.cekmember,
        model.updateroom
    ])

    app.delete('/room/:id',[
        validation.validatetoken,
        model.deleteroom
    ])

    app.get('/getroom',[
        validation.validatetoken,
        model.getroomperuser
    ])

    app.get('/getroom/:id',[
        validation.validatetoken,
        model.cekmember,
        model.getroomdetail
    ])

   


    
}