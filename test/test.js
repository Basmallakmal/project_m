//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let should = chai.should();

chai.use(chaiHttp);

var token,refresh_token;
var exptoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQxLCJpYXQiOjE2Mjk5NjU2NjgsImV4cCI6MTYyOTk2OTI2OH0.OdeCcRZbvT7HCzww5nccOpbhLIKVccK44US68ZsN8yE";
// TEST USERS

describe('Users',()=>{

    var iduser = 0;

    it('it should post user registration',(done)=>{
        let datauser = {
            nama : 'namatest',
            email : 'test@email.com',
            username : 'testuser',
            password : 'testuser'
        }
        chai.request(app)
        .post('/register')
        .send(datauser)
        .end((err,res) => {
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        });
    });

    it("it shouldn't post user cause same usename",(done)=>{
        let datauser = {
            nama : 'namatest',
            email : 'test@email.com',
            username : 'testuser',
            password : 'testuser'
        }
        chai.request(app)
        .post('/register')
        .send(datauser)
        .end((err,res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });

    it("it shouldn't post user registration",(done)=>{
        let datauser = {
            nama : 'namatest',
            email : 'test@email.com',
            user : 'testuser'
        }
        chai.request(app)
        .post('/register')
        .send(datauser)
        .end((err,res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });

    it('login should success', (done)=>{
        chai.request(app)
        .post('/login')
        .send({
            username : 'testuser',
            password : 'testuser'
        })
        .end((err,res)=> {
            res.should.have.status(201);
            res.should.be.a('object');
            iduser = res.body.isi.id;
            token = res.body.token;
            refresh_token = res.body.refreshtoken;
            done();
        });
    });

    it('login should fail', (done)=>{
        chai.request(app)
        .post('/login')
        .send({
            username : 'a',
            password : 'a'
        })
        .end((err,res)=> {
            res.should.have.status(404);
            done();
        });
    });

    it('login should fail cause wrong password', (done)=>{
        chai.request(app)
        .post('/login')
        .send({
            username : 'usertes',
            password : 'pass'
        })
        .end((err,res)=> {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });

    it("it should change user password",(done)=>{
        let datauser = {
            oldpassword : 'testuser',
            newpassword : 'user'
        }
        chai.request(app)
        .patch('/editpassword/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        });
    });

    it("it shouldn't change user password",(done)=>{
        let datauser = {
            oldpassword : 'password',
            newpassword : 'tesuser'
        }
        chai.request(app)
        .patch('/editpassword/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });
    
    it("it should fail cause id user not found",(done)=>{
        let datauser = {
            oldpassword : 'password',
            newpassword : 'tesuser'
        }
        chai.request(app)
        .post('/editpassword/0')
        .set('Authorization', 'Bearer ' + token)
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(404);
            done();
        });
    });

    it('it should get all user',(done)=>{
        chai.request(app)
        .get('/getuser')
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    });

    it('it should get one user data',(done)=>{
        chai.request(app)
        .get('/getuser/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    });

    it('it should return empty user data',(done)=>{
        chai.request(app)
        .get('/getuser/0')
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(404);
            res.should.be.a('object');
            done();
        })
    });

    it('it should edit user data',(done)=>{
        let datauser = {
            username : 'userjohn',
        }
        chai.request(app)
        .patch('/updateuser/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        });
    });


    it("it shouldn't edit user data",(done)=>{
        let datauser = {
        }
        chai.request(app)
        .patch('/updateuser/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(400);
            done();
        });
    });

    it("it should refresh token",(done)=>{
        let data = {
            refreshtoken : refresh_token,
        }
        chai.request(app)
        .post('/refreshtoken')
        .set('Authorization', 'Bearer ' + exptoken)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('token');
            done();
        });
    })

    it("it shouldn't refresh token cause token not exp",(done)=>{
        let data = {
            refreshtoken : refresh_token,
        }
        chai.request(app)
        .post('/refreshtoken')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(401);
            res.should.be.a('object');
            res.body.should.have.property('error');
            done();
        });
    })

    it("it should logout and ban refresh_token",(done)=>{
        let data = {
            refreshtoken : refresh_token,
        }
        chai.request(app)
        .post('/logout')
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        });
    })

    it("it shouldn't refresh token cause refresh_token not valid ",(done)=>{
        let data = {
            refreshtoken : refresh_token,
        }
        chai.request(app)
        .post('/refreshtoken')
        .set('Authorization', 'Bearer ' + exptoken)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    })


    it('it should delete user',(done)=>{
        chai.request(app)
        .delete('/deteleuser/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .end((err,res) => {
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        });
    });

    it("it shouldn't delete user",(done)=>{
        chai.request(app)
        .delete('/deteleuser/' + iduser)
        .set('Authorization', 'Bearer ' + token)
        .end((err,res) => {
            res.should.have.status(404);
            done();
        });
    });

});

// ROOM

describe("room",()=>{

    var idroom = 0;

    it("it should create new room ",(done)=>{
        let dataroom = {
            nama_room : "Jual Beli alat masak",
            id_user_maker : "1",
            id_user_inv : "2",
            nominal_tr : "350000",
            status_tr : "0",
            tipe_instan : "1",
            diterima : "0",
            tanggal_dikirim : "03-08-2021",
            tanggal_tiba : "03-08-2021",
            keterangan : "pembelian alat masak 1 set,dikirim ke surabaya",
            dibatalkan : "0",
        }
        chai.request(app)
        .post('/room')
        .set('Authorization', 'Bearer ' + token)
        .send(dataroom)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            res.body.should.have.property('id');
            idroom = res.body.id;
            done();
        })
    })

    it("it shouldn't create new room ",(done)=>{
        let dataroom = {
            nama : "Jual Beli alat berkebun",
        }
        chai.request(app)
        .post('/room')
        .set('Authorization', 'Bearer ' + token)
        .send(dataroom)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    })

    it("it should get all room",(done)=>{
        chai.request(app)
        .get('/room')
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it should get all room with user id and page",(done)=>{
        let data = {
            id_user : 1,
            page : 0,
        }
        chai.request(app)
        .post('/getroom')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it should get room detail",(done)=>{
        let data = {
            id_user : 1,
        }
        chai.request(app)
        .post('/getroom/' + idroom)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it shouldn't get room detail cause no permission",(done)=>{
        let data = {
            id_user : 3,
        }
        chai.request(app)
        .post('/getroom/' + idroom)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    })

    it("it should update room data",(done)=>{
        let data = {
            id_user : 1,
            status_tr : 2
        }
        chai.request(app)
        .patch('/room/' + idroom)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it shouldn't update room data",(done)=>{
        let data = {
            id_user : 1
        }
        chai.request(app)
        .patch('/room/' + idroom)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    })

    it("it shouldn't update room data cause no permission",(done)=>{
        let data = {
            id_user : 3,
            status_tr : "2"
        }
        chai.request(app)
        .patch('/room/' + idroom)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    })
    
    it("it should delete room",(done)=>{
        chai.request(app)
        .delete('/room/' + idroom)
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        })
    })   

});

// TRANSAKSI

describe("Transaksi",()=>{

    var idtrans = 0;

    it("it should add new transaksi",(done)=>{
        let data = {
            id_room : 1,
            id_user : 1,
            nilai : "235000",
            tipe : "OVO",
            status : "0"
        }
        chai.request(app)
        .post('/transaksi')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            res.body.should.have.property('id');
            idtrans = res.body.id;
            done();
        })
    })

    it("it shouldn't add new transaksi",(done)=>{
        let data = {
            id_user : 1,
            total : "235000",
            tipe : "OVO",
            status : "0"
        }
        chai.request(app)
        .post('/transaksi')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    })

    it("it should get all transaksi",(done)=>{
        chai.request(app)
        .get('/transaksi')
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it should get one transaksi data",(done)=>{
        let data={
            id_user : 1,
        }
        chai.request(app)
        .post('/transaksi/' + idtrans)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it shouldn't get one transaksi data cause no permission",(done)=>{
        let data={
            id_user : 3,
        }
        chai.request(app)
        .post('/transaksi/' + idtrans)
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    })

    it("it should get transaksi per user",(done)=>{
        let data = {
            id_user : 1,
            page : 0
        }
        chai.request(app)
        .post('/gettransaksi')
        .set('Authorization', 'Bearer ' + token)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    
    it("it should delete transaksi",(done)=>{
        chai.request(app)
        .delete('/transaksi/' + idtrans)
        .set('Authorization', 'Bearer ' + token)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        })
    })   

})


