const express = require('express')
const app = express()
const pug = require('pug')
const db = require('./models/db')
const cookieParser = require('cookie-parser')

// Config
    // Setting the public files (CSS, images and JavaScripts)
        app.use(express.static('public'))
    // Cookie-parser
        app.use(cookieParser())
    // Parse URL-encoded bodies (as sent by HTML forms)
        app.use(express.urlencoded())
    // Template Engine
        app.set('views', './views')
        app.set('view engine', 'pug')
// Rotas
    app.get('/', (req, res) => {
        if(req.cookies.session == undefined){
            res.redirect('login')
        } else {
            console.log(req.cookies.session)
            if(db.Logins.findOne({where: {id: req.cookies.session}})){
                db.Posts.findAll({order: [['id', 'DESC']]}).then((posts) => {
                    console.log('POSTS: ' + posts)
                    
                    db.Logins.findOne({where: {
                        id: req.cookies.session
                    }}).then(user => {res.render('index', {posts, user, sessionID: req.cookies.session})})
                })
            } else {
                res.render('login')
            }
        }
    })

    app.get('/cadastro', (req, res) => {
        res.render('cadastro')
    })

    app.get('/login', (req, res) => {
        res.render('login')
    })

    app.post('/connect', (req, res) => {
        db.Logins.findOne({where: {
            email: req.body.email,
            password: req.body.password
        }}).then(user => {
            if(user != null) {
                let id
                res.clearCookie('session')
                db.Logins.findOne({where: {email: req.body.email}}).then(user => {
                    console.log(user.id)
                    id = user.id
                    res.cookie('session', id)
                    console.log('Cookie created: ' + id)
                    res.redirect('/')
                })
                
            } else {
                res.render('login')
            }
        })

        
    })

    app.post('/createAccount', (req, res) => {
        let exists
        db.Logins.findOne({where: {email: req.body.email}}).then(x => {
            console.log('VARIABLE--> ', x)
            if(x === null){
                exists = false
                console.log('EXISTS === FALSE')
                res.render('sucesso')
            } else {
                exists = true
                console.log('EXISTS === TRUE')
                res.render('cadastro-falha')
            }
        })
        
        console.log(exists)
        
        db.Logins.findOrCreate({
            where: {
                email: req.body.email
            },
            defaults: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        })

        
    })

    app.get('/deleteLogin', (req, res) => {
        res.render('deleteAccount')
    })

    app.post('/deleteLoginConfirm', (req, res) => {
        db.Logins.findOne({where:{
            id: req.cookies.session
        }}).then(user => {
            if(user.password === req.body.password){
                db.Logins.destroy({where: {
                    id: req.cookies.session
                }})
                res.render('sucesso')
            } else {
                res.render('deleteAccount')
            }
        })
    })

    // Post routes
    app.get('/post', (req, res) => {
        res.render('newpost')
    })

    app.post('/add', (req, res) => {
        let sessionID = req.cookies.session
        let sessionName
        let sessionMail
        db.Logins.findOne({
            where: {
                id: sessionID
            }
        }).then(user => {
            sessionName = user.name
            sessionMail = user.email
            db.Posts.create({
                name: sessionName,
                contentText: req.body.content,
                email: sessionMail,
                creatorID: sessionID
            })
            res.redirect('/')
        })
    })

    app.get('/deletePost/:id', (req, res) => {
        db.Posts.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.redirect('/')
        }).catch(err => {
            res.send('Ocorreu um erro' + err)
        })
    })


app.listen(process.env.PORT || 3000, console.log('The server is running! (Nexum) '))

//dependences

/*

express
pug
nodemon -development dependence
mysql ---DESINSTALADO---
sequelize
mysql2 (requerido na referencia da API do sequelize)
cookie-parser

*/