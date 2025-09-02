import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextFetchEvent } from "next/server";
import { NextRequest } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const isProtectedRoute = req.nextUrl.pathname.includes("admin");

  if (!isProtectedRoute) {
    return intlMiddleware(req);
  } else {
    return authMiddleware(req as NextRequestWithAuth, event);
  }
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
