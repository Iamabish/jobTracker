import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(req : NextRequest) {

    const session = await getSession()
    
    const isDashbard = req.nextUrl.pathname.startsWith("/dashboard")

    if(isDashbard && !session?.user) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    const isSignin = req.nextUrl.pathname.startsWith('/signin')
    const isSignup = req.nextUrl.pathname.startsWith('/signup')

    if((isSignin || isSignup) && session?.user) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}