const express = require("express");
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
      secret: 'secret', //a screte key used to encrypt the session cookie
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 1000000 *60 * 60 * 24
      }//set the session cookie properties
}))


const db =mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"rootPassword123",
    database: "signup"
})
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      process.exit(1); // Exit the application if there's an error connecting to the database
    }
    console.log('Connected to the database!');
  });

 

  app.get('/login',(req, res) =>{
    if(req.session.name){
      return res.json({valid: true, name: req.session.name})
    } else {
      return res.json({valid: false})
    }
  })


  app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const query = 'INSERT INTO login (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (error, results) => {
      if (error) {
        console.error('Error creating a new data: ' + error.stack);
        res.status(500).json({ error: 'Failed to create a new todo' });
        return;
      }
      res.status(201).json({ id: results.insertId });
    });
  });

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM  login WHERE `email`= ? AND `password`=?";
    db.query(query, [ email, password], (error, results) => {
      if (error) {
       return res.json("Error");
      }
      if(results.length > 0){
        req.session.name = results[0].name;
        return res.json({Login: true, userId: results[0].id , name: results[0].name});
      }else {
        return res.json({Login: false});
      }
    });
  });


  app.get('/todo', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM todos WHERE userid=?';
    const params= [userId]
    db.query(query, params, (error, results) => {
      if (error) {
        console.error('Error retrieving todos: ' + error.stack);
        res.status(500).json({ error: 'Failed to retrieve todos' });
        return;
      }
      res.status(200).json(results);
    });
  });
  

  function formatDate(dateTime) {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }



    app.post('/todo', (req, res) => {
      const { title, completed, dateTime, userId } = req.body;
      const fDateTime = formatDate(dateTime);
      const query = 'INSERT INTO todos (title, completed, dateTime, userid ) VALUES (?, ?, DATE_FORMAT(?, "%Y-%m-%d %H:%i:%s"),?)';
      db.query(query, [title, completed ? 1 : 0, fDateTime, userId], (error, results) => {
        if (error) {
          console.error('Error creating a new todo: ' + error.stack);
          res.status(500).json({ error: 'Failed to create a new todo' });
          return;
        }
        res.status(201).json({ id: results.insertId });
      });
    });

  app.put('/todo/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const query = 'UPDATE todos SET title = ?, completed = ? WHERE id = ?';
    const params = [title, completed ? 1 : 0, id]
    db.query(query,params , (error, results) => {
      if (error) {
        console.error('Error updating the todo: ' + error);
        res.status(500).json({ error: 'Failed to update the todo' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      res.sendStatus(200);
    });
  });

  app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error deleting the todo: ' + error.stack);
        res.status(500).json({ error: 'Failed to delete the todo' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      res.sendStatus(200);
    });
  });
  
  

app.listen(8081, ()=> {
    console.log("listening");
})