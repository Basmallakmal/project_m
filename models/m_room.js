var connection = require('../db/connections');
const { customAlphabet } = require('nanoid');
var dateFormat = require('dateformat');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 15);

exports.createroom = (req,res)=>{
    let datadef = {
        code : nanoid(),
        tanggal : dateFormat(Date.now(), "dd-mm-yyyy"),
        waktu : dateFormat(Date.now(), "HH:MM"),
        bulan : dateFormat( Date.now(), "mm"),
        tahun : dateFormat (Date.now(), "yyyy"),
    }
    let data = Object.assign(req.body,datadef);

    let sql = "INSERT into room SET ?";

    connection.query(sql, data, function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Room Gagal Dibuat'})
        }else{
            return res.status(201).send({result : 'Berhasil', id : results.insertId});
        }
    });

}

exports.getallroom = (req,res)=>{
    let sql = "SELECT * FROM room"
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
}

exports.getroomperuser = (req,res)=>{
    var limit = 20;
    var offset = req.body.page * limit;
    let sql = "SELECT * FROM room WHERE id_user_inv = "+req.body.id_user+" OR id_user_maker = "+req.body.id_user+" LIMIT "+offset+" , "+limit+" "
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
}

exports.cekmember = (req,res,next)=>{
    let sql = "SELECT * FROM room WHERE id = "+req.params.id+" "
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            if(results[0].id_user_inv == req.body.id_user || results[0].id_user_maker == req.body.id_user){
                return next();
            }else{
                return res.status(400).send({errors : 'No Permission'})
            }
        }
    });
}

exports.getroomdetail = (req,res)=>{
    let sql = "SELECT * FROM room WHERE id = "+req.params.id+" "
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
}

exports.updateroom = (req,res)=>{
    let sql = "UPDATE room SET ? WHERE id = "+ req.params.id +" "

    delete req.body.id_user;
    connection.query(sql,[req.body], function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Update Gagal'})
        }else{
            return res.status(201).send({result : 'Update Berhasil'});
        }
    });
}


exports.deleteroom = (req,res)=>{
    let sql = 'DELETE FROM room where id = ?'
    connection.query(sql, [req.params.id], function (error, results) {
        if(results.affectedRows != 0){
            return res.status(201).send({result : 'Berhasil menghapus room'});
        }
        return res.status(400).send({errors : 'Gagal menghapus'});
    });
}