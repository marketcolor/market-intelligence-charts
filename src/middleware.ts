import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isPublicRoute = createRouteMatcher(['/login(.*)'])

export const onRequest = clerkMiddleware((auth, context) => {
	const { redirectToSignIn, userId } = auth()

	if (!userId && !isPublicRoute(context.request)) {
		return redirectToSignIn()
	}
})
