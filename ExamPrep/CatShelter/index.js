
const http = require('http');
const homeHtml = require('./views/home/index.js');
const siteCss = require('./content/styles/site.js');

const server = http.createServer(async (req, res) => {
    console.log(req.url);

    if(req.url == '/'){
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(homeHtml);
}else if(req.url == '/content/styles/site.css'){
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.write(siteCss);
}
   
    res.end();
});

server.listen(5000, () => console.log('This servr is running on post 5000...'));