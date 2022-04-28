function nodes_and_databases(req, res, pool){
    // const query = "select ip, database_id from databases order by ip, database_id;";
    // console.log("Hahaha");

    pool.query('select ip, database_id, name from databases order by ip, database_id', (err, result) => {
        // console.log(result.rows)
        res.json({data: result.rows})
        // return result.rows
    })
}

module.exports = nodes_and_databases