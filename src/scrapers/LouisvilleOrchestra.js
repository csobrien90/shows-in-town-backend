import {unEscapeWordPressHTML} from '../utilities.js'

export async function scrapeLouisvilleOrchestra() {
	// Get events from exposed WordPress REST API endpoint
	const response = await fetch('https://louisvilleorchestra.org/wp-json/tribe/events/v1/events').then(res => res.json())
	const rawEvents = response.events

	// Iterate over elements and populate events array
	let events = [];
	rawEvents.forEach(event => {
		try {
			const {title, description, url, start_date, venue} = event
	
			// Prepare times
			const epoch = Date.parse(start_date)
			const dateStringOptions = {month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true}
			const startTime = new Date(start_date).toLocaleDateString('en-US', dateStringOptions)

			// Prepare venue
			const address = `${venue.address}, ${venue.city}, ${venue.state ? venue.state : 'KY'} ${venue.zip}`
	
			// Tidy up data
			let tidyTitle
			let tidyDescription
			let tidyVenue
			let tidyAddress
			try {
				tidyTitle = unEscapeWordPressHTML(title)
				tidyDescription = unEscapeWordPressHTML(description)
				tidyVenue = unEscapeWordPressHTML(venue.venue)
				tidyAddress = unEscapeWordPressHTML(address)
			} catch (e) {
				return
			}

			// Push to events array
			events.push({
				title: tidyTitle,
				venue: tidyVenue.venue,
				address: tidyAddress,
				time: startTime,
				desc: tidyDescription,
				link: url,
				epoch
			});
		} catch (e) {
			console.error(e)
		}
	})

	return events

}

// console.log(await scrapeLouisvilleOrchestra())