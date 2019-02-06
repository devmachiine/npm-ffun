var ff = require('./rope.js')('some location');

console.log('required thing ff:' + ff);

let addPath = 'https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/2f980ee176dfa76d03dda4bf1737c3fe6a727eae/add.js'

let add = ff(addPath)

console.log('ff\'d thing add:' + add);

add.then(f => {
    console.log('add 3 + 8 = ' + f(3, 8));
}).catch((oops) => console.log('oops ~ ' + oops))

// name ideas..
// hunt, rope, lint, ffetch, use, aquire, get, ff, defn, foo, reqf, ask
//
// possibly conflicting names not to use: f, fx, fn, fun, func ?
//
// ff : fetch function async
// fi : get function now, non async ~ ff calls fi

// start server to await async compute..

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(req.url);
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});