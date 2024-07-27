const express = require('express');
const app = express();
const router = require('./router')
const MongoStore = require('connect-mongo')


app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/', router)

module.exports = app

