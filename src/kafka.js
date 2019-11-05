module.exports = producer => ({
	send: (topic, message) => {
		producer
			.init()
			.then(function() {
				return producer.send({
					topic: topic,
					partition: 0,
					message: JSON.stringify(message)
				})
			})
			.then(function(result) {
				console.log(result)
			})
	}
})
