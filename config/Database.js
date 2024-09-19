const mongoose = require('mongoose');

const dataConnect = () =>{
    mongoose.connect(process.env.DB_URL).then((conn) => {
        console.log(`database connected: ${conn.connection.host}`)
    }).catch((err) => {
        console.error(`Database Error: ${err}`)
        process.exit(1);
    });
};

module.exports = dataConnect;