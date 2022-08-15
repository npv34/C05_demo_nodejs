$(document).ready(function () {
    let origin = window.origin
    $('#search').on('keyup', function (e) {
        let input = $('#search').val();
        axios.get(origin + '/search', {
            params: {
                keyword: input
            }
        }).then(function (response) {
            let users = response.data;
            let html = '';
            users.forEach((item, index) => {
                html += `<tr>`;
                html += `<td>${index + 1}</td>`;
                html += `<td>${item.username}</td>`;
                html += `<td>${item.email}</td>`;
                html += `<td>${(item.role == 1) ? 'Admin' : 'User' }</td>`;
                html += `<td><a onclick="return confirm('Are you sure?')" href="/delete?index=${index}" class="btn btn-danger">Delete</a></td>`;
                html += `</tr>`;
            })
            $('#list-users').html(html);
        })
    })
})
