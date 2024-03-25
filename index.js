const express = require('express');
const mongoose = require('mongoose');
const contactRoute = require('./routes/contactRoute');
const { fetchContact } = require('./utils/fetchData');
const { scrapeEnabled } = require('./utils/fetchData');

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        if (scrapeEnabled) {
            fetchContact(); // Call fetchContact after successful DB connection
        }
        if (typeof fetchContact === 'function') {
            console.log('fetchContact is a function');
            await fetchContact(); // Call fetchContact after successful DB connection
        } else {
            console.error('fetchContact is not a function');
        }
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });


// Routes
app.use('/api/contacts', contactRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
