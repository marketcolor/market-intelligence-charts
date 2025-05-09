import { renderPdf } from '@/lib/renderPdf'

export const POST = async ({ request }) => {
	const body = await request.json()
	const slug = body.slug

	const res = await renderPdf(slug)

	return new Response(
		JSON.stringify({
			res,
			success: true,
		}),
		{
			status: 200,
		}
	)
}
