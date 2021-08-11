var connection = require('../db/connections');
var dateFormat = require('dateformat');
var sprintf = require('sprintf-js').sprintf;

exports.addtransaksi = (req,res)=>{
    let datadef = {
        tanggal : dateFormat(Date.now(), "dd-mm-yyyy"),
        waktu : dateFormat(Date.now(), "HH:MM"),
        bulan : dateFormat( Date.now(), "mm"),
        tahun : dateFormat (Date.now(), "yyyy"),
    }
    let data = Object.assign(req.body, datadef);

    let sql = "INSERT into transaksi SET ?";

    connection.query(sql, data, function (error, results) {
    
        if(error){
            return res.status(400).send({errors : 'Transaksi Gagal'})
        }else{
            return res.status(201).send({result : 'Berhasil', id : results.insertId});
        }
    });
}

exports.createcodetr = (req,res,next)=>{
    var tanggal = dateFormat(Date.now(), "dd-mm-yyyy");
    let sql = "SELECT MAX(RIGHT(`code`,4)) AS kd_max FROM transaksi WHERE tanggal = ? "
    connection.query(sql, tanggal,function (error, results) {
        if(!results[0]) return res.status(404).send({});
        if(results[0].kd_max != null){
            var temp = Number(results[0].kd_max) + 1;
            var kd = sprintf("%04s", temp);
        }else{
            var kd = "0001";
        }
        var kode = 'TRR' + dateFormat(Date.now(), "ddmmyyyy") + kd;
        Object.assign(req.body,{code : kode});
        return next();
    });
}

exports.getalltransaksi = (req,res)=>{
    let sql = "SELECT * FROM transaksi"
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
}

exports.cektruser = (req,res,next)=>{
    let sql = "SELECT * FROM transaksi WHERE id = "+req.params.id+" "
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            if(results[0].id_user == req.body.id_user){
                return next();
            }else{
                return res.status(400).send({errors : 'No Permission'})
            }
        }
    });
}

exports.gettransaksidetail = (req,res)=>{
    let sql = "SELECT * FROM transaksi WHERE id = "+req.params.id+" "
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
}

exports.getransaksiperuser = (req,res)=>{
    var limit = 20;
    var offset = req.body.page * limit;
    let sql = "SELECT * FROM transaksi WHERE id_user = "+req.body.id_user+" LIMIT "+offset+" , "+limit+" "
    connection.query(sql, function (error, results) {
        if(error){
            return res.status(404).send()
        }else{
            return res.status(201).send(results);
        }
    });
}

exports.deletetransaksi = (req,res)=>{
    let sql = 'DELETE FROM transaksi where id = ?'
    connection.query(sql, [req.params.id], function (error, results) {
        if(results.affectedRows != 0){
            return res.status(201).send({result : 'Berhasil menghapus transaksi'});
        }
        return res.status(400).send({errors : 'Gagal menghapus'});
    });
}