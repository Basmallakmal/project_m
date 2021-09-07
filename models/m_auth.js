var connection = require('../db/connections');
var cryptojs = require("crypto-js");
const config = require("../middleware/config");



exports.loginuser = (req,res,next) => {
    let sql = 'SELECT * FROM user where username = ?'
    connection.query(sql, [req.body.username], function (error, results) {
        if(!results[0]){
            res.status(404).send({});
        }else{
            let password = results[0].password;
            let inputpassword = cryptojs.SHA256(req.body.password);
            if(password == inputpassword){
                req.body = {
                    id : results[0].id,
                    nama : results[0].nama,
                    email : results[0].email,
                    username : results[0].username,
                    foto_profil : results[0].foto_profil,
                    permissionlevel : config.role[0],
                }
                next();
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
            return res.status(200).send({result : 'Berhasil'});
        }
    });
  };

  exports.cekduplicateusername = (req,res,next)=>{
     
    let sql = 'SELECT * FROM user where username = ?'
    connection.query(sql, [req.body.username], function (error, results) {
        if(!results[0]){
            return next();
        }else{
            
            return res.status(400).send({errors : "Username sudah terdaftar"});
           
        }
    });
}

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
    
      
    let password = cryptojs.SHA256(req.body.newpassword);

    let sql = "UPDATE user SET password = '"+ password +"' WHERE id = "+ req.params.id +" "

    connection.query(sql, function (error, results) {
        if(error){
            return res.status(400).send({errors : 'Ganti Password Gagal'})
        }else{
            return res.status(202).send({result : 'Berhasil'});
        }
    });
  }

  exports.banrefresh_token = (req,res) => {
    
    let data = {
        id_user : req.jwt.id,
        refresh_token : req.body.refreshtoken
    }

    let sql = 'INSERT INTO banned_refresh_token SET ? '
    
    connection.query(sql, data, function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Logout Gagal'})
        }else{
            return res.status(200).send({result : 'Logout Berhasil'});
        }
    });
  };