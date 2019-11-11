const ok = (res, data) => {
	return res.response(data).code(200)
}

const noContent = res => {
	return res.response().code(204)
}

const notFound = res => {
	return res.response().code(404)
}

const badRequest = res => {
	return res.response().code(400)
}

const badRequestWithMessage = (res, message) => {
	return res.response(message).code(400)
}

const created = res => {
	return res.response().code(201)
}

const conflict = res => {
	return res.response().code(409)
}

const success = res => res.response().code(200)

module.exports = {
	ok,
	noContent,
	notFound,
	badRequest,
	badRequestWithMessage,
	created,
	conflict,
	success
}
