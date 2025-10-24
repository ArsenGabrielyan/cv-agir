import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { jwtVerify } from "jose";
import {
     publicRoutes,
     authRoutes,
     apiAuthPrefix,
     dynamicRoutes,
     DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
import { env } from "./lib/env";

const handleI18nRouting = createMiddleware(routing);

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
     const normalizedPath = pathname.replace(`/${locale}`, "") || "/";

     const sessionToken =
          req.cookies.get("__Secure-next-auth.session-token")?.value ??
          req.cookies.get("next-auth.session-token")?.value;

     const isPublicRoute = publicRoutes.includes(normalizedPath);
     if (!sessionToken && !isPublicRoute)
          return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));

     if (sessionToken) try {
          await jwtVerify(
               sessionToken,
               new TextEncoder().encode(env.AUTH_SECRET)
          );
     } catch {
          return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
     }

     const isApiAuthRoute = normalizedPath.startsWith(apiAuthPrefix);
     const isAuthRoute = authRoutes.includes(normalizedPath);
     const isDynamicProtectedRoute = dynamicRoutes.some(r => r.test(normalizedPath));

     const res = NextResponse.next();
     res.headers.set("Cache-Control", "no-store");

     if (isApiAuthRoute) return res;

     if (isAuthRoute && sessionToken) {
          if (normalizedPath !== DEFAULT_LOGIN_REDIRECT)
               return NextResponse.redirect(
                    new URL(`/${locale}${DEFAULT_LOGIN_REDIRECT}`, req.url)
               );
          return res;
     }

     if (!sessionToken && !isPublicRoute && !isDynamicProtectedRoute) {
          const callbackUrl = encodeURIComponent(pathname + url.search);
          return NextResponse.redirect(
               new URL(`/${locale}/auth/login?callbackUrl=${callbackUrl}`, req.url)
          );
     }

     return res;
}

export const config = {
     matcher: [
          '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|webm|png|gif|svg|ttf|mp4|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
          '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
     ],
};