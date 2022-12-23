import { fastify } from 'fastify'
import { getEvents } from './getEvents.js'

const api = fastify()

async function startApi() {
	try {
		api.get('/', {}, async (request, reply) => {
			const events = await getEvents()
			reply.header("Access-Control-Allow-Origin", "*")
			reply.header("Access-Control-Allow-Methods", "GET")
			reply.header("Access-Control-Allow-Headers",  "*")
			reply.send(JSON.stringify(events))
		})

		await api.listen({host: '0.0.0.0', port: 8080})
		console.log('Server listening at port: 8080')
	} catch (e) {
		console.error(e)
	}
}

startApi()