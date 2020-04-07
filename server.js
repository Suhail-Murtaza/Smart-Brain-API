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
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
  });


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) =>{res.json('It is working')})

app.post('/login', (req, res) => {login.handleLogin(req, res, db , bcrypt)})

app.post('/signup', (req, res) => {signup.handleSignUp(req, res, db , bcrypt)})


app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db )})


app.put('/image', (req,res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req,res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, () => {
    console.log( `App is running on 3001 ${process.env.PORT}`);
})
