const express = require('express')
const app = express()
const pug = require('pug')
const db = require('./models/db')
const cookieParser = require('cookie-parser')

// Testing scripts
db.Logins.findAll().then(logins => {console.log(logins)})
db.Posts.findAll().then(posts => {console.log(posts)})


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
            userName: req.body.userName,
            password: req.body.password
        }}).then(user => {
            if(user != null) {
                let id
                res.clearCookie('session')
                db.Logins.findOne({where: {userName: req.body.userName}}).then(user => {
                    console.log(user.id)
                    id = user.id
                    res.cookie('session', id)
                    console.log('Cookie created: ' + id)
                    res.redirect('/')
                })
                
            } else {
                res.redirect('login')
            }
        }).catch(err => {console.log('ERROR: ', err)})

        
    })

    app.post('/createAccount', (req, res) => {
        let exists
        db.Logins.findOne({where: {userName: req.body.userName}}).then(x => {
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
                userName: req.body.userName
            },
            defaults: {
                name: req.body.name,
                userName: req.body.userName,
                password: req.body.password
            }
        })

        
    })

    app.get('/deleteLogin', (req, res) => {
        if(req.cookies.session == undefined){res.redirect('login')}
        res.render('deleteAccount')
    })

    app.post('/deleteLoginConfirm', (req, res) => {
        db.Logins.findOne({where:{
            id: req.cookies.session
        }}).then(user => {
            if(user.password === req.body.password){
                db.Posts.destroy({where: {
                    creatorID: req.cookies.session
                }})
                db.Logins.destroy({where: {
                    id: req.cookies.session
                }})
                res.clearCookie('session')
                res.render('sucesso')
            } else {
                res.redirect('deleteAccount')
            }
        })
    })

    // Post routes
    app.get('/post', (req, res) => {
        if(req.cookies.session == undefined){res.redirect('login')}
        //db.Logins.findAll().then(x => console.log(x)) isso exibe as senhas no console (FUNCIONALIDADE DE DESENVOLVIMENTO)
        res.render('newpost')
    })

    app.post('/add', (req, res) => {
        let sessionID = req.cookies.session
        let sessionName
        let sessionUsername
        db.Logins.findOne({
            where: {
                id: sessionID
            }
        }).then(user => {
            sessionName = user.name
            sessionUsername = user.userName
            db.Posts.create({
                name: sessionName,
                contentText: req.body.content,
                userName: sessionUsername,
                creatorID: sessionID
            })
            res.redirect('/')
        })
    })

    app.get('/deletePost/:id', (req, res) => {
        db.Posts.findOne({where:{id: req.params.id}}).then((post) => {if(post.creatorID == req.cookies.session){
            db.Posts.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.redirect('/')
            }).catch(err => {
                res.send('Ocorreu um erro' + err)
            })
        } else {
            res.redirect('/')
        }})
    })

    app.get('/changePassword', (req, res) => {
        res.render('changePassword')
    })

    app.post('/changePasswordIdentityCheck', (req, res) => {
        db.Logins.findOne({where: {
            id: req.cookies.session,
        }}).then(user => {
            console.log('USER= ', user)
            console.log('BODY= ', req.body)
            console.log('CURRENT PASSWORD= ', user.password)
            if(user.password == req.body.password){
                db.Logins.update({password: req.body.newPassword}, {
                    where: {id: req.cookies.session}
                }).then(() => {
                    res.render('sucesso')
                })
            } else {
                res.render('changePassword', {erro: 'Senha incorreta'})
            }
        }).catch((err) => {
            console.log('Ocorreu um erro! ', err)
        })
    })

    // Profiles
    let profileToAcess
    app.get('/accessProfile/:id', (req, res) => {
        db.Logins.findOne({where: {
            id: req.params.id
        }}).then(user => {
            console.log(user)
            db.Posts.findAll({
                where: {
                    creatorID: user.id
                },
                order: [['id', 'DESC']]
            }).then(posts => {
                profileToAcess = {user, posts, sessionID: req.cookies.session}
                res.redirect('/profile')
            }).catch((err) => {
                console.log('=================ERROR: ' + err)
            })
        })
    })

    app.get('/profile', (req, res) => {
        res.render('profile', profileToAcess)
    })



    //Funções da página de perfil


    app.get('/bio', (req, res) => {
        res.render('bio')
    })

    app.post('/editBio', (req, res) => {
        db.Logins.update({bio: req.body.bio}, {
            where: {id: req.cookies.session}
        }).then(() => {
            profileToAcess.user.bio = req.body.bio
            res.redirect('/profile')
        })
    })


    app.get('/editName', (req, res) => {
        res.render('nome')
    })

    app.post('/changeName', (req, res) => {
        db.Logins.update({name: req.body.name}, {
            where: {id: req.cookies.session}
        }).then(() => {
            db.Posts.update({name: req.body.name}, {
                where: {creatorID: req.cookies.session}
            }).then(() => {
                profileToAcess.user.name = req.body.name
                res.redirect('/profile')
            })
        })
    })


    app.get('/addMail', (req, res) => {
        res.render('email')
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