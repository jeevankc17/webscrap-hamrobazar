const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    contact: {
        type: String,
    },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
