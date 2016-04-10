var redis = require ('node-redis')
var server = process.env.REDIS_DB_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_DB_PORT_6379_TCP_PORT;
console.log("Connecting to " + server + ":" + port);
var client = redis.createClient(port, server);

var val = client.incr("hit_count", function(err, val) {
  console.log("hit_count "+ val);
  client.quit();
});
