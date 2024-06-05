const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
app.use(cors())
app.use(express.json());

var mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    port: 3306,
    database: "bicycle_track"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to bicycle_track!");
});


// app.get('/checkLogin/:id/:password', (req, res) => {
//     console.log(`user with userName ${req.params.id} and password ${req.params.password} is login! `)
//     res.status(200)
//     res.send();
// })



app.post('/checkLogin/', (req, res) => {
    console.log(req.body.email)
    console.log(req.body.password)

    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    con.query(query, [email, password], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Server error' });
            return;
        }

        if (results.length > 0) {
            const id= results[0].id;
            const username= results[0].user_name;
            res.status(200).send({ message: 'Login successful', user: {id, username, email, password}}); //לבדוק מה זה יוזר
        } else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    });
})

app.post('/checkRegister/', (req, res) => {
    console.log(req.body.username)
    console.log(req.body.email)
    console.log(req.body.password)
    const { username, email, password } = req.body;
    const query = 'SELECT * FROM users WHERE user_name = ? AND email = ? AND password = ?';
    con.query(query, [username, email, password], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Server error' });
            return;
        }

        if (results.length > 0) {
            res.status(401).send({ message: 'You already exist' });
        } else {
            const insertQuery = "INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)";
            con.query(insertQuery, [username, email, password], (err, results) => {
                if (err) {
                    res.status(500).send({ message: 'Server error' });
                    return;
                } else {
                    const id= results.insertId;
                    console.log(id);
                    res.status(200).send({ message: 'Registration successful', user: {id, username, email, password } });
                }
            });
        }
    });
});


app.post('/DataTrip/', (req, res) => {
    const { tripPurpose, startingPoint, destination, stopPoints, maxSlope, fitnessLevel, id_user, selectedTime } = req.body;
    console.log(req.body)
    var sql = "UPDATE users SET fitness_level = ?, max_slope = ? WHERE id = ?";
    con.query(sql,[fitnessLevel, maxSlope, id_user],  (err, result)=>  {
        if (err) {
            console.error(err);
            if (!res.headersSent) {
                res.status(500).send({ message: 'Server error' });
            }
            return;
        }
        if (!res.headersSent) {
            res.status(200).send({ message: 'Data updated successfully' });
            console.log('now we insert to routes tables!');
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
            const insertQuery = "INSERT INTO routes (user_id, start_point, destination_point, created_date, trip_purpose) VALUES (?, ?, ?, ?, ?)";
                    con.query(insertQuery, [id_user, startingPoint, destination, formattedDate ,tripPurpose], (err, results) => {
                        if (err) throw err;
                        if (err) {
                            res.status(500).send({ message: 'Server error' });
                            return;
                        } 
                        res.status(200).send({ message: 'Registration successful' });
                        console.log('insert routes tables!' + results);
                    });
       }
    });
   

    con.query("SELECT * FROM users", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    con.query("SELECT * FROM routes", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
    res.status(200)
    res.send();
})

app.listen(port, () => { console.log(`app listening to port ${port}`) })