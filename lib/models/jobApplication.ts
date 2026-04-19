import mongoose, { Schema } from "mongoose";

export interface IJobApplication  {
  company: string;
  position: string;
  location?: string;
  status: string;
  columnId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  userId: string;
  order: number;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  appliedDate?: Date;
  tags?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}


const JobApplicationSchema = new Schema<IJobApplication>({
    company  : {
        type : String,
        required : true
    },

    position : {
        type : String,
        required : true
    },

    location : {
        type : String,
        required : true
    },


    status : {
        type : String,
        required : true,
        default : 'applied'
    },

    columnId : {
        type : mongoose.Types.ObjectId,
        ref : 'Column',
        index : true
    },


    boardId : {
        type : mongoose.Types.ObjectId,
        ref : 'Board',
        index : true
    },


    userId : {
        type : String,
        ref : 'User',
        index : true
    },


    order : {
        type : Number,
        default : 0,
        required : true
    },


    notes :{
        type : String
    },

    salary :{
        type : String
    },


    jobUrl :{
        type : String
    },

    appliedDate :{
        type : Date
    },

    tags : [
        {
            type : String
        }
    ],


    description : {
        type : String
    }
}, {timestamps : true})


export default mongoose.models.JobApplication || mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema)