const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// todo nb https https://stackoverflow.com/a/5140393

const server = http.createServer((req, res) => {
  // if req kill
  // process.exit()

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(req.url);
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});