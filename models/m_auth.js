var connection = require('../db/connections');



exports.loginuser = (req,res) => {
    let sql = 'SELECT * FROM user where username = ?'
    connection.query(sql, [req.body.username], function (error, results) {
        if(!results[0]){
            res.status(404).send({});
        }else{
            let password = results[0].password;
            let inputpassword = req.body.password;
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
        password : req.body.password,
        foto_profil : 'empty',
    }
    let sql = 'INSERT INTO user SET ? '
    
    connection.query(sql, data, function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Registrasi Gagal'})
        }else{
            return res.status(201).send({result : 'Berhasil'});
        }
    });
  };