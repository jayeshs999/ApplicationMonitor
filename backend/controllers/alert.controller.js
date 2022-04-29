const uuid = require('uuid');

function createAlert(req,res,pool){
    let entity = req.body.entity;

    if (entity != "node" && entity != "database"){
        res.status(400).json({err: "Entity must be node or database"});
        return;
    }

    let entity_ids = JSON.stringify(req.body.entity_ids);
    console.log(req.body);

    pool.query('INSERT INTO alerts VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [uuid.v4(), req.session.user, req.body.name, req.body.description, req.body.entity, req.body.metric, entity_ids, req.body.threshold_1, req.body.threshold_2, req.body.threshold_type, req.body.priority, req.body.message, new Date()], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({err: "Some error occurred"});
        }
        else {
            res.status(200).json({message: "Alert inserted successfully"});
        }
    });
}

function getAlertList(req,res,pool){
    pool.query('SELECT id, name, description, priority, (select count(*) from AlertLogs where AlertLogs.id = Alerts.id and ack = 0) as unacknowledged  FROM Alerts WHERE Alerts.username = $1',[req.session.user], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({err: "Some error occurred"});
        }
        else{
            res.status(200).json({alerts: result.rows});
        }
    });
}

function deleteAlert(req,res,pool){
    pool.query('DELETE FROM Alerts WHERE id = $1 AND username = $2',[req.body.alert_id, req.session.user], (err, result) => {
        if(err || result.rowCount == 0){
            console.log(err);
            res.status(500).json({err: "Some error occurred"});
        }
        else{
            res.status(200).json({message: "Alert deleted successfully"});
        }
    });
}

function getAlertHistory(req,res,pool){
    pool.query('SELECT * FROM AlertLogs WHERE id = ($1) AND id in (select id from Alerts where username = $2)',[req.query.alert_id, req.session.user], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json({err: "Some error occurred"});
        }
        else{
            res.status(200).json({logs: result.rows});
        }
    });
}

function acknowledgeAlert(req,res,pool){
    pool.query('UPDATE AlertLogs SET ack = 1 WHERE id = ($1) AND timest = ($2) AND id in (select id from Alerts where username = $3)',[req.body.alert_id, req.body.timest, req.session.user], (err, result) => {
        if(err || result.rowCount == 0){
            console.log(err);
            res.status(500).json({err: "Some error occurred"});
        }
        else{
            res.status(200).json({message: "Alert acknowledged successfully"});
        }
    });
}

module.exports = {
    create : createAlert,
    getList : getAlertList,
    delete : deleteAlert,
    getLogs : getAlertHistory,
    acknowledge : acknowledgeAlert
}