// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale, normalizeLocale } from '@/content/i18n/locales';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Ignore static files, API routes, and meta files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/illustrations') ||
    pathname.startsWith('/schematic') ||
    pathname.startsWith('/photos') ||
    pathname.includes('.') // any file like icon.svg, robots.txt, sitemap.xml, etc.
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a supported locale
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    // Already has valid locale in URL
    return NextResponse.next();
  }

  // Determine user's preferred locale
  // 1. Check saved cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    const url = new URL(`/${cookieLocale}${pathname === '/' ? '' : pathname}${search}`, request.url);
    return NextResponse.redirect(url);
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('accept-language');
  let detectedLocale = DEFAULT_LOCALE;

  if (acceptLang) {
    // Extract first language preference
    const primary = acceptLang.split(',')[0]?.split(';')[0]?.trim();
    detectedLocale = normalizeLocale(primary);
  }

  const redirectUrl = new URL(
    `/${detectedLocale}${pathname === '/' ? '' : pathname}${search}`,
    request.url
  );

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
