require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET
};
