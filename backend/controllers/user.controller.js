const bcrpyt = require('bcrypt');

function createUser(req, res, pool) {
    if (req.session.user != 'admin') {
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        let hash_password = bcrpyt.hashSync(req.body.password,10);
        pool.query('INSERT INTO users VALUES ($1, $2)', [req.body.username, hash_password], (err, result) => {
            if (err) {
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
}

function getUsers(req, res, pool) {
    if (req.session.user != 'admin') {
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        pool.query('SELECT * FROM users', (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({err: "Some error occurred"})
            }
            else {
                res.status(200).json({users: result.rows})
            }
        })
    }
}

function deleteUser(req, res, pool) {
    if (req.session.user != 'admin') {
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        pool.query('DELETE FROM users WHERE username = $1', [req.body.username], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({err: "Some error occurred"})
            }
            else {
                res.status(200).json({message: "User deleted successfully"})
            }
        })
    }
}

module.exports = {
    create: createUser,
    getList: getUsers,
    delete: deleteUser
}