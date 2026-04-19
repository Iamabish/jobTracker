import connectDB from "./db"
import { Board, Column } from "./models"

const DEFAULT_COL = [
    {
        name : 'Wishlist',
        order : 0
    },
    {
        name : 'Appplied',
        order : 1
    },

    {
        name : 'Inrterviewing',
        order : 2
    },

    {
        name : 'Offer',
        order : 3
    },

    {
        name : 'Rejected',
        order : 4
    },
]


export default async function initBoard(userId : string) {

    await connectDB()

    console.log('at iniit board')
    console.log('this is user id', userId);
    ;
    

    try {
       const isBoardExist = await Board.findOne({userId, name : "Job Hunt"})

       if(isBoardExist) {
        return isBoardExist
       }

       const board = await Board.create({
            name : 'Job Hunt',
            userId : userId,
            columns : []
       })

       const column = Promise.all(
            DEFAULT_COL.map((col) => 
                Column.create({
                    name : col.name,
                    order : col.order,
                    board : board._id,
                    userId : userId,
                    jobs : []
                })
            )
       )

       board.columns = (await column).map((col) => col._id)
       await board.save()

    }catch(err : any) {
        throw err;
    }


}