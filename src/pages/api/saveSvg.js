import fs from 'node:fs'
import { optimize } from 'svgo'

const svgoConfig = {
	plugins: [
		{
			name: 'removeUnknownsAndDefaults',
			params: {
				keepDataAttrs: false,
			},
		},
	],
}

export const POST = async ({ request }) => {
	const body = await request.json()
	const name = body.name
	const svgString = optimize(body.svgString, svgoConfig)

	await fs.writeFileSync(`out/${name}.svg`, svgString.data, { encoding: 'utf-8' })

	return new Response(
		JSON.stringify({
			success: true,
		}),
		{
			status: 200,
		}
	)
}
