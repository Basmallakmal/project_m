var connection = require('../db/connections');

exports.getuser = (req,res) => {
    let sql = 'SELECT * FROM user'
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
  };

exports.getuserperid = (req,res)=>{
    let sql = 'SELECT * FROM user where id = ?'
    connection.query(sql, [req.params.id], function (error, results) {
        if(!results[0]){
            return res.status(404).send({});
        }else{
            return res.status(201).send(results);
        }
    });
}