// npm install express
const express = require('express');
// npm install body-parser
const bodyParser = require('body-parser');
// npm install bcrypt-nodejs DEPRECATED
const bcrypt = require('bcrypt-nodejs');
// npm install cors
const cors = require('cors');
const knex = require('knex');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// this is being used because we don't have real hosting
// this next line should NEVER be used in production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Database Initialization
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true}
});

// localhost
// const db = knex({
// 	client: 'pg',
// 	connection: {
// 		// localhost
// 		host: '127.0.0.1',
// 		user: 'postgres',
// 		password: 'password',
// 		database: 'smartbrain'

// });

// console.log(db.select('*').from('users'));
db.select('*').from('users').then(data => {
	console.log(data);
})




const app = express();
app.use(bodyParser.json());
app.use(cors());

// const database = {
// 	users: [
// 		{
// 			id: '123',
// 			name: 'John',
// 			email: 'john@gmail.com',
// 			password: 'cookies',
// 			entries: 0,
// 			joined: new Date()
// 		},
// 		{
// 			id: '124',
// 			name: 'Sally',
// 			email: 'sally@gmail.com',
// 			password: 'bananas',
// 			entries: 0,
// 			joined: new Date()
// 		}
// 	]
// }

// used on old local file const array database above
// app.get('/', (req, res) => {
// 	res.send(database.users);
// })
app.get('/', (req, res) => {res.send('it is working!')});

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}.`);
})

// SIGN IN
// dependencies injection
// since signin.js does not have direct access to db and bcrypt, those
// instances must be passed to the function when it is called here
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)});

// REGISTER
// app.post('/register', register.handleRegister)
// dependencies injection
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});


// PROFILE
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
// app.get('/profile/:id', (req, res) => {
// 	const { id } = req.params;
// 	let found = false;
// 	// database.users.forEach(user => {
// 	// 	if (user.id === id) {
// 	// 		found = true;
// 	// 		return res.json(user);
// 	// 	} 
// 	// })
// 	db.select('*').from('users').where({id: id})
// 	.then(user =>  {
// 		// if user exists in db
// 		if (user.length) {
// 			//console.log(user[0]);
// 			res.json(user[0]);
// 		} else {
// 			res.status(400).json('user not found.')
// 		}

// 	})
// 	.catch(err => res.status(400).json('error getting user.'))
// 	// if (!found) {
// 	// 	res.status(400).json('no such user.')
// 	// }
// })

// IMAGE
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleAPICall(req, res)});

// BCRYPT FUNCTIONS
// bcrypt.hash("bacon", null, null, function(err, hash) {
// 	// Store hash in your password DB.
// });

// // Load hash from your password DB
// bcrypt.compare("bacon", hash, function(err, hash) {
// 	// res == true
// });

// bcrypt.compare("veggies", hash, function(err, hash) {
// 	// Store hash in your password DB.
// });



/*

PROJECT ENDPOINTS
--> res = this is working
/signin  --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> update user object



*/