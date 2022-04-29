const bcrypt = require('bcrypt');

function login(req, res,pool){
    let username = req.body.username;

    pool.query('SELECT password FROM Users WHERE username=($1)', [username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            if (result.rowCount == 0) {
                res.status(401).send("Invalid credentials");
            }
            else if(!bcrypt.compareSync(req.body.password,result.rows[0].password)){
                res.status(401).send("Invalid credentials");
            }
            else {
                pool.query('INSERT INTO Sessions VALUES ($1,$2,$3)', [req.sessionID, username, new Date()], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    }
                    else {
                        res.status(200).send({user: username});
                    }
                });
            }
        }
    });
}

module.exports = login