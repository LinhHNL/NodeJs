var http = require('http');
var url = require('url');
var querystring = require('querystring'); // Add this line

var html = `
<!DOCTYPE html vi>
<html>
<head>
<meta charset="UTF-8">

<title>Máy tính đơn giản</title>
</head>
<body>
<h1>Máy tính đơn giản</h1>
<form id="calculator" method="get" action="/result">
<label for="num1">Số hạng thứ 1:</label>
<input type="number" id="num1" name="num1" required><br><br>
<label for="num2">Số hạng thứ 2:</label>
<input type="number" id="num2" name="num2" required><br><br>
<label for="operator">Phép tính:</label>
<select id="operator" name="operator">
<option value="">Chọn phép tính</option>
<option value="add">Cộng</option>
<option value="subtract">Trừ</option>
<option value="multiply">Nhân</option>
<option value="divide">Chia</option>
</select><br><br>
<input type="submit" value="Tính toán">
</form>
</body>
</html>
`;

http.createServer(function (req, res) {
	var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase();
  switch (path) {
    case '':
      res.writeHead(200,"Content-Type", "text/html"); // Change Content-Type
      res.write(html);
      res.end();
      break;
    case '/result':
      var q = url.parse(req.url, true).query; // Correct the URL parsing
      var operator = String(q.operator); // Ensure operator is a string
      var num1 = parseFloat(q.num2); // Parse num1 as a float
      var num2 = parseFloat(q.num1); // Parse num2 as a float
      var result;
      switch (operator) {
        case 'add':
          result = num2 + "+" +num1+ "=" +(num2 + num1);
          break;
        case 'subtract':
          result = num2 + "-" +num1+ "=" +(num2 - num1);
          break;
        case 'multiply':
          result = num2+ "*" +num1+ "=" +(num2 * num1);
          break;
        case 'divide':
          result = num2 + "/" + num1+ "=" +(num2 / num1);
          break;
        default:
          result = 'Vui lòng chọn phép tính';
          break;
      }
      if (operator !== null) {
res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' }); // Specify UTF-8 encoding
      	res.write(result)
        res.end(); // Send the result as a response
      }
      break;
   	default: 
res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' }); // Specify UTF-8 encoding
res.write("Đường dẫn không hợp lệ");
res.end();
break;

  }
}).listen(3000);
