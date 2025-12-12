import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = request.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Protected routes
  const protectedRoutes = ['/user', '/admin', '/manager']
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  let token = request.cookies.get('access_token')?.value

  if (!token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }
  if (pathname === '/') {
    return NextResponse.next()
  }
  if (token) {
    if (isPublicRoute) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    try {
      const payload = jwtDecode<any>(token);
      const role =
        payload.realm_access?.roles ||
        payload.resource_access?.["schedule-client"]?.roles ||
        [];

      const isAdmin = role.includes("ADMIN");
      const isManager = role.includes("MANAGER");
      const isUser = role.includes("USER");

      if (pathname.startsWith('/admin') && !isAdmin) {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      if (pathname.startsWith('/manager') && !(isAdmin || isManager)) {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = '/login'
      const response = NextResponse.redirect(url)
      response.cookies.delete('access_token')
      return response
    }

    return NextResponse.next()
  }

  if (isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}