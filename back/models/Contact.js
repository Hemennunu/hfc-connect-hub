const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  address: String,
  googleMapEmbedUrl: String,
  email: String,
  phone: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedIn: String,
    instagram: String,
  }
});

module.exports = mongoose.model('Contact', contactSchema);
