import { getSession } from "@/lib/auth/auth"
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import KanBanBoard from "@/components/kanBanBoard";
import { Suspense } from "react";

async function getBoard(userId : string) {

    "use cache"

    await connectDB()

    const boardDoc = await Board.findOne({
        userId : userId, 
        name : "Job Hunt"
    }).populate({
        path : 'columns',
        populate: {
        path: "jobs",
    },
    })

    if(!boardDoc) return null

    const board = JSON.parse(JSON.stringify(boardDoc))

    return board;
}


async function DashBoardPage() {
   
    const session = await getSession()
    console.log('this is session');
    
    const board = await getBoard(session?.user.id ?? "")

    console.log(JSON.stringify(board, null, 2));
    

    return <>
        <div className="min-h-screen">
            <div className="container mx-auto p-6">

                <div className="p-6">
                    <h2 className="text-2xl font-semibold">{board?.name}</h2>

                    <p>Track your Job Application</p>
                </div>

                <KanBanBoard board={board} userId={session?.user.id}/>

            </div>
        </div>
    </>
}

export default async function DashBoard() {

    

    return <Suspense fallback={<p>Loading..</p>}>
        <DashBoardPage  />
    </Suspense>    

}