var connection = require('../db/connections');

exports.getuser = (result) => {
    let sql = 'SELECT * FROM user'
    connection.query(sql, function (error, results) {
        if(error){
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });
  };