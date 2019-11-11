const mongoose = require('mongoose')

// const { MongoClient } = require('mongodb')

const mongoOpts = {
	useNewUrlParser: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 5000,
	loggerLevel: 'info',
	autoReconnect: true,
	useUnifiedTopology: true
}

const connectWihMongoose = async (MONGO_CONNECTION_STRING, console) => {
	mongoose.Promise = global.Promise
	mongoose.set('useCreateIndex', true)

	mongoose.connection.on('connected', () => {
		console.info(`🎉 mongoose connected on: ${MONGO_CONNECTION_STRING}`)
	})

	mongoose.connection.on('error', function(err) {
		console.error('🚨 Mongoose default connection error: ' + err)
	})

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function() {
		console.info('💥 Mongoose default connection disconnected')
	})

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			console.error(
				'💥 Mongoose default connection disconnected through app termination 💥'
			)
			process.exit(0)
		})
	})

	if (!mongoose.connection.readyState) {
		return mongoose.connect(MONGO_CONNECTION_STRING, mongoOpts)
	} else {
		return Promise.resolve()
	}
}

// const connectToMongo = async () => MongoClient.connect(
//     process.env.MONGO_CONNECTION_STRING, mongoOpts)
//     .then(client => {
//         console.info('🎉 Successfully connected to Mongo!')
//         const db = client.db()
//         return db
//     })

// const makeDeps = ([mongodb, mongooseConn]) => ({ mongodb, mongooseConn });

// const connect = () => Promise.all([connectToMongo(), connectWihMongose()]);

module.exports = (MONGO_CONNECTION_STRING, cls) =>
	connectWihMongoose(MONGO_CONNECTION_STRING, cls)
