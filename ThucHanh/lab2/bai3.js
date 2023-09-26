const http = require('http');
const url = require('url');

const students = [
	{ id: 1, name: 'Nguyen Van A', email: 'nguyenvana@example.com' },
	{ id: 2, name: 'Tran Thi B', email: 'tranthib@example.com' },
	{ id: 3, name: 'Le Van C', email: 'levanc@example.com' },
	];

const server = http.createServer((req, res) => {
	const parsedUrl = url.parse(req.url, true);

	if (parsedUrl.pathname === '/students') {
		if (req.method === 'GET') {
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
			res.end(JSON.stringify({ status: 'success', data: students }));
		} else if (req.method === 'POST') {
			let data = '';
			req.on('data', (chunk) => {
				data += chunk;
			});
			req.on('end', () => {
				const newStudent = JSON.parse(data);
				if (students[students.length - 1]) {
					newStudent.id = students[students.length - 1].id + 1;
				} else {
					newStudent.id = 1;
				}
				students.push(newStudent);
				res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
				res.end(JSON.stringify({ status: 'success', data: newStudent }));
			});
		}
	} else if (parsedUrl.pathname.startsWith('/students/')) {
		const id = parseInt(parsedUrl.pathname.split('/').pop());
		const student = students.find((student) => student.id === id);
		if (student) {
			if (req.method === 'GET') {
				res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
				res.end(JSON.stringify({ status: 'success', data: student }));
			} else if (req.method === 'PUT') {
				let data = '';
				req.on('data', (chunk) => {
					data += chunk;
				});
				req.on('end', () => {
					const updatedStudent = JSON.parse(data);
					const studentIndex = students.findIndex((student) => student.id === id);
					if (studentIndex !== -1) {
						students[studentIndex].name = updatedStudent.name;
						students[studentIndex].email = updatedStudent.email;

						res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
						res.end(JSON.stringify({ status: 'success', data: students[studentIndex] }));
					} else {
						res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
						res.end(JSON.stringify({ status: 'failed', message: 'Student not found' }));
					}
				});

			} else if (req.method === 'DELETE') {
				const studentIndex = students.findIndex((student) => student.id === id);
				if (studentIndex !== -1) {
					const deletedStudent = students.splice(studentIndex, 1);

					res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
					res.end(JSON.stringify({ status: 'success', data: deletedStudent }));
				} else {
					res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
					res.end(JSON.stringify({ status: 'failed', message: 'Student not found' }));
				}
			}
		} else {
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
			res.end(JSON.stringify({ status: 'failed', message: 'Student not found' }));
		}
	}
});

server.listen(3000, () => {
	console.log('Server is running on port 3000');
});
