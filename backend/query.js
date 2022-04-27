const { InfluxDB, Point } = require('@influxdata/influxdb-client')

const url = process.env.INFLUX_URL || ''
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG || ''

const queryApi = new InfluxDB({url, token}).getQueryApi(org)

const fluxQuery = 'from(bucket:"Trial") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")'

const anotherQuery = 'from(bucket: "Project") \
|> range(start: -10h) \
|> filter(fn: (r) => r["_measurement"] == "cpu") \
|> filter(fn: (r) => r["_field"] == "usage_system") \
|> filter(fn: (r) => r["cpu"] == "cpu-total") \
|> filter(fn: (r) => r["host"] == "Shreys-MBP") \
|> aggregateWindow(every: 1h, fn: mean, createEmpty: false) \
|> yield(name: "mean")'


const fluxObserver = {
    next(row, tableMeta) {
    //   console.log("Hello")
      const o = tableMeta.toObject(row)
    //   console.log(
    //     `${o._time} ${o._measurement} in ${o.region} (${o.sensor_id}): ${o._field}=${o._value}`
    //   )
      console.log(o)
    },
    error(error) {
      console.error(error)
      console.log('\nFinished ERROR')
    },
    complete() {
        // console.log("Hello")
      console.log('\nFinished SUCCESS')
    }
  }
  
  /** Execute a query and receive line table metadata and rows. */
  queryApi.queryRows(anotherQuery, fluxObserver)


const writeApi = influxDB.getWriteApi(org, bucket)

writeApi.useDefaultTags({ region: 'west' })

const point1 = new Point('temperature')
  .tag('sensor_id', 'TLM01')
  .floatField('value', 24.0)

console.log(` ${point1}`)


writeApi.writePoint(point1)

writeApi.close().then(() => {
  console.log('WRITE FINISHED')
})