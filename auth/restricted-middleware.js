const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

module.exports = (req, res, next) => {
 if(req.session) {
 next();
 } else {
   res.status(401).json({ message: 'you shall not pass !'})
 }
}