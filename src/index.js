import { writeFileSync } from 'fs'
import { resolve, join } from 'path'
import { getEvents } from './getEvents.js'

async function saveEvents() {
	try {
		const events = await getEvents()
		const eventsJSON = JSON.stringify(events)
		
		// define __dirname to be the current directory and write events.json
		const __dirname = resolve()
		writeFileSync(join(__dirname, 'data', 'events.json'), eventsJSON)

	} catch (e) {
		console.error(e)
	}
}

saveEvents()