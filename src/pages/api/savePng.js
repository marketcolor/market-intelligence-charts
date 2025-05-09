import fs from 'node:fs'
import { Buffer } from 'node:buffer'

export const POST = async ({ request }) => {
	const body = await request.json()
	const name = body.name
	const png = body.png.replace(/^data:image\/png;base64,/, '')

	const buffer = new Buffer(png, 'base64')

	await fs.writeFileSync(`out/${name}.png`, buffer, { encoding: 'base64' })

	return new Response(
		JSON.stringify({
			success: true,
		}),
		{
			status: 200,
		}
	)
}
