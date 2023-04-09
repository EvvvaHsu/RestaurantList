const mongoose = require('mongoose')

const Res = require('../resModel')
const resList = require('../../restaurant.json')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
    Res.create(resList.results)
    console.log('done')
})

