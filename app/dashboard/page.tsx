import { getSession } from "@/lib/auth/auth"
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { Db } from "mongodb";
import { connect } from "mongoose";
import KanBanBoard from "@/components/kanBanBoard";

export default async function DashBoard() {

    const session = await getSession()
    console.log('this is session');
    

    await connectDB()

    const board = await Board.findOne({
        userId : session?.user?.id, 
        name : "Job Hunt"
    }).populate('columns')

    console.log('board', board);
    

    return <div className="min-h-screen">
            <div className="container mx-auto p-6">

                <div className="p-6">
                    <h2 className="text-2xl font-semibold">{board?.name}</h2>

                    <p>Track your Job Application</p>
                </div>

                <KanBanBoard board={JSON.parse(JSON.stringify(board))} userId={session?.user.id}/>

            </div>
    </div>

}