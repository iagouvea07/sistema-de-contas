const express = require('express')
const app = express()
const port = 8080

const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const user = require('./routes/user.js')
const home = require('./routes/home.js')

const db = require('./db/db.js')
const path = require('path')
const cookieParser = require('cookie-parser')
db.connect()

//MIDDLEWARE CONFIGURATION
app.use(cookieParser())
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/user', user)
app.use('/home', home)
app.use(express.static(path.join(__dirname,"/public")))
//MIDDLEWARE CONFIGURATION

app.get('/', (req, res) => {
    res.redirect('home/login')
})

app.listen(port, (err) =>{
    console.log('Servidor iniciado no endereco: http://192.168.15.85:8080')
})