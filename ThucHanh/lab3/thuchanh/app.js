const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '1231',
    resave: true,
    saveUninitialized: false
}));


app.get('/', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    res.redirect('/index'); 
});
app.get('/index', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    } 
    const products = req.session.products || [];
    res.render('index', { products });
})
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  

    if (username === 'admin' && password === 'admin') {
    req.session.isAuthenticated = true; 
     console.log("sucess");
      res.redirect('/index'); 
    } else {
      res.render('login', { error: 'Tên người dùng hoặc mật khẩu không đúng.' });
    }
  });
  

app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = req.session.products || [];
    const product = products.find(item => item.id === productId);
   
    res.render('product', { product });
  });
  

app.get('/add', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    res.render('add-product');
});

app.post('/add', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    const { name, price, description } = req.body;
  
    if (!req.session.products) {
      req.session.products = [];
    }
  
    if (!req.session.productCounter) {
      req.session.productCounter = 1;
    } else {
      req.session.productCounter++;
    }
  
    const newProduct = {
      id: req.session.productCounter, 
      name,
      price,
      description
    };
  
    req.session.products.push(newProduct);
  
    req.session.flashMessage = 'Thêm sản phẩm thành công.';
    res.redirect('/');
  });
  

app.get('/edit/:id', (req, res) => {
    const productId = req.params.id;
    const products = req.session.products || [];
    const product = products.find(item => item.id === parseInt(productId));
    if (!product) {
        return res.redirect('/');
    }
    res.render('edit-product', { product });
});

app.post('/edit/:id', (req, res) => {
    const productId = req.params.id;
    const products = req.session.products || [];
    const productIndex = products.findIndex(item => item.id === parseInt(productId));
    if (productIndex === -1) {
        return res.redirect('/');
    }

    const { name, price, description } = req.body;

    products[productIndex].name = name;
    products[productIndex].price = price;
    products[productIndex].description = description;

    req.session.flashMessage = 'Cập nhật sản phẩm thành công.';
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const productId = req.params.id;
   console.log(productId);

    const products = req.session.products || [];

    const productIndex = products.findIndex(item => item.id === parseInt(productId));
    if (productIndex === -1) {
      return res.redirect('/');
    }
    products.splice(productIndex, 1);
  
    for (let i = 0; i < products.length; i++) {
      products[i].id = i + 1;
    }
  
    req.session.flashMessage = 'Xóa sản phẩm thành công.';
    res.redirect('/');
  });
  
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
