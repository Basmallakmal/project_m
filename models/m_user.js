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

exports.deleteuser = (req,res)=>{
    let sql = 'DELETE FROM user where id = ?'
    connection.query(sql, [req.body.id], function (error, results) {
        if(results.affectedRows != 0){
            return res.status(201).send({result : 'Berhasil menghapus user'});
        }
        return res.status(400).send({errors : 'Gagal menghapus'});
    });
}

exports.cekuserid = (req,res,next)=>{
     
    let sql = 'SELECT * FROM user where id = ?'
    connection.query(sql, [req.params.id], function (error, results) {
        if(!results[0]){
            return res.status(404).send({});
        }else{
            return next();
        }
    });
}

  exports.edituserdata = (req,res)=>{
    let sql = "UPDATE user SET ? WHERE id = "+ req.params.id +" "
    
    connection.query(sql,[req.body], function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Update Gagal'})
        }else{
            return res.status(201).send({result : 'Update Berhasil'});
        }
    });
  }