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

    it('it should get one user',(done)=>{
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



