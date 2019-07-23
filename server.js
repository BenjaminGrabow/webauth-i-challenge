const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

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

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});

module.exports = server;