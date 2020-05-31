// REGISTER
const handleRegister = (req, res, db, bcrypt) => {
	// when a new user registers we want to push on to the users database their info
	// const id = (Number(database.users[database.users.length-1].id) + 1)
	const {email, name, password} = req.body;
	if (!email || !name || !password) {
		return res.status(400).jscon('incorrect form submission');
	}
	// bcrypt.hash(password, null, null, function(err, hash) {
	// // Store hash in your password DB.
	// console.log(hash);
	const hash = bcrypt.hashSync(password);

	// trx is if you want multiple DB actions on one user action
		// we want to store their hash in the login table
		// when they register 
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email,
				datetime: new Date()
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				// have to return here so the first db instance is aware of this code
				return db('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name: name,
						entries: 0,
						joined: new Date()
					})
					.then(user => {
						console.log(user)
						res.json(user[0]);
					})


			})
			.then(trx.commit)
			.catch(trx.rollback)
		})	
	
	// database array for early dev
	// database.users.push({
		
	// 		id: id,
	// 		name: name,
	// 		email: email,
	// 		password: password,
	// 		entries: 0,
	// 		joined: new Date()
	// })

	// we don't want to give users any info about our DB
	// so if there's an internal error, just feed them a 400 error
	// and little detail, unable to register
	.catch(err => res.status(400).json('unable to register'));

	// old	res.json(database.users[database.users.length-1]);



}

module.exports = {
	handleRegister: handleRegister
};