const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
	user: {
		type: String,
		required: true
	},
	movieId: {
		type: Number,
		required: true
	},

	rate: {
		type: Number,
		trim: true,
		lowercase: true
	},

	date: { type: Date }
})

module.exports = mongoose.model('rating', ratingSchema, 'rating')
