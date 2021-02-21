const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'AAQLEH',
        p_name: 'Home'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'AAQLEH',
        p_name: 'About'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'AAQLEH',
        p_name: 'Help'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address is required!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
                p_name: 'weather'

            })
        })
    })


})


app.get('/products', (req, res) => {
    if (!req.query.new) {
        return res.send({
            error: 'You must provide New data!'
        })
    }
    console.log(req.query.new)
    res.send({
        products: []
    })

})


app.get('/help/*', (req, res) => {
    res.render('Error', {
        title: 'Help artical not found.',
        name: 'AAQLEH',
        p_name: 'Error 404'
    })
})

app.get('*', (req, res) => {
    res.render('Error', {
        title: 'Page not found.',
        name: 'AAQLEH',
        p_name: 'Error 404'
    })
})

app.listen(port, () => {
    console.log('Server is up on port 3000.')
})