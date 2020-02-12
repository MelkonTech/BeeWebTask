const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'beewebtask'
});

//connect to database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected!!');
});

module.exports = db