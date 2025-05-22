import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

export const onRequest = clerkMiddleware((auth, context) => {
	const { userId } = auth()

	if (!userId && !isPublicRoute(context.request)) {
		return Response.redirect(new URL('/sign-in', context.url), 302)
	}
})
