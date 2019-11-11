const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
var Kafka = require('no-kafka')

const chalk = require('./chalk')
const connect = require('./mongoClient')
const {
	PORT,
	MONGO_CONNECTION_STRING,
	KAFKA_CONNECTION_STRING
} = require('./config')

const Home = require('./home')
const Rating = require('./rating')

const server = Hapi.server({
	port: PORT,
	host: process.env.HOST || '0.0.0.0'
})

const KafkaProducer = new Kafka.Producer({
	connectionString: KAFKA_CONNECTION_STRING
})

const kafka = require('./kafka')(KafkaProducer)

const Start = async srv => {
	const swaggerOptions = {
		info: {
			title: 'Rate Movies API Documentation',
			version: '1'
		}
	}

	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: swaggerOptions
		}
	])

	await srv.start()

	chalk.info(`Server running on ${srv.info.uri}`)
}

process.on('unhandledRejection', err => {
	chalk.error(err)
	process.exit(1)
})

const startupError = err => {
	chalk.error('🚨 Error bootstrapping app!', err)
}

connect(
	MONGO_CONNECTION_STRING,
	chalk
)
	.then(() => {
		Start(server)

		Rating(server, kafka)

		Home(server)
	})
	.catch(startupError)
