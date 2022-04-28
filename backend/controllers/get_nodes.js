const e = require("express")

function get_nodes(req, res, pool){
    // const query = "select ip, database_id from databases order by ip, database_id;";
    // console.log("Hahaha");

    pool.query('select ip from node', (err, result) => {
        temp = []
        // console.log(result.rows[0]['name'])
        // console.log(result)
        for (const el in result.rows){
            // console.log(result.rows[el])
            // console.log(el)
            temp.push(result.rows[el]["ip"])
        }
        // console.log(temp)
        res.json({data: temp})
        // return result.rows
    })
}

module.exports = get_nodes