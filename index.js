require('dotenv').config()
// express
const express = require('express');
const cookieParser = require('cookie-parser')
const expressLayouts = require('express-ejs-layouts')
const fileupload = require('express-fileupload')
const app = express()
const http = require('http')
const server = http.createServer(app)
const session = require('express-session')
const routes = require('./src/Utility/Routes')

// set view engine
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload())
app.use(express.static('public'))
app.use(cookieParser())
app.set('views', 'public/views')
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

// routes
app.use(routes);
app.use((req, res) => {
	res.status(404)
	res.render('404', { user: req.session.user })
})
app.use((req, res) => {
	res.status(403)
	res.render('403', { user: req.session.user })
})

server.listen(PORT, () => console.log(`Running server on port ${PORT}`))