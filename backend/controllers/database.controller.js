var uuid = require('uuid')

function getDatabases(req, res, pool){
    if (req.session.user == "admin") {
        pool.query('select * from databases order by ip, database_id', (err, result) => {
            // console.log(result.rows)
            res.json({data: result.rows})
            // return result.rows
        })
    }
    else{
        pool.query('select * from databases where ip in (select ip from UserGroup, NodeGroup where UserGroup.group_name = NodeGroup.group_name AND UserGroup.username = ($1)) order by ip, database_id', [req.session.user] ,(err, result) => {
            // console.log(result.rows)
            res.json({data: result.rows})
            // return result.rows
        })
    }
}

function deleteDatabase(req, res, pool){
    if (req.session.user != "admin") {
        res.status(405).json({err: "Does not have admin access"})
    }
    else{
        pool.query('DELETE FROM Databases WHERE database_id = $1',[req.body.database_id], (err, result) => {
            if(err || result.rowCount == 0){
                console.log(err);
                res.status(500).json({err: "Some error occurred"});
            }
            else{
                res.status(200).json({message: "Database deleted successfully"});
            }
        })
    }
}

function createDatabase(req, res, pool){
    if (req.session.user != "admin") {
        res.status(405).json({err: "Does not have admin access"})
    }
    else if(!req.body.ip || !req.body.name){
        res.status(400).json({err: "Missing required fields"})
    }
    else{
        pool.query("INSERT INTO Databases VALUES ($1, $2, $3, $4)", [uuid.v4(), req.body.ip, req.body.name, req.body.description], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({err: "Some error occurred"});
            }
            else{
                res.status(200).json({message: "Database added successfully"});
            }
        })
    }
}

module.exports = {
    getList : getDatabases,
    create : createDatabase,
    delete : deleteDatabase,
}