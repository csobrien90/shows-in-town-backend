export async function scrapeKFCYumCenter() {
	// Get eventData from Ticketmaster API
	const apiKey = '7elxdku9GGG5k8j0Xm8KWdANDgecHMV0' // a public key provided with Ticketmaster's Discovery API
	const ticketmasterApiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&classificationName=Music&city=Louisville&venueId=KovZpaFnje`
	const eventData = await fetch(ticketmasterApiUrl).then(res => res.json())

	// Iterate over elements and populate events array
	let events = [];
	for (let e of eventData._embedded.events) {
		try {
			// Destructure event data
			const { name, dates, url, priceRanges, doorsTimes, _embedded } = e

			// Build address
			const venue = _embedded.venues[0]
			const address = `${venue.address.line1}, ${venue.city.name}, ${venue.state.name} ${venue.postalCode}`

			// Define epoch and time
			const epoch = Date.parse(new Date(dates.start.dateTime))
			const dateStringOptions = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute:'2-digit' }
			const time = new Date(epoch).toLocaleDateString('en-us', dateStringOptions)

			// Define doors time string
			let doorsAt
			if (doorsTimes !== undefined) {
				const doorsDate = new Date(doorsTimes.dateTime).toLocaleTimeString('en-us', {hour: 'numeric', minute:'2-digit'})
				doorsAt = doorsDate ? `Doors at ${doorsDate}` : ''
			} else {
				doorsAt = null
			}

			// Define ticket cost string
			let ticketCost
			if (priceRanges !== undefined) {
				const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: priceRanges[0].currency })
				ticketCost = `Tickets: ${formatter.format(priceRanges[0].min)} - ${formatter.format(priceRanges[0].max)}`
			} else {
				ticketCost = null
			}

			// Build description
			let descArr = []
			ticketCost ? descArr.push(ticketCost) : null
			doorsAt ? descArr.push(doorsAt) : null			
			const desc = descArr.length > 0 ? descArr.join(' - ') : ''

			// Push to events array
			events.push({
				title: name,
				venue: venue.name,
				address,
				time,
				desc,
				link: url,
				epoch
			});
			
		} catch (e) {
			console.error(e)
		}
	}

	return events

}

// console.log(await scrapeKFCYumCenter())