const express = require("express");
const uuid = require('uuid');
const session = require('express-session');
var cors = require('cors');
var format = require('pg-format')
require('dotenv').config();
const { Pool } = require('pg');
const { InfluxDB, Point } = require('@influxdata/influxdb-client')

const login = require('./controllers/login');
const logout = require('./controllers/logout')
const databaseController = require('./controllers/database.controller')
const nodeController = require('./controllers/node.controller')
const groupController = require('./controllers/group.controller')
const alertController = require('./controllers/alert.controller')
const get_dashboard_data = require("./controllers/get_dashboard_data");
const userController = require("./controllers/user.controller");



const url = process.env.INFLUX_URL || ''
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG || ''

const influx = new InfluxDB({url, token}).getQueryApi(org)

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
   login(req, res, pool);
});

app.use(function (req, res, next) {
    let sesid = req.sessionID;
    console.log(req.sessionID)
    pool.query('SELECT * FROM Sessions WHERE SessionID=($1)', [sesid], (error, results) => {
        console.log(results)
        if (error || results.rowCount == 0) {
            return res.status(401).send("Unauthorized");
        }
        req.session.user = results.rows[0].username;
        next();
    })
    // req.session.user = "admin";
    // next();
});

app.get('/api/check-login', (req, res) => {
    return res.json({'user' : req.session.user});
});


app.get('/api/logout', (req, res) => {
    return logout(req, res, pool);
});

app.get('/api/database/list', (req, res) => {
    // temp = nodes_and_databases(req, res, pool);
    // console.log(temp)
    databaseController.getList(req, res, pool);
})

app.post('/api/database/create', (req, res) => {
    databaseController.create(req, res, pool);
})

app.post('/api/database/delete', (req, res) => {
    databaseController.delete(req, res, pool);
})

app.get('/api/group/list', (req, res) => {
    groupController.getList(req, res, pool);
})

app.post('/api/group/create', (req, res) => {
    groupController.create(req, res, pool);
})

app.post('/api/group/delete', (req, res) => {
    groupController.delete(req, res, pool);
})

app.get('/api/node/list', (req, res) => {
    nodeController.getList(req, res, pool);
})

app.post('/api/node/create', (req, res) => {
   nodeController.create(req, res, pool);
})

app.post('/api/node/delete', (req, res) => {
    nodeController.delete(req, res, pool);
})


app.get('/api/user/list', (req, res) => {
    userController.getList(req, res, pool);
})

app.post('/api/user/create', (req, res) => {
   userController.create(req, res, pool);
})

app.post('/api/user/delete', (req, res) => {
    userController.delete(req, res, pool);
})

app.get('/api/alert/list', (req, res) => {
    alertController.getList(req, res, pool);
})

app.post('/api/alert/create', (req, res) => {
    alertController.create(req, res, pool);
})

app.post('/api/alert/delete', (req, res) => {
    alertController.delete(req, res, pool);
})

app.post('/api/get-dashboard-data', (req, res) => {
    get_dashboard_data(req, res, pool, influx)
});

app.get('/api/alert/logs',(req, res) => {
    alertController.getLogs(req, res, pool);
})

app.post('/api/alert/acknowledge',(req, res) => {
    alertController.acknowledge(req, res, pool);
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Backend listening at http://%s:%s", host, port)
})
