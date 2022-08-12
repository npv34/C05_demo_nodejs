const http = require('http');
const port = 8000;
const fs = require('fs');
const qs = require('qs');
const url = require('url'); // xu ly url
const bodyParser = require('body-parser');
const UserManager = require('./src/UserManager')

let login = false;

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false});

function getTemplate(req, res, filePath) {
    fs.readFile('./views/'+filePath+ '.html', 'utf8', (err, data) => {
        // tra ve response
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    })
}

const server = http.createServer((req, res) => {

    //xử lý url dùng thư viện url -> lấy ra dữ liệu mong muốn
    let urlPath = url.parse(req.url).pathname;

    let method = req.method;
    // xu ly doc file css/js/img

    let extension = urlPath.split('.').pop();

    let userManager = new UserManager()

    let arrExtensions = ['css', 'js', 'png']

    if (!arrExtensions.indexOf(extension)) {
        switch (extension) {
            case 'css':
                fs.readFile('public' + urlPath, 'utf8', (err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                    // tra ve response
                    res.writeHead(200, {'Content-type': 'text/css'});
                    res.write(data);
                    res.end('oke');
                })
                break;
            case 'js':
                fs.readFile('public' + urlPath, 'utf8', (err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                    // tra ve response
                    res.writeHead(200, {'Content-type': 'text/javascript'});
                    res.write(data);
                    res.end();
                })
                break;
            case 'png':
                fs.readFile('public' + urlPath, (err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                    // tra ve response
                    res.writeHead(200, {'Content-type': 'text/png'});
                    res.write(data);
                    res.end();
                })
                break;
            default:
                res.end('err')
        }
    } else {
        switch (urlPath) {
            case '/delete':
                // lay gia  tri index
                let index = +qs.parse(url.parse(req.url).query).index
                userManager.deleteUser(req, res, index);
                break;
            case '/about':
                getTemplate(req, res, 'about');
                break;
            case '/login':
                if (method === 'GET') {
                    getTemplate(req, res, 'login');
                } else {
                    // xu ly form
                    let data = ''
                    req.on('data', chunk => {
                        data += chunk
                    })
                    req.on('end', () => {
                        let dataForm = qs.parse(data);
                        if (dataForm.email === 'admin@gmail.com' && dataForm.password === '123') {
                            login = true
                            res.writeHead(301, { Location: '/about'})
                        }
                        res.end()
                    })
                }
                break;
            case '/':
                userManager.showHomePage(req, res)
                break;
            default:
                res.end()

        }
    }

})

server.listen(port, 'localhost', () => {
    console.log('server listening in http://localhost:' +  port)
})
