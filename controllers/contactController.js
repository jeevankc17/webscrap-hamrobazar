const Contact = require('../models/contactModel');

async function getUniqueContacts(req, res) {
    try {
        const uniqueContacts = await Contact.aggregate([
            {
                $group: {
                    _id: { name: "$name", contact: "$contact" },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id.name",
                    contact: "$_id.contact",
                },
            },
        ]);

        console.log(`Unique Contact Information: ${uniqueContacts.length}`);
        res.json(uniqueContacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getUniqueContacts, scrapeEnabled };
