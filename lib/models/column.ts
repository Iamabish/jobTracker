import mongoose, { Document, Schema } from "mongoose";

interface IColumn extends Document{
    name : string,
    userId : string,
    board : mongoose.Types.ObjectId,
    order : number,
    jobs: mongoose.Types.ObjectId,
}

const ColumnSchema = new Schema<IColumn>({
    name : {
        type : String,
        required : true
    },

    userId : {
        type : String,
        required : true
    },

    order :{
        type : Number,
        required : true,
        default : 0
    },

    board :{
        type : mongoose.Types.ObjectId,
        ref : "Board",
        index : true
    },


    jobs : [
        {
            type : mongoose.Types.ObjectId,
            ref : 'JobApplication'
        }
    ]
}, {timestamps : true})

export default mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema)