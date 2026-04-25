import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(req: NextRequest) {

    console.log('proxi is running');

    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isSignin = req.nextUrl.pathname.startsWith('/signin')
    const isSignup = req.nextUrl.pathname.startsWith('/signup')

    const session = await getSession()

    if (isDashboard && !session?.user) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    if ((isSignin || isSignup) && session?.user) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/signin', '/signup']
}