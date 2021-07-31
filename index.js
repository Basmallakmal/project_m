var express = require('express');
var cors = require('cors');
var helmet = require('helmet');

let app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

var routes_user = require('./routes/routes_user');
routes_user(app);

var routes_auth = require('./routes/routes_auth');
routes_auth(app);

app.listen(3000, () => {
    console.log('Server is running at port 3000');
  });

module.exports = app;