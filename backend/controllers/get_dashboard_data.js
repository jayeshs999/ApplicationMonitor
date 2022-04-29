const { TemplatesAPI } = require("@influxdata/influxdb-client-apis")
const map = require("../utils/metrics")

const fluxObserver = {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row)
      console.log(o)
    },
    error(error) {
      console.error(error)
      console.log('\nFinished ERROR')
    },
    complete() {
      console.log('\nFinished SUCCESS')
    }
}



function get_dashboard_data(req, res, pool, influx) {
    console.log(req.body)
    // const map = {
    //     "cpu": '|> filter(fn: (r) => r["_measurement"] == "cpu") |> filter(fn: (r) => r["_field"] == "usage_system") |> filter(fn: (r) => r["cpu"] == "cpu-total") ',
    //     "mem": '|> filter(fn: (r) => r["_measurement"] == "mem") |> filter(fn: (r) => r["_field"] == "used") ',
    //     "blks_hits": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "blks_hit") '
    // }

    let bucket_string = `from(bucket: "${process.env.DATA_BUCKET_NAME}") `

    let timeperiod_string = `|> range(start: ${req.body.time_period}, stop: -0h) `

    let user_string = ''
    if (req.body.type == "node"){
        user_string += `|> filter(fn: (r) => `;

        for (const l in req.body.entities){
            // console.log(l)
            if (l != req.body.entities.length - 1){
                user_string += (`r["host"] == "` + req.body.entities[l] + `" or `)
            }
            else{
                user_string += (`r["host"] == "` + req.body.entities[l] + `" ) `)
            }
        }
    }
    else{
        user_string += `|> filter(fn: (r) => `;

        for (const l in req.body.entities){
            // console.log(l)
            if (l != req.body.entities.length - 1){
                user_string += (`(r["db"] == "` + req.body.entities[l]["database"] + '" and ' + `r["host"] == "` + req.body.entities[l]["node"] + '")' + ` or `)
            }
            else{
                user_string += (`(r["db"] == "` + req.body.entities[l]["database"] + '" and ' + `r["host"] == "` + req.body.entities[l]["node"] + '")' + `) `)
            }
        }
    }
    

    let aggregate_string = `|> aggregateWindow(every: ${req.body.cell_data.window}, fn: ${req.body.cell_data.aggregateFunction}, createEmpty: false) |> yield(name: "${req.body.cell_data.aggregateFunction}")`

    const query = bucket_string + timeperiod_string + map[req.body.cell_data.metric] + user_string + aggregate_string;
    console.log(query)

    // console.log(query)

    const query1 = `from(bucket: "${process.env.DATA_BUCKET_NAME}") \
    |> range(start: -10h, stop: -0h) \
    |> filter(fn: (r) => r["_measurement"] == "cpu") \
    |> filter(fn: (r) => r["_field"] == "usage_system") \
    |> filter(fn: (r) => r["cpu"] == "cpu-total") \
    |> filter(fn: (r) => r["host"] == "Shreys-MacBook-Pro.local") \
    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false) \
    |> yield(name: "mean")`

    const query2 = `from(bucket: "${process.env.DATA_BUCKET_NAME}") \
    |> range(start: -10h, stop: -0h) \
    |> filter(fn: (r) => r["_measurement"] == "mem") \
    |> filter(fn: (r) => r["_field"] == "used") \
    |> filter(fn: (r) => r["host"] == "Shreys-MacBook-Pro.local") \
    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false) \
    |> yield(name: "mean")`

    const query3 = `from(bucket: "${process.env.DATA_BUCKET_NAME}") \
    |> range(start: -10h, stop: -0h) \
    |> filter(fn: (r) => r["_measurement"] == "postgresql") \
    |> filter(fn: (r) => r["_field"] == "blks_read") \
    |> filter(fn: (r) => r["db"] == "lab4db" or r["db"] == "lab2db") \
    |> filter(fn: (r) => r["host"] == "Shreys-MacBook-Pro.local") \
    |> aggregateWindow(every: 1h, fn: last, createEmpty: false) \
    |> yield(name: "last")`
    
    new Promise((resolve, reject)=>{
        let output = {}
        // output.timestamps = []
        // output.data = []


        influx.queryRows(query, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row)

                // console.log(o)
                // output.timestamps.push(o["_time"])
                if (req.body.type == "node"){
                    key = o["host"]
                }
                else{
                    key = o["host"] + "___" + o["db"]
                }
                
                if (key in output){
                    output[key]["data"].push({"x": o["_time"], "y": o["_value"]})
                }
                else{
                    // temp[key] = [o["_value"]]
                    output[key] = {"data": [{"x": o["_time"], "y": o["_value"]}]}
                }


                
                // output.data.push(o);
            },
            error(error) {
              console.error(error)
              console.log('\nFinished ERROR')
              reject(error);
            },
            complete() {
              console.log('\nFinished SUCCESS');
            //   output.data = temp
              let final = []

              for (const l in output){
                  t = {}
                  t["name"] = l
                  t["data"] = output[l]["data"]
                  final.push(t)
              }
              resolve(final);
            }
        })
    }).then((data)=>{
        res.json(data)
    },(err)=>{
        res.status(505).json({err: "Some error occurred"})
    })

    // console.log(output)

    // console.log("Haha")
}

module.exports = get_dashboard_data