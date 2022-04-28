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



function get_dashboard_data(req, res, influx) {
    console.log(req.body)
    const query = 'from(bucket: "Project") \
    |> range(start: -10h, stop: -0h) \
    |> filter(fn: (r) => r["_measurement"] == "cpu") \
    |> filter(fn: (r) => r["_field"] == "usage_system") \
    |> filter(fn: (r) => r["cpu"] == "cpu-total") \
    |> filter(fn: (r) => r["host"] == "Shreys-MacBook-Pro.local") \
    |> aggregateWindow(every: 1h, fn: mean, createEmpty: false) \
    |> yield(name: "mean")';
    
    new Promise((resolve, reject)=>{
        let output = []

        influx.queryRows(query, {
            next(row, tableMeta) {
              const o = tableMeta.toObject(row)
              output.push(o);
            },
            error(error) {
              console.error(error)
              console.log('\nFinished ERROR')
              reject(error);
            },
            complete() {
              console.log('\nFinished SUCCESS');
              resolve(output);
            }
        })
    }).then((data)=>{
        res.json(data)
    },(err)=>{
        res.status(505).json({err: "Some error occurred"})
    })

    console.log("Haha")
}

module.exports = get_dashboard_data