const mysql = require('mysql')
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'6055302',
    database:'server'
})

module.exports= db