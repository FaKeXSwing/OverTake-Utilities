import http from 'http';
http.createServer(function (req, res) {
    res.write("Online");
    res.end();
}).listen(8080);
