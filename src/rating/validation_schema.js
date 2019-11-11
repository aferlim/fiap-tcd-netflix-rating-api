const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
	user: Joi.string().required(),
	movieId: Joi.number().required(),
	rate: Joi.number()
		.min(1)
		.max(5)
		.required(),
	date: Joi.date()
})
