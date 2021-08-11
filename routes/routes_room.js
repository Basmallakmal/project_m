module.exports = function(app){
    var model = require('../models/m_room');

    app.post('/room',[
        model.createroom
    ]);

    app.get('/room',[
        model.getallroom
    ])

    app.patch('/room/:id',[
        model.cekmember,
        model.updateroom
    ])

    app.delete('/room/:id',[
        model.deleteroom
    ])

    app.post('/getroom',[
        model.getroomperuser
    ])

    app.post('/getroom/:id',[
        model.cekmember,
        model.getroomdetail
    ])

   


    
}