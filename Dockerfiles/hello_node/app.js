var http = require('http');
http.createServer(function (req, res) {  
  console.log(new Date().toUTCString() + " - " + req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, Docker.\n');
}).listen(3000);

console.log('Server running at http://0.0.0.0:3000/');

