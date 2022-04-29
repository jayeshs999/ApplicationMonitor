const format = require('pg-format');

function getNodes(req, res, pool) {
    // const query = "select ip, database_id from databases order by ip, database_id;";
    // console.log("Hahaha");
    if (req.session.user == "admin") {

        pool.query('select * from node', (err, result) => {
            res.json({ data: result.rows })
        })
    }
    else {
        pool.query('select * from node where ip in (select distinct ip from UserGroup, NodeGroup where UserGroup.group_name = NodeGroup.group_name AND userGroup.username = ($1))', [req.session.user], (err, result) => {
            res.json({ data: result.rows })
        });
    }
}

function createNode(req, res, pool) {
    if (req.session.user != "admin") {
        res.status(405).json({ err: "Does not have admin access" })
    }
    else {
        pool.query("INSERT INTO node VALUES ($1, $2)", [req.body.ip, req.body.name], (err, result) => {
            if (err) {
                // console.log("Hehehe");
                console.log(err);
                res.status(500).json({ err: "Some error occurred" });
            }
            else {
                temp = []
                for (const l in req.body.groups) {
                    temp[l] = [req.body.ip, req.body.groups[l]];
                }

                pool.query(format('INSERT INTO NodeGroup (IP, group_name) VALUES %L', temp), (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ err: "Some error occurred" });
                    }
                    else {
                        res.status(200).json({ message: "Node added successfully" });
                    }
                })
            }
        })
    }
}

function deleteNode(req,res,pool) {
    if (req.session.user != "admin") {
        res.status(405).json({ err: "Does not have admin access" })
    }
    else {
        pool.query('DELETE FROM Node WHERE ip = $1', [req.body.ip], (err, result) => {
            if (err || result.rowCount == 0) {
                console.log(err);
                res.status(500).json({ err: "Some error occurred" });
            }
            else {
                res.status(200).json({ message: "Alert deleted successfully" });
            }
        });
    }
}

module.exports = {
    getList : getNodes,
    create : createNode,
    delete : deleteNode
}