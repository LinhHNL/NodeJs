const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./user'); 
const Album = require('./album'); 
const flash = require('express-flash');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;
const Handlebars = require('handlebars');
const sample = require('./sample');
mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Kết nối đến MongoDB thành công');
});
mongoose.connection.on('error', (err) => {
  console.error('Lỗi khi kết nối đến MongoDB:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Kết nối đến MongoDB đã bị ngắt');
});
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)

    })
);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'hehe', resave: true, saveUninitialized: true }));

app.use(flash());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/login', (req, res) => {

  res.render('login');
});

app.post('/login',async  (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password })
    console.log(user)
    if (!user) {
  console.log("chekc");

        res.redirect('/login'); 
       
    } else {
    req.session.user = username; 
    req.session.userid = user.id; 
    req.session.logined = true;

    res.redirect('/index');
    }
});
    app.get('/', (req, res) => {
        if (req.session.logined) {
            res.redirect('/index');

        } else {
            res.redirect('/login');
        }
    });
app.get('/index',async (req,res)=>{
    const Albums = await Album.find({user: req.session.userid});
    console.log(Albums);
    res.render('index', { listAlbums: Albums ,name: req.session.user});
})
app.post('/createAlbum', async (req, res) => {
  try {
    
    const { title, description } = req.body;

    const newAlbum = new Album({
      title: title,
      description: description,
      user: req.session.userid, 
      images: [], 
    });

    await newAlbum.save();
            res.redirect('/index');

  
  } catch (error) {
    res.send("Tạo album thất bại");
  }
});
function isImageFile(file) {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExt = path.extname(file.originalFilename).toLowerCase();
  return allowedExtensions.includes(fileExt);
}
app.get('/album/:id', async (req, res) => {
  const albumId = req.params.id;
  res.render('view-images');
});

app.get('/getImages/:id', async (req, res) => {
  const album = await Album.findById(req.params.id);
  console.log(album)

  if (!album) {
    return res.status(404).json();
  }
  // Tiếp tục trả về danh sách hình ảnh
  res.json({ images: album.images });
});


app.post('/upload-images/:id', async (req, res) => {
  const form = new multiparty.Form();
  
  try {
      form.parse(req, async (err, fields, files) => {
          if (err) {
              return res.status(500).send('Error parsing form data');
          }

          if (!files.images || files.images.length === 0) {
              return res.status(400).send('No file uploaded');
          }

          const uploadedFile = files.images[0];

          if (!isImageFile(uploadedFile)) {
              return res.status(400).send('Uploaded file is not an image');
          }

          const originalFilename = uploadedFile.originalFilename;
          const fileExt = path.extname(originalFilename);
          const timestamp = new Date().getTime();
          const newFilename = `${originalFilename}_${timestamp}${fileExt}`;
          const targetPath = path.join('images', newFilename);

          try {
              await fs.promises.copyFile(uploadedFile.path, targetPath);
              const album = await Album.findById(req.params.id);
              
              if (!album) {
                  return res.status(404).send('Album not found');
              }

              album.images.push(newFilename);

              await album.save();

              return res.status(200).send('File uploaded and added to the album successfully');
          } catch (error) {
              return res.status(500).send('Error processing file and updating the album');
          }
      });
  } catch (error) {
      return res.status(500).send('Error parsing form data');
  }
});

  
  app.use((req, res) => {
    res.status(404).send('Trang không tồn tại');
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
