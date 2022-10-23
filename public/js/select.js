//const db = require('../../db/db.js')

const fs = require('fs')
const { json } = require('body-parser')

const resultado = []


    class Consulta {
        constructor(){

        const SQL_ano = 'SELECT YEAR(data) as ano FROM lancamentos GROUP BY YEAR(data);'

        db.query(SQL_ano, (err, response) => {
            const SQL_descricao = 'SELECT nome FROM tipos_de_pagamentos;'
            
            
            
            db.query(SQL_descricao, (err,finish) => {
                const SQL_total = 'SELECT format(sum(valor), 2) AS total FROM lancamentos WHERE MONTH(data) = ? AND YEAR(data) = ? AND descricao = ?;'
                
                
                db.query(SQL_total, [this.month, this.year, this.describe], (err, soma) => {
                    //console.log({dados: retorno, valor: response, resultado: soma,  pagamentos: finish} )
                    
                    //res.render('user/financial-report', {dados: retorno, valor: response, resultado: soma,  pagamentos: finish} )
                    this.dados += response
                    this.valor = finish[0]
                    this.resultado = soma[0]



                    console.log(response, finish, soma)
                })
            })
        })
    }
}


const a = new Consulta()

console.log(a.dados)



