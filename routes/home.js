const express = require('express')
const db = require('../db/db')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10)
const secret = require('../secret/admin.js')
const data = JSON.parse(secret)


//404
router.get('/', (req, res) => {
    res.render('home/404')
})
//404

//LOGIN
router.get('/login', (req, res) => {
    if(req.cookies.token){
        res.redirect('/user/')

    }
        res.render('home/login')
})

router.post('/login', (req, res, next) => {
    const user = req.body.usuario
    const senha = req.body.senha
    const SQL = 'SELECT * FROM usuarios WHERE usuario = ?'

    db.query(SQL, [user], (err, response) => {
        const erros = []

        try{
            bcrypt.compare(senha, response[0].senha, (err, result) => {   
                if(result) {
                    const token = jwt.sign({
                        id: response[0].id,
                        usuario: response[0].usuario,
                    }, 
                        'S@T690as5!w186Y%$', {expiresIn: '1h'})
                        res.cookie('token', token)
                        
                        const SQLCookie = 'UPDATE cookies SET conteudo = ? WHERE USUARIO = ?'
        
                        db.query(SQLCookie, [token, user], (error, Result) => {
                            if(err) console.log(err)
                            console.log('Login Successfully!')
                            res.redirect('/user')
                        })
                    }

                    else{
                        erros.push({message: "Incorrect username or password!"})
                        res.status(401).render('home/login', {erro: erros})

                    }
           })
        }

        catch(error){
            erros.push({message: "Incorrect username or password!"})
            res.status(401).render('home/login', {erro: erros})

        }
    })
})
//LOGIN

//REGISTER
router.get('/register', (req, res) => {
    res.render('home/register')
    console.log(req.cookies)
})
 
router.post('/register', (req, res) => {
    const SQL = 'INSERT INTO usuarios (nome, email, nascimento, usuario, senha) VALUES(?,?,?,?,?);'
    const nome = req.body.nome
    const email = req.body.email
    const nascimento = req.body.nascimento
    const usuario = req.body.usuario
    const senha = req.body.senha

    const erros = []
    const sucessos = []

    if(senha === req.body.senha2 && senha.length >= 6){

        const hash = bcrypt.hashSync(senha, salt)

        if(req.body.adm === data.password){
        db.query(SQL, [nome, email, nascimento, usuario, hash], (err, result) => {
            if(err) throw err
            sucessos.push({message:'Registered User successfully!'})
            res.status(200).render('home/register', {sucesso: sucessos})
        })}

        else{
            erros.push({message:'Incorrect Administrator Password!'})
            res.status(401).render('home/register', {erro: erros})
        }
    }
    else{
        erros.push({message:'Register user error. Data do not match or short password!'})
        res.status(401).render('home/register', {erro: erros})
    }
})
//REGISTER

//401
router.get('/401', (req, res) => {
    res.render('home/401')
})
//401
module.exports = router