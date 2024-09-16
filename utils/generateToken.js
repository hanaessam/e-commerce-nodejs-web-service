const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    const token = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  };

module.exports = generateToken;