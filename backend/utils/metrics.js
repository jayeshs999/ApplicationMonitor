const map = {
    "cpu": '|> filter(fn: (r) => r["_measurement"] == "cpu") |> filter(fn: (r) => r["_field"] == "usage_system") |> filter(fn: (r) => r["cpu"] == "cpu-total") ',
    "mem": '|> filter(fn: (r) => r["_measurement"] == "mem") |> filter(fn: (r) => r["_field"] == "used") ',
    "disk_reads": '|> filter(fn: (r) => r["_measurement"] == "diskio") |> filter(fn: (r) => r["_field"] == "read_bytes") |> filter(fn: (r) => r["name"] == "disk0")',
    "disk_writes": '|> filter(fn: (r) => r["_measurement"] == "diskio") |> filter(fn: (r) => r["_field"] == "write_bytes") |> filter(fn: (r) => r["name"] == "disk0")', 
    "blks_hits": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "blks_hit") ',
    "blks_reads": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "blks_read") ',
    "tup_returned": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "tup_returned") ',
    "tup_fetched": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "tup_fetched") ',
    "tup_inserted": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "tup_inserted") ',
    "tup_updated": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "tup_updated") ',
    "tup_deleted": '|> filter(fn: (r) => r["_measurement"] == "postgresql") |> filter(fn: (r) => r["_field"] == "tup_deleted") '
}

module.exports = map