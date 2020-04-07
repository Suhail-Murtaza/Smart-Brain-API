const express = require('express');
const bodyParser = require ('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors =require('cors');
const knex = require('knex');
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'donotworry1',
      database : 'smart-brain'
    }
  });


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) =>{res.json(database.users)})

app.post('/login', (req, res) => {login.handleLogin(req, res, db , bcrypt)})

app.post('/signup', (req, res) => {signup.handleSignUp(req, res, db , bcrypt)})


app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db )})


app.put('/image', (req,res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req,res) => {image.handleApiCall(req, res)})

app.listen(3001, () => {
    console.log('App is running on 3001');
})
