import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import { getEvents } from './getEvents.js'
import { credentials } from './env.js'

async function saveEvents() {
	try {
		// Create an S3 client service object
		const s3 = new S3Client({ region: 'us-east-2', credentials })

		// Create the parameters for writing a JSON object with public ACL in S3
		const params = {
			Bucket: 'shows-in-town',
			Key: 'events.json',
			ACL: 'public-read',
			ContentType: 'application/json',
			Body: JSON.stringify(await getEvents())
		}

		// Write the object to S3
		const data = await s3.send(new PutObjectCommand(params))
		console.log('Success', data)

	} catch (e) {
		console.error(e)
	}
}

saveEvents()