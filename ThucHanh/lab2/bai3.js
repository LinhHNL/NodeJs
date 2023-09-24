const httpClient = require('http')
const url = require('url')
 const students = [
    { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@example.com' },
    { id: 2, name: 'Tran Thi B', email: 'tranthib@example.com' },
    { id: 3, name: 'Le Van C', email: 'levanc@example.com' },
];
const sever = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
	if(path.pathname ==="/students" && path.method="get"){
		res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify("status:success",students));

	}
	if(path.pathname ==="/students" && path="post"){
		let data = ''
		req.on('data',chuck=>{
			data += chuck;
		});
		req.on('end'()=>{
			const newStudent = JSON.parse(data);
			if(students[students.length-1]){
				newStudent.id = students[students.length-1].id;

			}else{
				newStudent.id = 1;
			}
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });            
			res.end(JSON.stringify("status:success",newstudent));
			res.end(JSON.stringify(newItem));
		})
	}
	if(path.pathname ==="/students/" && path.method="get"){
		const id = parseInt(path.pathname).slip('/').pop();
		const student = students.find(id); 
		if(student){
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });          
			res.end(JSON.stringify("status:success",student));
		}else{
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });          
			res.end(JSON.stringify("status:failed",student));
		}
	}
if(path.pathname ==="/students/" && path.method="put"){
		const id = parseInt(path.pathname).slip('/').pop();
		const student = students.find(id); 
		if(student){
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });          
			res.end(JSON.stringify("status:success",student));
		}else{
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });          
			res.end(JSON.stringify("status:failed",student));
		}
	}})
if(path.pathname ==="/students/" && path.method="delete"){
		const id = parseInt(path.pathname).slip('/').pop();
		const student = students.delete(id); 
		if(student){
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });          
			res.end(JSON.stringify("status:success",student));
		}else{
			res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });          
			res.end(JSON.stringify("status:failed",student));
		}
	}