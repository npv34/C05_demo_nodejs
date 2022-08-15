const fs = require("fs");
const qs = require("qs");
const url = require('url')

class UserManager {
    showHomePage(req, res) {
        fs.readFile('./data.json', 'utf8', (err, data) =>{
            let dataJson = JSON.parse(data);
            let html = '';
            dataJson.forEach((item, index) => {
                html += `<tr>`;
                html += `<td>${index + 1}</td>`;
                html += `<td>${item.username}</td>`;
                html += `<td>${item.email}</td>`;
                html += `<td>${(item.role == 1) ? 'Admin' : 'User' }</td>`;
                html += `<td><a onclick="return confirm('Are you sure?')" href="/delete?index=${index}" class="btn btn-danger">Delete</a></td>`;
                html += `</tr>`;
            })

            fs.readFile('./views/index.html', 'utf8', (err, data) => {
                res.writeHead(200, {'Content-type': 'text/html'});
                data = data.replace('{list-user}', html)
                res.write(data);
                res.end();
            })
        })
    }

    showFormAdd(req, res) {
        fs.readFile('./views/add.html', 'utf8',(err, data) =>{
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(data);
            res.end();
        })
    }

    async deleteUser(req, res){
        let index = qs.parse(url.parse(req.url).query).index;
        let dataFile = await this.readData();
        let JsonData = JSON.parse(dataFile);
        JsonData.splice(index, 1);
        fs.writeFile('./data.json', JSON.stringify(JsonData), err => {
            if (err) {
                throw new Error(err.message)
            }
            res.setHeader('Cache-Control', 'no-store')
            res.writeHead(301, {'Location': '/'})
            res.end();
        })
    }

    createUser(req, res) {
        let data = "";
        req.on('data', chunk => {
            data += chunk;
        })

        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let dataFile = await this.readData();
            let JsonData = JSON.parse(dataFile);
            JsonData.push(dataForm)
            fs.writeFile('./data.json', JSON.stringify(JsonData), err => {
                if (err) {
                    throw new Error(err.message)
                }
                res.writeHead(301, {'Location': '/'})
                res.end();
            })
        })
    }

    readData() {
        return new Promise((resolve, reject) => {
            fs.readFile('./data.json', 'utf8',(err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        })
    }

    async search(req, res) {
        let keyword = qs.parse(url.parse(req.url).query).keyword;
        let dataFile = await this.readData();
        let JsonData = JSON.parse(dataFile);
        let dataSearch = JsonData.filter(item => {
            return item.username.includes(keyword);
        })
        res.end(JSON.stringify(dataSearch));
    }

}

module.exports = UserManager
