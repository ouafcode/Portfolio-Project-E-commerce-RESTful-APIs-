const mongoose = require('mongoose');

const db = () => {
    //Connect to database>
    mongoose
        .connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database Connected: ${conn.connection.host}`);
        })
        // .catch((err) => {
        //     console.log(`Database Error: ${err}`);
        //     process.exit(1);
        // });
};

module.exports = db;