require('dotenv').config()

module.exports = {
    'token_secret': process.env.TOKEN_SECRET_KEY,
    'refresh_secret': process.env.REFRESH_SECRET_KEY,
    role : ['user', 'admin']
  };