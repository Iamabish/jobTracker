"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle,  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Signup () {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')


    return <div className="min-h-screen flex items-center  justify-center  px-4 py-8">

            <Card className="rounded-md max-w-lg w-full shadow-lg">
                <CardHeader className=" space-y-1 pb-2">
                    <CardTitle className="text-2xl font-semibold">
                        Sign up
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Create an account to start tracking your job applications
                    </p>
                </CardHeader>


                <CardContent>

                    <form >


                            <div className="space-y-2 mb-3">
                                <Label>Name</Label>
                                <Input placeholder="John Doe" className="rounded-md py-4 "/>
                            </div>


                            <div className="space-y-2 mb-3">
                                <Label>Email</Label>
                                <Input placeholder="John Doe" className="py-4"/>
                            </div>


                            <div className="space-y-2 mb-3">
                                <Label>Password</Label>
                                <Input placeholder="John Doe" className="py-4"/>
                            </div>


                            <Button type="submit" size={"lg"}   className="w-full cursor-pointer">Sign up</Button>

                    </form>

                </CardContent>
            </Card>

    </div>


}