const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const axios = require('axios');
const qs = require('querystring'); // Thêm mô-đun 'querystring'
const handlebars = require('handlebars');
const { check, validationResult } = require('express-validator');
const querystring = require('querystring');

const app = express();
const auth = "51ef35a5e35eebac0b86e7feb97a5a26095d5728b46ca2d694b265864e0f4967";
// Thiết lập Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? true : false;
});


app.use(session({ secret: 'ling', resave: true, saveUninitialized: true }));
app.use(flash());


// Route gửi yêu cầu API
app.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 20;
  try {
    const apiUrl = `https://gorest.co.in/public/v2/users?page=${page}&per_page=${pageSize}`;
    const response = await axios.get(apiUrl);
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
     res.render("index", {
      responseData: response.data,
      page: page,
      pageSize: pageSize,
      successMessage : successMessage,
      errorMessage : errorMessage,
    });
  } catch (error) {
    console.error('API Request Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the API' });
  }
});
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
      const apiUrl = 'https://gorest.co.in/public/v2/users/' + id;
      const response = await axios.delete(apiUrl, {
        headers: {
          "Authorization": `Bearer ${auth}`,
        },
      });
  
      if (response.status === 204) {
        req.flash('success', 'Xóa người dùng thành công.');
      } else {
        req.flash('error', 'Xóa người dùng không thành công.');
      }
      console.log("Xóa xong rồi á" + response.status);
    res.redirect('/');
        
    } catch (error) {
      console.error('API Request Error:', error.message);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  });
 
app.get('/add',(req,res)=>{
    res.render('add');
})

app.post('/add', async (req, res) => {
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });
  
    req.on('end', async () => {
      const { name, email, gender, status } = querystring.parse(requestBody);
  
      const data = {
        name,
        email,
        gender,
        status,
      };
      console.log(data);
  
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
      }
  
      try {
        const apiUrl = 'https://gorest.co.in/public/v2/users';
        const auth = process.env.auth;
  
        const response = await axios.post(apiUrl, data, {
          headers: {
            "Authorization": `Bearer ${auth}`,
          },
        });
  
          req.flash('success', 'Thêm người dùng thành công.');
          res.redirect('/');
      
      } catch (error) {
        console.error('API Request Error:', error.response.status);
        req.flash('error', 'Thêm người dùng không thành công.');
        res.redirect('/');
      }
    });
  });
  
  app.put('/update',
   
    async (req, res) => {
      let requestBody = '';
      req.on('data', (chunk) => {
        requestBody += chunk.toString();
      });
  
      req.on('end', async () => {
        const { id, name, email, gender, status } = querystring.parse(requestBody);
  
        // Sử dụng express-validator để kiểm tra dữ liệu
        const errors = validationResult(req);
  
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, message: errors.array() });
        }
        const data = {
          id,
          name,
          email,
          gender,
          status,
        };
        console.log(data);
  
        try {
          const apiUrl = 'https://gorest.co.in/public/v2/users';
          const auth = process.env.auth;
  
          const response = await axios.put(apiUrl, data, {
            headers: {
              "Authorization": `Bearer ${auth}`,
            },
          });
  
          if (response.status === 200) {
            return res.status(200).json({ success: true });
          } else {
            return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật dữ liệu' });
          }
        } catch (error) {
          console.error('API Request Error:', error.response.status);
          return res.status(error.response.status).json({ success: false, message: 'Lỗi khi gửi yêu cầu cập nhật' });
        }
      });
    }
  );
  
  app.get('/profile/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const apiUrl = 'https://gorest.co.in/public/v2/users/' + id;
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            res.render("profile", { responseData: response.data });
        } else {
            console.error('API Request Error:', response.statusText);
            res.status(response.status).json({ error: 'An error occurred while fetching data from the API' });
        }
    } catch (error) {
        console.error('API Request Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});
  app.get('/getFlashMessages', (req, res) => {
    const messages = req.flash();
    res.json(messages);
  });
  
app.use((req, res) => {
    res.status(404).render('error');
  });
  
const port = 3000;
app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
});
