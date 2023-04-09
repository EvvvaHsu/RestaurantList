// require packages used in the project
const express = require('express')

const mongoose = require('mongoose')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Res = require('./models/resModel')   //載入model

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = express()

//mongoose & mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})





const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))




// routes setting
app.get('/', (req, res) => {

    //拿到所有的餐廳資料
    Res.find()
    .lean()
    .then( restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error)) 
})

app.get('/restaurants/new', (req, res) => {
    return res.render('new')
})


app.post('/restaurants', (req, res) => {
    const name = req.body.name
    const name_en = req.body.name_en
    const category = req.body.category
    const phone = req.body.phone
    const location = req.body.location
    const rating = req.body.rating
    const image = req.body.image
    const google_map = req.body.google_map
    const description = req.body.description

    const restaurant = new Res({ name, name_en, category, phone, location, rating, image, google_map, description })
    return restaurant.save()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.get('/restaurants/:id', (req, res) => {

    const id = req.params.id
    return Res.findById(id)
    .lean()
    .then(restaurant => res.render('show', {restaurant}))
    .catch(error => console.log(error))
    
})

app.get('/restaurants/:id/edit', (req, res) => {

    const id = req.params.id
    return Res.findById(id)
    .lean()
    .then(restaurant => res.render('edit', {restaurant}))
    .catch(error => console.log(error))
    
})

app.post('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id

    const name = req.body.name
    const name_en = req.body.name_en
    const category = req.body.category
    const phone = req.body.phone
    const location = req.body.location
    const rating = req.body.rating
    const image = req.body.image
    const google_map = req.body.google_map
    const description = req.body.description

     return Res.findById(id)
        .then( restaurant => { 
            restaurant.name = name,
            restaurant.name_en = name_en,
            restaurant.category = category,
            restaurant.image = image,
            restaurant.rating = rating,
            restaurant.location = location,
            restaurant.phone = phone,
            restaurant.google_map = google_map,
            restaurant.description = description

            return restaurant.save()
        })
        .then(() => res.redirect(`/restaurants/${id}`))
        .catch(error => console.log(error))
})

app.post('/restaurants/:id/delete', (req, res) => {
    const id = req.params.id

    return Res.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.get('/search', (req, res) => {
    //console.log(req)
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render('index', { restaurants: restaurants, keyword: keyword })
})


// start and listen on the Express server
app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})