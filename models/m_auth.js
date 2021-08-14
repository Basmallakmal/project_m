var connection = require('../db/connections');
var cryptojs = require("crypto-js");



exports.loginuser = (req,res) => {
    let sql = 'SELECT * FROM user where username = ?'
    connection.query(sql, [req.body.username], function (error, results) {
        if(!results[0]){
            res.status(404).send({});
        }else{
            let password = results[0].password;
            let inputpassword = cryptojs.SHA256(req.body.password);
            if(password == inputpassword){
                return res.status(201).send(results);
            }else{
                return res.status(400).send({errors : 'Invalid username or password'})
            }
        }
    });
  };

  exports.registeruser = (req,res) => {
    
    let data = {
        nama : req.body.nama,
        email : req.body.email,
        username : req.body.username,
        password : cryptojs.SHA256(req.body.password),
        foto_profil : 'empty.jpg',
    }
    let sql = 'INSERT INTO user SET ? '
    
    connection.query(sql, data, function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Registrasi Gagal'})
        }else{
            return res.status(201).send({result : 'Berhasil',id : results.insertId});
        }
    });
  };

  exports.cekuseroldpass = (req,res,next)=>{
     
    let sql = 'SELECT * FROM user where id = ?'
    connection.query(sql, [req.params.id], function (error, results) {
        if(!results[0]){
            return res.status(404).send({});
        }else{
            let password = results[0].password;
            let oldpassword = cryptojs.SHA256(req.body.oldpassword);
            if( password == oldpassword){
                req.body= {
                    newpassword : req.body.newpassword
                };
                return next();
            }else{
                return res.status(400).send({errors : 'Password lama salah'})
            }
           
        }
    });
}

  exports.editpassword = (req,res)=>{
    let sql = "UPDATE user SET password = ? WHERE id = "+ req.params.id +" "

    let password = cryptojs.SHA256(req.body.newpassword);
    
    connection.query(sql,[password], function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Ganti Password Gagal'})
        }else{
            return res.status(201).send({result : 'Berhasil'});
        }
    });
  }