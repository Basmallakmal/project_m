//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let should = chai.should();

chai.use(chaiHttp);

// TEST AUTH
describe('Auth User',()=>{
    it('login should success', (done)=>{
        chai.request(app)
        .post('/login')
        .send({
            username : 'usertes',
            password : 'tesuser'
        })
        .end((err,res)=> {
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        });
    });
    it('login should fail', (done)=>{
        chai.request(app)
        .post('/login')
        .send({
            username : 'user',
            password : 'pass'
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
});

// TEST PASSWORD
describe('Ganti Password',()=>{
    it("it should change user password",(done)=>{
        let datauser = {
            oldpassword : 'tesuser',
            newpassword : 'tesuser'
        }
        chai.request(app)
        .post('/editpassword/1')
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
        .post('/editpassword/1')
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
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(404);
            done();
        });
    });
});

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
            res.body.should.have.property('id');
            iduser = res.body.id;
            done();
        });
    });

    it("it shouldn't post user registration",(done)=>{
        let datauser = {
            nama : 'namatest',
            email : 'test@email.com',
            username : 'testuser'
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

   
    it('it should get all user',(done)=>{
        chai.request(app)
        .get('/getuser')
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    });

    it('it should get one user data',(done)=>{
        chai.request(app)
        .get('/getuser/' + '1')
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    });

    it('it should return empty user data',(done)=>{
        chai.request(app)
        .get('/getuser/0')
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
        .post('/updateuser/' + iduser)
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
        .post('/updateuser/' + iduser)
        .send(datauser)
        .end((err,res)=>{
            res.should.have.status(400);
            done();
        });
    });


    it('it should delete user',(done)=>{
        let datauser = {
            id : iduser
        }
        chai.request(app)
        .post('/deteleuser')
        .send(datauser)
        .end((err,res) => {
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        });
    });

    it("it shouldn't delete user",(done)=>{
        let datauser = {
            id : iduser
        }
        chai.request(app)
        .post('/deteleuser')
        .send(datauser)
        .end((err,res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });

});

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
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            done();
        })
    })

    it("it should get all room with user id and page",(done)=>{
        let data = {
            id_user : 1,
            page : 1,
        }
        chai.request(app)
        .post('/getroom')
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
            status_tr : "2"
        }
        chai.request(app)
        .patch('/room/' + idroom)
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
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
            res.body.should.have.property('result');
            done();
        })
    })    
    
    it("it shouldn't delete room",(done)=>{
        chai.request(app)
        .delete('/room/' + idroom)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        })
    }) 

});

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
            nilai : "235000",
            tipe : "OVO",
            status : "0"
        }
        chai.request(app)
        .post('/transaksi')
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
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
        })
    })

    it("it should get one transaksi data",(done)=>{
        let data={
            id_user : 1,
        }
        chai.request(app)
        .post('/transaksi/' + idtrans)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
        })
    })

    it("it shouldn't get one transaksi data cause no permission",(done)=>{
        let data={
            id_user : 3,
        }
        chai.request(app)
        .post('/transaksi/' + idtrans)
        .send(data)
        .end((err,res)=>{
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.should.have.property('errors');
        })
    })

    it("it should get transaksi per user",(done)=>{
        let data = {
            id_user : 1,
            page : 1
        }
        chai.request(app)
        .post('/gettransaksi')
        .send(data)
        .end((err,res)=>{
            res.should.have.status(201);
            res.should.be.a('object');
        })
    })

})


