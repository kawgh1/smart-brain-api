// PROFILE
const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	let found = false;
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		return res.json(user);
	// 	} 
	// })
	db.select('*').from('users').where({id: id})
	.then(user =>  {
		// if user exists in db
		if (user.length) {
			//console.log(user[0]);
			res.json(user[0]);
		} else {
			res.status(400).json('user not found.')
		}

	})
	.catch(err => res.status(400).json('error getting user.'))
	// if (!found) {
	// 	res.status(400).json('no such user.')
	// }
}

module.exports = {
	handleProfileGet: handleProfileGet
}