const map = {
    "cpu": '|> filter(fn: (r) => r["_measurement"] == "cpu") |> filter(fn: (r) => r["_field"] == "usage_system") |> filter(fn: (r) => r["cpu"] == "cpu-total") ',
    "mem": '|> filter(fn: (r) => r["_measurement"] == "mem") |> filter(fn: (r) => r["_field"] == "used") ',
    "blks_hits": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "blks_hit") '
}

module.exports = map