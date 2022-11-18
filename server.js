const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = require('./app');

// configuring DB connection
const DB = process.env.DB_LINK;

mongoose.connect(DB).then(() => console.log('DB Connected Successfully'));

// listening request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Started Server On Port Number ${PORT} : `);
});
