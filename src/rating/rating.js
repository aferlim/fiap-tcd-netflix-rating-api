const errorFactory = require('error-factory')

const Joi = require('@hapi/joi')
const ValidationSchema = require('./validation_schema')

const MomentBrazil = require('moment-timezone')

const Rating = require('./schema')

const { created, ok, badRequestWithMessage } = require('../response')

const RatingError = errorFactory('InvalidRating', [
	('message', 'details', 'annotate', '_object')
])

const validateRating = rating => {
	const { error, value } = Joi.validate(rating, ValidationSchema)

	if (error) {
		const { message, details, annotate } = error
		throw RatingError(message, details, annotate)
	}

	if (rating == null) throw RatingError('invalid request', '', '')

	return value
}

const Create = kafka => async (rating, res) => {
	try {
		let valid = validateRating(rating)

		let vote = new Rating({
			...rating,
			date: MomentBrazil.tz('America/Sao_Paulo').format()
		})

		var result = await vote.save()

		await kafka.send('rating-topic', { rating, correlation: result._id })

		console.log(valid)
		console.log(result)

		return created(res)
	} catch (error) {
		badRequestWithMessage(res, error)
	}
}

const GetAll = res => {
	return Rating.findAll({})
		.then(data => ok(res, data))
		.catch(err => badRequestWithMessage(res, err))
}

module.exports = { Create, GetAll }
