import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
     publicRoutes,
     authRoutes,
     apiAuthPrefix,
     dynamicRoutes,
     DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const handleI18nRouting = createMiddleware(routing);
const { auth } = NextAuth(authConfig)

export default async function middleware(req: NextRequest) {
     const i18nResponse = handleI18nRouting(req);
     if (i18nResponse) return i18nResponse;

     const url = new URL(req.url);
     const pathname = url.pathname;

     if (
          pathname.startsWith("/_next") ||
          pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|webm|mp4|css|js|json|txt|xml|woff2?|ttf|zip)$/)
     ) return NextResponse.next();

     const locale =
          routing.locales.find((loc) => pathname.startsWith(`/${loc}`)) ||
          routing.defaultLocale;

     const session = await auth();
     const isLoggedIn = !!session;

     const normalizedPath = pathname.replace(`/${locale}`, "") || "/";

     const isApiAuthRoute = normalizedPath.startsWith(apiAuthPrefix);
     const isPublicRoute = publicRoutes.includes(normalizedPath);
     const isAuthRoute = authRoutes.includes(normalizedPath);
     const isDynamicProtectedRoute = dynamicRoutes.some((r) =>
          r.test(normalizedPath)
     );

     if (isApiAuthRoute) return NextResponse.next();

     if (isAuthRoute && isLoggedIn) {
          if (normalizedPath !== DEFAULT_LOGIN_REDIRECT)
               return NextResponse.redirect(
                    new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT}`, req.url)
               );
          return NextResponse.next();
     }

     if (!isLoggedIn && !isPublicRoute && !isDynamicProtectedRoute) {
          const callbackUrl = encodeURIComponent(pathname + url.search);
          return NextResponse.redirect(
               new URL(`/${locale}/auth/login?callbackUrl=${callbackUrl}`, req.url)
          );
     }

     return NextResponse.next();
}

export const config = {
     matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|webm|png|gif|svg|ttf|mp4|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)',]
}