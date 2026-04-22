import connectDB from "./db"
import { Board, Column } from "./models"

const DEFAULT_COLUMNS = [
  {
    name: "Wish List",
    order: 0,
  },
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
];


export  async function initBoard(userId : string) {



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
            DEFAULT_COLUMNS.map((col) => 
                Column.create({
                    name : col.name,
                    order : col.order,
                    board : board._id,
                    userId : userId,
                    jobs : []
                })
            )
       )

       console.log('intializing the columns');
       

       board.columns = (await column).map((col) => col._id)
       await board.save()

    }catch(err : any) {
        throw err;
    }


}