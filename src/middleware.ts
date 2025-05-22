import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isPublicRoute = createRouteMatcher(['/login(.*)'])

export const onRequest = clerkMiddleware((auth, context) => {
	const { redirectToSignIn, userId } = auth()
	console.log('hitting middleware')

	if (!userId && !isPublicRoute(context.request)) {
		console.log('redirect to sign in')
		return redirectToSignIn()
	}
})
