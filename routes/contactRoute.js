const express = require('express');
const { getUniqueContacts } = require('../controllers/contactController');

const router = express.Router();

router.get('/unique-contacts', getUniqueContacts);

module.exports = router;
