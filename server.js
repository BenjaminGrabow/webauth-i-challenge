const express = require('express');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const Users = require('./users/users-model.js');

const server = express();

const sessionConfig = {
  name: 'Ben', // by default sid
  secret: 'keep  it secret, keep it safe',
  resave: false, // if there are no changes to the session don't save it.
  saveUninitialized: true, // for GDPR compliance
  cookie: {
    maxAge: 1000 * 60 * 10, // millisec
    secure: false,
    httpOnly: true,
  },
  store: new KnexSessionStore({
    knex: require('./database/dbConfig'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createTable: true,
    clearInterval: 1000 * 60 * 30,
  }),
}

server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 12);
  
  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(error => {
    res.status(500).json(error);
  });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {

        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.delete('')


module.exports = server;