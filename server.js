const express = require('express');
const bodyParser = require ('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors =require('cors');
const knex = require('knex');
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const Clarifai = require('clarifai');

const password="cookies";
const hash = bcrypt.hashSync(password);
console.log(hash);
console.log(new Date());

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true,
    }
  });


const app = express();
app.use(bodyParser.json());
app.use(cors());

const myApp = new Clarifai.App({
  apiKey: "2ef8c1c346274880af7ba244b20c4ee9",
});

app.get('/', (req, res) =>{res.json('It is working')})

app.post('/login', (req, res) => {
  // login.handleLogin(req, res, db , bcrypt)
  const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json('Cannot Login with Empty Fields');
     }
    db.select('email','hash').from('login')
    .where('email', '=' , email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
           return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('Unable to Find User'));
        } else{
            res.status(400).json('Wrong Credentials');
        }
    })
    .catch(err => res.status(400).json('Wrong Credentials'))
  }
  
  )

app.post('/signup', (req, res) => {
  // signup.handleSignUp(req, res, db , bcrypt)
  const {email, password, name} =req.body;
    if(!email || !name || !password){
       return res.status(400).json('Cannot Sign Up with Empty Fields');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email : email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
        return  trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user =>{
            res.json(user[0]);
        })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err =>  res.status(400).json('Unable to Sign Up'));
  }
  )


app.get('/profile/:id', (req, res) => {
  // profile.handleProfile(req, res, db )
  const {id} = req.params;
        db.select().from('users').where({id})
        .then(user => {
            if(user.length === 0){
                res.status(400).json('User Not Found')
            } else{
                res.json(user[0]);
            }
        })
        .catch(err => res.status(400).json('Error Getting User'))
})


app.put('/image', (req,res) => {
  // image.handleImage(req, res, db)
  const {id} = req.body;
    db('users').where('id', '=', id )
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get Entries'))
})

app.post('/imageurl', (req,res) => {
  // image.handleApiCall(req, res)
  
    myApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
  }
)

app.listen(process.env.PORT || 3001, () => {
    console.log( `App is running on 3001 ${process.env.PORT}`);
})
