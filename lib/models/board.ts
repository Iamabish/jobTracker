import mongoose, { Document, Schema } from "mongoose";

export interface IBoard  extends Document{
    userId : string,
    name : string,
    columns : mongoose.Types.ObjectId
}

const BoardSchema = new Schema<IBoard>({
    name : {
        type : String,
        required : true
    },

    userId : {
        type : String,
        required : true,
        index : true
    },

    columns : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Column"
        }
    ]

},{timestamps : true})

export default mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema)


