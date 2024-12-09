import { createRootRoute, createRouter, createRoute, redirect } from '@tanstack/react-router'
import App from './App'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import AboutUs from './pages/AboutUs'
import SignUp from './components/Auth/SignUp'
import Dashboard from './pages/Dashboard'
import { auth } from './config/firebase'

// Create a root route
const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: HowItWorks,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutUs,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUp,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
  beforeLoad: async () => {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw redirect({
        to: '/',
      })
    }
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  howItWorksRoute,
  aboutRoute,
  signUpRoute,
  dashboardRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}