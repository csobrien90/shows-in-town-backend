import {unEscapeWordPressHTML} from '../utilities.js'

export async function scrapeZanzabar() {
	const formData = new FormData()
	formData.append('action', 'loadEtixMonthViewEventPageFn')
	formData.append('data[limit]', 10000)
	formData.append('data[display]', false)

	// Get events from exposed WordPress REST API endpoint
	const response = await fetch('https://zanzabarlouisville.com/wp-admin/admin-ajax.php', {
		method: 'POST',
		body: formData
	}).then(res => res.json())
	
	const rawEvents = response.data

	// Iterate over elements and populate events array
	let events = [];
	rawEvents.forEach(event => {
		const {title, start, end, url} = event

		// Grab title from between <div> tags
		const titleRegex = new RegExp(/(?<=showtitle'>)(.*)(?=<\/div>)/)
		const titleArr = title.match(titleRegex)
		let finalTitle = ''
		if (titleArr) {
			finalTitle = titleArr[1]
		} else {
			return
		}

		// Define epoch and time
		const epoch = new Date(start).getTime()
		const startTime = new Date(start).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
		const endTime = new Date(end).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
		const doors = new Date(start - 3600000).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})

		// Tidy up data and push to events array
		events.push({
			title: unEscapeWordPressHTML(finalTitle),
			venue: 'Zanzabar',
			address: '2100 S Preston St, Louisville, KY 40217',
			time: `${startTime} - ${endTime}`,
			desc: `Ticket prices vary - visit event on Zanzabar's website for full details. Must be 18 or older to enter. Doors open at ${doors}`,
			link: url,
			epoch
		});
	})

	return events

}

// console.log(await scrapeZanzabar())