const express = require("express");
const uuid = require('uuid');
const session = require('express-session');
var cors = require('cors');
var format = require('pg-format')
require('dotenv').config();
const { Pool } = require('pg');
const logout = require('./controllers/logout')
const nodes_and_databases = require('./controllers/get_nodes_databases')
const get_groups = require("./controllers/get_groups")
const get_nodes = require("./controllers/get_nodes");
const { request } = require("http");

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
    cookie : {secure:false},
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
    // let sesid = req.sessionID;
    // console.log(req.sessionID)
    // pool.query('SELECT * FROM Sessions WHERE SessionID=($1)', [sesid], (error, results) => {
    //     if (error || results.rowCount == 0) {
    //         return res.status(401).send("Unauthorized");
    //     }
    //     req.session.user = results.rows[0].username;
    //     next();
    // })
    req.session.user = "admin";
    next();
});

app.get('/api/check-login', (req, res) => {
    return res.json({'user' : req.session.user});
});


app.get('/api/logout', (req, res) => {
    return logout(req, res, pool);
});

app.get('/api/get-nodes-and-databases', (req, res) => {
    // temp = nodes_and_databases(req, res, pool);
    // console.log(temp)
    nodes_and_databases(req, res, pool);
})

app.get('/api/get-groups', (req, res) => {
    get_groups(req, res, pool);
})

app.get('/api/get-nodes', (req, res) => {
    get_nodes(req, res, pool);
})

app.post('/api/add-node', (req, res) => {
    // console.log(req.session)
    if (req.session.user != "admin") {
        // console.log("Haha")
        res.status(405).json({err: "Does not have admin access"})
    }
    else{
        // console.log("Logged in")
        // console.log(req.body.ip)
        // console.log(req.body.name)
        // console.log(req.body.groups)
        pool.query("INSERT INTO node VALUES ($1, $2)", [req.body.ip, req.body.name], (err, result) => {
            if (err) {
                // console.log("Hehehe");
                console.log(err);
                res.status(500).json({err: "Some error occurred"});
            }
            else {
                temp = []
                for (const l in req.body.groups){
                    temp[l] = [req.body.ip, req.body.groups[l]];
                }

                pool.query(format('INSERT INTO NodeGroup (IP, group_name) VALUES %L', temp), (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({err: "Some error occurred"});
                    }
                    else{
                        res.status(200).json({message: "Node added successfully"});
                    }
                })
            }
        })
    }
})

app.post('/api/add-group', (req, res) => {
    console.log("Haha")
    if (req.session.user != "admin") {
        // console.log("Haha")
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        pool.query('insert into groups values ($1, $2)', [req.body.name, req.body.description], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({err: "Some error occurred"})
            }
            else {
                res.status(200).json({message: "Group inserted successfully"})
            }
        })
    }
})

app.post('/api/add-user', (req, res) => {
    if (req.session.user != 'admin') {
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        // console.log("Logged in")
        // console.log(req.body.username)
        // console.log(req.body)
        pool.query('INSERT INTO users VALUES ($1, $2)', [req.body.username, req.body.password1], (err, result) => {
            if (err) {
                // console.log("haha")
                console.log(err)
                res.status(500).json({err: "Some error occurred"})
            }
            else{
                temp = []
                for (const l in req.body.groups){
                    temp[l] = [req.body.username, req.body.groups[l]];
                }
                console.log(temp)
                pool.query(format('INSERT INTO usergroup (username, group_name) VALUES %L', temp), (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({err: "Some error occurred"});
                    }
                    else{
                        res.status(200).json({message: "Node added successfully"});
                    }
                })
            }
        })
    }
})

app.post('/api/add-database', (req, res) => {
    if (req.session.user != 'admin') {
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        pool.query('INSERT INTO databases VALUES ($2, $3)', [req.body.node, req.body.name], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({err: "Some error occurred"});
            }
            else {
                res.status(200).json({message: "Database added successfully"})
            }
        })
    }
})



var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Backend listening at http://%s:%s", host, port)
})
