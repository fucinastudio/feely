import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);
  const url = request.nextUrl;
  console.log("Url.Pathnam", url);
  if (url.pathname === "/") {
    if (res.user) {
      console.log("Redirecting");
      return NextResponse.redirect(
        new URL("/redirect_to_workspace", request.url)
      );
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return res.response;
  // =============== MIDDLEWARE FOR SUBDOMAINS REDIRECTION ===============
  // const url = request.nextUrl;
  // const hostname = request.headers.get("host");

  // Define allowed Domains (localhost and production domain)
  // const allowedDomains = ["localhost:3000", "feely.so"];

  // // Verify if hostname exist in allowed domains
  // const isAllowedDomain = allowedDomains.some((domain) => hostname?.includes(domain));

  // // Extract the possible subdomain in the URL
  // const subdomain = hostname?.split(".")[0];

  //Get if there is a subdomain in the URL
  // const hasSubdomain =
  //   (hostname?.split(".").length ?? 0) >
  //   //If we are in localhost we don't have .com or similar, so we have only 2 parts
  //   (hostname?.includes("localhost") ? 1 : 2);
  // // If we stay in a allowed domain and its not a subdomain, allow the request.
  // if (isAllowedDomain && !hasSubdomain) {
  // return NextResponse.next();
  // }

  // if (hasSubdomain) {
  //   const newSession = await updateSession(request);
  //   if (!newSession) {
  //     return new Response(null, { status: 401 });
  //   }
  //   // Rewrite the URL in the dynamic route based in the subdomain
  // return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
  // }
  // ======================================================================
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
