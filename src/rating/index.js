const Joi = require('@hapi/joi')

const { Create, GetAll } = require('./rating')

const Rating = (server, kafka) => {
	server.route({
		method: 'POST',
		path: '/rating',
		handler: async (req, res) => {
			return await Create(kafka)(req.payload, res)
		},
		options: {
			description: 'Making a Rate',
			notes: ['201', '500'],
			tags: ['api', 'rating', 'vote'],
			validate: {
				payload: {
					user: Joi.string()
						.required()
						.description('the user for the rate'),
					movieId: Joi.number()
						.required()
						.description('the movie for the rate'),
					rate: Joi.number()
						.min(1)
						.max(5)
						.required()
						.description('the rate number 1 to 5')
				}
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/rating',
		handler: (req, res) => GetAll(res),
		options: {
			description: 'Gets the all rates',
			notes: 'Returns a rate item by the user',
			tags: ['api']
		}
	})
}

module.exports = Rating
