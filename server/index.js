require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
// require session
const auth = require('./authController');
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

const app = express();
// Top level middleware
app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then( db => {
    app.set('db', db);
    console.log('Ahoy! Connected to db, matey')
}).catch( err => console.log(err));

// Enpoints
app.post('/auth/register', auth.register);
app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/auth/get_user', auth.getUser);

app.listen(SERVER_PORT, () => console.log(`Connected to port ${SERVER_PORT}⛵⚓`))
