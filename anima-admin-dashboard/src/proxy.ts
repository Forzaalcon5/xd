import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Módulo Middleware Principal (Se ejecuta Edge en cada solicitud CADA VEZ)
export function proxy(request: NextRequest) {
  const adminToken = request.cookies.get('anima_admin_token')?.value
  
  // Array de rutas públicas (no requiern sesión)
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
                     
  // Las imágenes públicas y código de Next deben ser ignorados para que cargue la PWA gráfica
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 1. Si NO tengo el Token y ESTOY intentando ir al Dashboard (Ruta Protegida "/"): REBOTAR
  if (!adminToken && !isAuthPage) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Si SI tengo Token pero intento ir a LOGEARME: Mandar defrente al Dashboard
  if (adminToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Si pasa las barreras, dejar cargar
  return NextResponse.next()
}

// Configurar qué rutas escucha el middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
