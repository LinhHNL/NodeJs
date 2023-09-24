const express = require('express');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const app = express();
const port = 3000;
app.set('view engine', 'handlebars');
	app.engine('handlebars', expressHandlebars.engine({ 
		defaultLayout: 'main' ,
		helpers: {
			tablefor : function(n , options){
				let output = '';
				for (var i = 0; i < n;i++){
					output += options.fn(i);
				}
				return output;
			}
		}

	}));
	Handlebars.registerHelper('table', function (rows, cols, options) {
		let tableHTML = '<table border="1" >';
		for (let i = 0; i < rows; i++) {
		tableHTML += '<tr>';
		for (let j = 0; j < cols; j++) {
			tableHTML += '<td>Row ' + (i + 1) + ', Col ' + (j + 1) + '</td>';
		}
		tableHTML += '</tr>';
	}
	tableHTML += '</table>';
	return new Handlebars.SafeString(tableHTML);
});
app.get('/table', (req, res) => {
	res.render('table');
});
app.get('/tablefor', (req, res) => {
	res.render('tablefor');
})
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
