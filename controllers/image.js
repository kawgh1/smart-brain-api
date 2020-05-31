// IMAGE

// npm install clarifai
const Clarifai = require('clarifai');

// Clarifai app and API key
const app = new Clarifai.App({
  apiKey: '8e15ce38c47448ae986da3ecefedce3c'
});

const handleAPICall = (req, res) => {
	// taken from front end
	app.models.predict(Clarifai.FACE_DETECT_MODEL, 
      	req.body.input)
	.then(data => {
		res.json(data);
	})
	.catch(error => res.status(400).json('unable to fetch API'));

}


const handleImage = (req, res, db) => {
	const { id } = req.body;
	// let found = false;
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		user.entries++
	// 		return res.json(user.entries);
	// 	} 
	// })
	// if (!found) {
	// 	res.status(400).json('no such user.')
	// }
	if (id){
		db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			//console.log(entries);
			res.json(entries[0]);
		})
		.catch(error => res.status(400).json('error getting entries.'))

	} 
	
}

module.exports = {
	handleImage: handleImage,
	handleAPICall: handleAPICall

}