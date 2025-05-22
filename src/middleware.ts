import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'

const isProtectedRoute = createRouteMatcher(['/labor-market(.*)'])

export const onRequest = clerkMiddleware((auth, context) => {
	const { redirectToSignIn, userId } = auth()
	console.log('hitting middleware')
	console.log('user id: ', userId)
	console.log(isProtectedRoute(context.request))

	if (!userId && isProtectedRoute(context.request)) {
		console.log('redirect to sign in')
		return Response.redirect(new URL('/sign-in', context.url), 302)
		// return redirectToSignIn()
	}
})
