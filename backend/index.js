const express = require("express");
const uuid = require('uuid');
const session = require('express-session');
var cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const logout = require('./controllers/logout')

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

app = express()

app.use(session({
    genid: (req) => {
        return uuid.v4(); // use UUIDs for session IDs
    },
    name: 'appMonCookie',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: true,

    credentials: true,

    methods: 'POST,GET,PUT,OPTIONS,DELETE'
}));


app.post('/api/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username, password);

    pool.query('SELECT * FROM Users WHERE username=($1) AND password=($2)', [username, password], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            if (result.rowCount == 0) {
                res.status(401).send("Invalid username or password");
            }
            else {
                pool.query('INSERT INTO Sessions VALUES ($1,$2,$3)', [req.sessionID, result.rows[0].username, new Date()], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    }
                    else {
                        res.status(200).send(result.rows[0]);
                    }
                });
            }
        }
    });
});

app.use(function (req, res, next) {
    let sesid = req.sessionID;
    pool.query('SELECT * FROM Sessions WHERE SessionID=(?)', (error, results) => {
        if (error || results.rowCount == 0) {
            return res.status(401).send("Unauthorized");
        }
        next(results.rows[0].username);
    })
});

app.get('/api/check-login', (user,req, res) => {
    console.log(user)
    return res.json(user);
});


app.get('/api/logout', (user,req, res) => {
    return logout(req, res, pool);
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Backend listening at http://%s:%s", host, port)
})
