const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
app.use(cors())
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('hello!')
})



// app.get('/checkLogin/:id/:password', (req, res) => {
//     console.log(`user with userName ${req.params.id} and password ${req.params.password} is login! `)
//     res.status(200)
//     res.send();
// })



app.post('/checkLogin/', (req, res) => {
    console.log(req.body.email)
    console.log(req.body.password)

    // console.log(`user with userName ${req.query.id} and password ${req.params.password} is login! `)
    res.status(200)
    res.send();
})

app.post('/checkRegister/', (req, res) => {
    console.log(req.body.username)
    console.log(req.body.email)
    console.log(req.body.password)
    res.status(200)
    res.send();
})

app.post('/DataTrip/', (req, res) => {
    console.log(req.body.tripPurpose)
    console.log(req.body.startingPoint)
    console.log(req.body.destination)
    console.log(req.body.stopPoints)
    console.log(req.body.maxSlope)
    console.log(req.body.healthHighlights)
    res.status(200)
    res.send();
})

app.listen(port, () => { console.log(`app listening to port ${port}`) })