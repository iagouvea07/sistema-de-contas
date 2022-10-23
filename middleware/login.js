const jwt = require('jsonwebtoken')
const db = require('../db/db.js')


module.exports = (req, res, next) => {

    try{
            const auth = req.cookies.token
            const decode = jwt.verify(auth, 'S@T690as5!w186Y%$', (error, res) => {
            if(error) {
                res.clearCookie('token')
                res.redirect('/home/401')
            }
            const SQL = 'SELECT conteudo FROM cookies where conteudo = ?'
            db.query(SQL, [auth], (err, result) => {
                if(err) {
                    res.clearCookie('token')
                    res.redirect('/home/401')
                }

                if(result[0].conteudo === auth){
                    next()
                }

            })
        })
            
            if(!auth){
                console.log('erro ao se autenticar')
                res.clearCookie('token')
                res.redirect('/home/401')
            }

    }

    catch(error){
        res.clearCookie('token')
        res.redirect('/home/401')
    }
}   



