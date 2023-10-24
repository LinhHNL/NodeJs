const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User'); 
const Album = mongoose.model('Album'); 

const createSampleUsers = async () => {
    // Kiểm tra xem người dùng "user1" đã tồn tại hay chưa
    const existingUser1 = await User.findOne({ username: 'user1' });

    if (!existingUser1) {
        const user1 = new User({
            username: 'user1',
            password: 'user1',
            albums: [],
        });

        await user1.save();
        const existinga = await User.findOne({ title: 'Album 1' });

        if(!existinga){
            const album1 = new Album({
                title: 'Album 1',
                description: 'Mô tả album 1',
                user: user1._id,
                images: [],
            });
        await album1.save();
        }

    }

    const existingUser2 = await User.findOne({ username: 'user2' });

    if (!existingUser2) {
        const user2 = new User({
            username: 'user2',
            password: 'user2',
            albums: [],
        });

        await user2.save();
        
    const existi123ng231 = await User.findOne({ title: 'Album 2' });

    if(!existi123ng231){
        const album2 = new Album({
            title: 'Album 2',
            description: 'Mô tả album 2',
            user: user2._id,
            images: [],
        });
    
        await album2.save();
    }
    }



};

createSampleUsers()
    .then(() => {
        console.log('Người dùng và album mẫu đã được tạo.');
    })
    .catch((error) => {
        console.error('Lỗi khi tạo người dùng và album mẫu:', error);
    });
