const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const login = require('../middleware/login.js')
const createSheet  = require('../public/js/create-sheet.js')
//const consulta = require('../public/js/select.js')

router.get('/', login, (req, res) => {
    res.render('user/home')
})

//PAYMENT
router.get('/payment', login, (req, res) => {
    const SQL = 'SELECT id, nome FROM tipos_de_pagamentos'

    db.query(SQL, (err, result) => {
        if(err) console.log(err)
        res.render('user/payment', {valor :result})
    })
})

router.post('/payment', (req, res) => {
    const SQL = 'INSERT INTO lancamentos (descricao, valor, data) VALUES (?,?,?)'
    const descricao = req.body.descricao
    const data = req.body.data
    let valor = req.body.valor

    const erros = []
    const sucessos = []
   if(data.length < 8 || valor.length == 0){
        erros.push({message: 'Please fill the required fields!'})
        const LISTA = 'SELECT id, nome FROM tipos_de_pagamentos'

        db.query(LISTA, (err, refresh) => {
            if(err) console.log(err)
            res.render('user/payment', {valor :refresh, erro: erros})
        })
   }
   else{
    valor = valor.replace(',', '.')
    if(!parseInt(valor)){
        erros.push({message: 'Invalid value!'})
        const LISTA = 'SELECT id, nome FROM tipos_de_pagamentos'

        db.query(LISTA, (err, refresh) => {
            if(err) console.log(err)
            res.render('user/payment', {valor :refresh, erro: erros})
        })

    }
    
    db.query(SQL, [descricao, valor, data], (err, result) => {
        if(err) console.log(err)
        const LISTA = 'SELECT id, nome FROM tipos_de_pagamentos'
        sucessos.push({message: 'Payment registered successfully!'})
        db.query(LISTA, (err, result) => {
            if(err) console.log(err)
            res.render('user/payment', {valor :result, sucesso: sucessos})
        })
    })
   }

})
//PAYMENT

//PAYMENT REGISTER
router.get('/payment-register',login, (req, res, next) => {
    res.render('user/payment-register')
})

router.post('/payment-register', (req, res) => {
    const SQL = 'INSERT INTO tipos_de_pagamentos (nome) VALUES (?)'
    const erros = []
    const sucessos  = []
    if(req.body.nome.length < 3){
        erros.push({message: 'Payment name too short!'})
        res.render('user/payment-register', {erro: erros})
    }
    db.query(SQL, [req.body.nome], (err, result) => {
        sucessos.push({message:'Payment type registered successfully!'})
        res.render('user/payment-register', {sucesso: sucessos})
    })
})
//PAYMENT REGISTER

//LOGOUT
router.get('/logout', (req, res) => {
    const SQL = 'UPDATE cookies SET conteudo = "" WHERE conteudo = ?'
    db.query(SQL,[req.cookies.token], (err, result) => {
        if(err) throw err
        res.clearCookie('token')
        setTimeout(() => {
            res.redirect('/home/login')}, 1000)
    })
})
//LOGOUT

//FINANCIAL REPORT
router.get('/financial-report', login, (req, res, next) => {
    const SQL_ano = 'SELECT YEAR(data) as ano FROM lancamentos GROUP BY YEAR(data);'

    db.query(SQL_ano, (err, result) => {
        const SQL_descricao = 'SELECT nome FROM tipos_de_pagamentos;'

        db.query(SQL_descricao, (err,response) => {
            res.render('user/financial-report', {valor: result, pagamentos: response} )
        })
    })
})

router.post('/financial-report', login, (req, res) => {
    let SQL_relatorio = 'SELECT descricao, valor, concat(convert(DAY(data), char), "/", convert(MONTH(data), char), "/", convert(YEAR(data), char)) as data FROM lancamentos WHERE MONTH(data) = ? AND YEAR(data) = ? AND descricao = ?;'
    const year = req.body.ano
    const month = req.body.mes
    const describe = req.body.descricao

    const erros = []

        if(year == '00'|| month == '00'){
            const SQL_ano = 'SELECT YEAR(data) as ano FROM lancamentos GROUP BY YEAR(data);'

            db.query(SQL_ano, (err, result) => {
                const SQL_descricao = 'SELECT nome FROM tipos_de_pagamentos;'

                db.query(SQL_descricao, (err,response) => {
                    erros.push({message: 'Fill the year and month fields!'})
                    res.render('user/financial-report', {valor: result, pagamentos: response, erro: erros} )
                })
            })
        }

        else if(describe == '00'){
            SQL_relatorio = 'SELECT descricao, valor, concat(convert(DAY(data), char), "/", convert(MONTH(data), char), "/", convert(YEAR(data), char)) as data FROM lancamentos WHERE MONTH(data) = ? AND YEAR(data) = ?;'
            db.query(SQL_relatorio, [month, year, describe], (err, result) =>{
                const SQL_ano = 'SELECT YEAR(data) as ano FROM lancamentos GROUP BY YEAR(data);'

                createSheet(result)
                db.query(SQL_ano, (err, response) => {
                    const SQL_descricao = 'SELECT nome FROM tipos_de_pagamentos;'
    
                    db.query(SQL_descricao, (err, finish) => {
                        const SQL_total = 'SELECT format(sum(valor), 2) AS total FROM lancamentos WHERE MONTH(data) = ? AND YEAR(data) = ?;'
    
                        db.query(SQL_total, [month, year, describe], (err, soma) => {
                            res.render('user/financial-report', {dados: result, valor: response, resultado: soma,  pagamentos: finish} )
                        })
                    })
                })
            })

        }

        else{
            db.query(SQL_relatorio, [month, year, describe], (err, result) =>{
                const SQL_ano = 'SELECT YEAR(data) as ano FROM lancamentos GROUP BY YEAR(data);'
                
                createSheet(result)
                db.query(SQL_ano, (err, response) => {
                    const SQL_descricao = 'SELECT nome FROM tipos_de_pagamentos;'
    
                    db.query(SQL_descricao, (err,finish) => {
                        const SQL_total = 'SELECT format(sum(valor), 2) AS total FROM lancamentos WHERE MONTH(data) = ? AND YEAR(data) = ? AND descricao = ?;'
    
                        db.query(SQL_total, [month, year, describe], (err, soma) => {

                            res.render('user/financial-report', {dados: result, valor: response, resultado: soma,  pagamentos: finish} )
                        })
                    })
                })
                
            })

        }

})

router.get('/financial-report-download', login, (req, res) =>{
    res.download('relatorio-de-contas.xlsx')
})
//FINANCIAL REPORT
module.exports = router