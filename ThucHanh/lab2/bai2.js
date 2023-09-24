var formhtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Đăng nhập</title>
<!-- Link Bootstrap CSS -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5">
<div class="row justify-content-center">
<div class="col-md-6">
<div class="card">
<div class="card-header">Đăng nhập</div>
<div class="card-body">
<form method="post" action="/login">
<div class="form-group">
<label for="username">Tên người dùng:</label>
<input type="text" class="form-control" id="username" name="username" required>
</div>
<div class="form-group">
<label for="password">Mật khẩu:</label>
<input type="password" class="form-control" id="password" name="password" required>
</div>
<button type="submit" class="btn btn-primary">Đăng nhập</button>
</form>
</div>
</div>
</div>
</div>
</div>
<!-- Link Bootstrap JS and jQuery (optional) -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
`;
const usernamecorrect = 'admin'
const passwordcorrect = 'admin'
var http = require('http');
var url = require('url');
const querystring = require('querystring');

const server = http.createServer(function(req, res) {
	let  result;
	
	var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase();
	switch (path){
	case '':
		 if (req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(formhtml);
                res.end();
            } else {
                result = 'Phương thức không hỗ trợ';
            }
           
		break;
	case '/login':
		if(req.method="POST"){
			let data = '';
			req.on('data',chuck=>{
				data +=chuck;
			});
			req.on('end',()=>{
				const postData = querystring.parse(data);
				var username = postData.username;
				var password = postData.password;
				if(username===usernamecorrect && password === passwordcorrect){
					result = "Đăng nhập thành công";
				}else{
					result= "Mật khẩu không hợp lệ";

				}

                    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8'});
                    res.write(result);
                    res.end();
			})
		}else{
			result = "Phương thức GET không hỗ trợ";
		}
		break;
	default: 
		result = "Đường dẫn không hợp lệ";

	break;
	}
	
    if (result) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8'});
        res.write(result);
        res.end();
    }
})
const port = 3000;
server.listen(port, () => {
	console.log(`Server đang lắng nghe tại cổng ${port}`);
});