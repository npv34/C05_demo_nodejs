const fs = require("fs");

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
                html += `<td><a href="/delete?index=${index}" class="btn btn-danger">Delete</a></td>`;
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

    deleteUser(req, res, index){
        // thuc hien xoa index
        res.end('delete');
    }
}

module.exports = UserManager
