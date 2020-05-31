// SIGN IN
const handleSignIn = (req, res, db, bcrypt) => {
	// 2 inputs, email and password have to be sent thru req.body to the server
	// check if user exists and if password hash matches what was entered
	// Load hash from your password DB
	// bcrypt.compare("bacon", hash, function(err, hash) {
	// 	// res == true
	// });

	// bcrypt.compare("veggies", hash, function(err, hash) {
	// 	// Store hash in your password DB.
	// });

	// if (req.body.email === database.users[0].email && 
	// 	req.body.password === database.users[0].password) {
	// 	res.json(database.users[0]);
	// } else {
	// 	res.status(400).json('error logging in');
	// }

	if (!req.body.email || !req.body.password) {
		return res.status(400).json('incorrect form submission');
	}

	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
						&& req.body.email !== ''
						&& req.body.password !== '';
		// console.log(isValid);
		if (isValid) {
			// have to return here so the first db instance is aware of this code
			return db.select('*').from('users')
						.where('email', '=', req.body.email)
						.then(user => {
							// console.log(user);
							res.json(user[0])
						})
						.catch(error => res.status(400).json('unable to retrieve user.'))

		} else {
			res.status(400).json('invalid credentials.')
		}
	})
	.catch(error => res.status(400).json('invalid credentials.'))
}

module.exports = {
	handleSignIn: handleSignIn
};