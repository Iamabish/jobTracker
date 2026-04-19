"use client"
import { Button } from "./ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { signOut,  useSession } from "@/lib/auth/authClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";

export default  function Navbar() {

    const { data  } =  useSession()
    
    const router = useRouter()

    return <nav className="sticky top-0 flex items-center  justify-between px-3.5 py-4">
        <div className="flex items-center gap-2">
            <Briefcase />
            JobTracker
        </div>

        <div className="flex items-center gap-5">


            <Link href={'/dashboard'}>
                Dashboard
            </Link>

            {data?.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarFallback className="text-black">
                                   {data.user?.name[0].toUpperCase()} 
                                </AvatarFallback>
                            </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                <div>
                                    <p>{data?.user?.email}</p>
                                    <p>{data?.user?.name}</p>

                                </div>
                            </DropdownMenuLabel>  

                            <DropdownMenuItem onClick={async () => {
                                const res = await signOut()
                                    if(res.data?.success) {
                                        router.push('/signin')
                                    }else{
                                        alert('ERROR SIGNING OUT')
                                    }
                            }}>
                                LogOut
                            </DropdownMenuItem>
                            
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Link href={'/signin'}>
                    Login
                    </Link>

                    <Link href={'/signup'}>
                    <Button size={"lg"}   className=" py-5  text-white font-medium   bg-pink-400">
                        Start for free
                    </Button>
                    </Link>


                </>
            )}

            
        </div>

    </nav>
}