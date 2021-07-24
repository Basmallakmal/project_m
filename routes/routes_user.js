module.exports = function (app) {
    var model = require('../models/m_user');

    app.get('/getuser', async function(request, response){
          model.getuser((err, result)=>{
            if (err){
                response.send(err);
            }else{
                response.json(result);
            }
          });
      });
};