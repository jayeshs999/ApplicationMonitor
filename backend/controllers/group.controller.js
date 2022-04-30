function getGroups(req, res, pool){
    if (req.session.user != "admin") {
        res.status(405).json({err: "Does not have admin access"})
    }
    else{
        pool.query('select name from groups', (err, result) => {
            res.json({data: result.rows})
        });
    }
}

function createGroup(req, res, pool){
    if (req.session.user != "admin") {
        // console.log("Haha")
        res.status(405).json({err: "Does not have admin access"})
    }
    else if(!req.body.name){
        res.status(400).json({err: "Group name is required"});
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
}

function deleteGroup(req, res, pool){
    if (req.session.user != "admin") {
        // console.log("Haha")
        res.status(405).json({err: "Does not have admin access"})
    }
    else {
        pool.query('delete from groups where name = $1', [req.body.name], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({err: "Some error occurred"})
            }
            else {
                res.status(200).json({message: "Group deleted successfully"})
            }
        })
    }
}

module.exports = {
    getList : getGroups,
    create : createGroup,
    delete : deleteGroup
}