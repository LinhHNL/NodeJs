require('dotenv').config()
const express = require('express');
const handlebars = require('handlebars');
const engine = require('express-handlebars');
const http = require('http');
const app = express();
const axios = require('axios');

const port = process.env.PORT || 3000;
const auth = process.env.auth ;

app.engine('handlebars', engine.engine({
    defaultLayout: 'main'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.set('view engine', 'handlebars');
handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? true : false;
});

app.get('/', async (req, res) => {
    const page = req.query.page || 1; // Trang mặc định là 1 nếu không có query parameter "page"
    const pageSize = req.query.pageSize || 20; // Số lượng hàng trên mỗi trang mặc định là 10 nếu không có query parameter "pageSize"

    // Gửi yêu cầu API với page và pageSize và xử lý dữ liệu phản hồi
    try {
        const apiUrl = `https://gorest.co.in/public/v2/users?page=${page}&per_page=${pageSize}`;
        const response = await axios.get(apiUrl);
        res.render("index" ,{ responseData: response.data ,
            page :page,
            pageSize :pageSize
        });
        } catch (error) {
        console.error('API Request Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data from the API' });
    }
});



app.get('/addUser',(req,res)=>{
    res.render('add');
})

app.post('/addUser', async (req, res) => {
    const { name, email, gender, status } = req.body;
  
    // Prepare data to send to the API
    const data = {
      name,
      email,
      gender,
      status,
    };
    if (!name || !email || !gender || !status) {
        return res.status(400).json({ error: 'Invalid data. Check your input.' });
      }
    try {
      const apiUrl = 'https://gorest.co.in/public/v2/users';
      const auth = process.env.auth ;
  
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Authorization": `Bearer ${auth}`,
        },
      });
      
      res.status(200).json({"success": true});
     
    } catch (error) {
      console.error('API Request Error:', error.response.status);
    res.status(error.response.status).json({"success": false});

    }
  });
  

  app.get('/details/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const apiUrl = 'https://gorest.co.in/public/v2/users/' + id;
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            res.render("details", { responseData: response.data });
        } else {
            console.error('API Request Error:', response.statusText);
            res.status(response.status).json({ error: 'An error occurred while fetching data from the API' });
        }
    } catch (error) {
        console.error('API Request Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});
app.put('/update', async (req, res)=>{

    const {id, name, email, gender, status } = req.body;
  
    // Prepare data to send to the API
    const data = {
        id,
      name,
      email,
      gender,
      status,
    };
    if (!name || !email || !gender || !status) {
        return res.status(400).json({ error: 'Invalid data. Check your input.' });
      }
    try {
      const apiUrl = 'https://gorest.co.in/public/v2/users';
      const auth = process.env.auth ;
  
      const response = await axios.put(apiUrl, data, {
        headers: {
          "Authorization": `Bearer ${auth}`,
        },
      });
      
      res.status(200).json({"success": true});
     
    } catch (error) {
      console.error('API Request Error:', error.response.status);
    res.status(error.response.status).json({"success": false});

    }

})
app.get('/update/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const apiUrl = 'https://gorest.co.in/public/v2/users/' + id;
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            res.render("update", { responseData: response.data });
        } else {
            console.error('API Request Error:', response.statusText);
            res.status(response.status).json({ error: 'An error occurred while fetching data from the API' });
        }
    } catch (error) {
        console.error('API Request Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
})
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const apiUrl = 'https://gorest.co.in/public/v2/users/' + id;
        const response = await axios.delete(apiUrl,{
            headers: {
              "Authorization": `Bearer ${auth}`,
            },
          });
       
                res.status(200).json({
                    success : true
                }); 
            console.log("Xóa xong rồi á" + response.status);
    } catch (error) {
        console.error('API Request Error:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

app.listen(port, () => {
    console.log('Server is running on port 3000');
});
