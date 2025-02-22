const router = require('express').Router();

const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, session: req.session });
    })
    .catch(err => res.send(err));
});

module.exports = router;
