const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { resolve } = require('dns');
const { Pool } = require('pg');
const tx = require('./utils/transaction');
const metricsMap = require('./utils/metrics');
const format = require('pg-format')
const moment = require('moment')
require('dotenv').config();

const url = process.env.INFLUX_URL || ''
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG || ''


const queryApi = new InfluxDB({ url, token }).getQueryApi(org)

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

async function updateAlert(alert) {
  let end_time = new Date()
  let start_timestamp = (new Date(alert.last_timestamp)).toISOString()
  let end_timestamp = end_time.toISOString()

  let bucket_string = `from(bucket: "${process.env.DATA_BUCKET_NAME}") `

  let timeperiod_string = `|> range(start: time(v:"${start_timestamp}"), stop: time(v:"${end_timestamp}")) `

  let user_string = '';
  entity_ids = JSON.parse(alert.entity_ids)

  if (alert.entity == "node") {
    user_string += `|> filter(fn: (r) => `;
    for (const l in entity_ids) {
      // console.log(l)
      if (l != entity_ids.length - 1) {
        user_string += (`r["host"] == "` + entity_ids[l] + `" or `)
      }
      else {
        user_string += (`r["host"] == "` + entity_ids[l] + `" ) `)
      }
    }
  }
  else {
    user_string += `|> filter(fn: (r) => `;

    for (const l in entity_ids) {
      // console.log(l)
      if (l != entity_ids.length - 1) {
        user_string += (`(r["db"] == "` + entity_ids[l]["database"] + '" and ' + `r["host"] == "` + entity_ids[l]["node"] + '")' + ` or `)
      }
      else {
        user_string += (`(r["db"] == "` + entity_ids[l]["database"] + '" and ' + `r["host"] == "` + entity_ids[l]["node"] + '")' + `) `)
      }
    }
  }

  let aggregate_string = `|> aggregateWindow(every: 2m, fn: mean, createEmpty: false) |> yield(name: "mean")`

  const query = bucket_string + timeperiod_string + metricsMap[alert.metric] + user_string + aggregate_string;
  console.log(query)

 let awaitRes =  await new Promise((resolve, reject) => {
    let output = []

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        // console.log(alert.name,o)

        // console.log(o)
        if (alert.threshold_type == "ABOVE") {
          if (o["_value"] > alert.threshold_low) {
            // console.log(o["_value"])
            output.push([alert.id, moment(o["_time"]).format('YYYY-MM-DD HH:mm:ss.SS'),0])
          }
        }
        else if (alert.threshold_type == "BELOW") {
          if (o["_value"] < alert.threshold_low) {
            output.push([alert.id, moment(o["_time"]).format('YYYY-MM-DD HH:mm:ss.SS'),0])
          }
        }
        else if (alert.threshold_type == "IN_RANGE") {
          if (o["_value"] > alert.threshold_low && o["_value"] < alert.threshold_high) {
            output.push([alert.id, moment(o["_time"]).format('YYYY-MM-DD HH:mm:ss.SS'),0])
          }
        }
        else if (alert.threshold_type == "OUT_OF_RANGE") {
          if (o["_value"] < alert.threshold_low || o["_value"] > alert.threshold_high) {
            output.push([alert.id, moment(o["_time"]).format('YYYY-MM-DD HH:mm:ss.SS'),0])
          }
        }
      },
      error(error) {
        console.log(error)
        console.log('\nFinished ERROR')
        reject(error);
      },
      complete() {
        console.log('\nFinished SUCCESS');
        // console.log(output)
        resolve(output);
      }
    })
  }).catch(err => console.log(err))
  
  console.log("awaitRes", awaitRes)
  if(awaitRes == undefined) {
    return 0
  }
  else{
    // console.log("Ima heere")
    // let res = await pool.query(format('INSERT INTO AlertLogs VALUES %L', awaitRes))
    // console.log("Updated alert logs")
    // res = await pool.query(format('UPDATE Alerts SET last_timestamp = $1 WHERE id = $2', [end_timestamp, alert.id]))
    // console.log("Updated alerts")
    let query1 = format('INSERT INTO AlertLogs VALUES %L;', awaitRes);
    let query2 = format('UPDATE Alerts SET last_timestamp = %L WHERE id = %L',moment(end_timestamp).format('YYYY-MM-DD HH:mm:ss.SS'), alert.id)
    //console.log(`BEGIN;${query1};${query2};COMMIT;`)
    let result = await pool.query(`BEGIN;${query1};${query2};COMMIT;`);

    // pool.query(format('INSERT INTO AlertLogs VALUES %L', awaitRes), (err, result) => {
    //   if (err) {
    //       console.log(err);
    //   }
    //   else{
    //       console.log("Updated alert logs")
    //   }
    // })
    // // console.log("Ima halfway done")
    // pool.query(format('UPDATE Alerts SET last_timestamp = $1 WHERE id = $2', [end_timestamp, alert.id]), (err, result) => {
    //   if (err) {
    //       console.log(err);
    //   }
    //   else{
    //       console.log("Updated alerts")
    //   }
    // })
  }

}

pool.query('select * from alerts', (err, res) => {
  if (err) {
    console.log(err);
  }
  else {
    callList = [];
    for (const l in res.rows) {
      callList.push(updateAlert(res.rows[l]));
    }
    Promise.all(callList).then((res) => {
      console.log(res)
      console.log('\nFinished SUCCESS');
      process.exit(0);
    },
      (err) => {
        console.log(err);
        console.log('\nFinished ERROR');
        process.exit(1);
      }
    );
  }
});