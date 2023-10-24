const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  images: [] 
  ,
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
