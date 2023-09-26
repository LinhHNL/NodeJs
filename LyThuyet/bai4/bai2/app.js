const express = require('express');
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
function isImageFile(file) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExt = path.extname(file.originalFilename).toLowerCase();
    return allowedExtensions.includes(fileExt);
}

app.get('/getImages', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Lỗi khi đọc thư mục uploads:', err);
            res.status(500).json({ error: 'Lỗi khi đọc thư mục uploads' });
            return;
        }

        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json({ images: imageFiles });
    });
});

app.post('/upload-images', (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).send('Error parsing form data');
            return;
        }
        if (!files.images) {
            res.status(400).send('No file uploaded');
            return;
        }
        const uploadedFile = files.images[0];
        
        if (!isImageFile(uploadedFile)) {
            res.status(400).send('Uploaded file is not an image');
            return;
        }
     

        const originalFilename = uploadedFile.originalFilename;
        const fileExt = path.extname(originalFilename);
        const timestamp = new Date().getTime();
        const newFilename = `${originalFilename}_${timestamp}${fileExt}`;
        const targetPath = path.join(__dirname, 'uploads', newFilename);

        fs.copyFile(uploadedFile.path, targetPath, (err) => {
            if (err) {
                console.error(`Error moving file: ${originalFilename}`);
                res.status(500).send(`Error moving file: ${originalFilename}`);
                return;
            }

            res.status(200).send('File uploaded successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
