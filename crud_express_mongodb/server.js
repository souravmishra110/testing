const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const PORT = 3000
const connectionString = 'mongodb+srv://souravmishra110:souravmishra110123123@cluster0.yhohf.mongodb.net/star-wars-quotes?retryWrites=true&w=majority';

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json())

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.use(bodyParser.urlencoded({ extended: true }))

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(err => console.log(err))
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.log(error))
        })

        app.put('/quotes', (req, res) => {
            // console.log(req.body)
            quotesCollection.findOneAndUpdate(
                {
                    name: 'Yoda'
                },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                res.json('success')
            })
            .catch(err => console.log(err))
        })
            

        app.listen(PORT, () => {
            console.log(`Listening on PORT: ${PORT}`)
        })
    })
    .catch(error => {
        console.log(error)
    })

