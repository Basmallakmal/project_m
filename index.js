var express = require('express');
var cors = require('cors');

var app = express();

app.use(express.json());
app.use(cors());

var routes_user = require('./routes/routes_user');
routes_user(app);

app.listen(3000, () => {
    console.log('Server is running at port 3000');
  });