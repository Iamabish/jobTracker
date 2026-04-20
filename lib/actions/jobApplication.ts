"use server"

import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";



interface JobApplicationData {
    company: string,
    position: string,
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId: string;
    boardId: string;
    tags?: string[];
    description?: string;
}

export default async function createJobApplication(data : JobApplicationData) {

    const session = await getSession()

    if(!session?.user) {
        return {error : "Unauthorized request"}
    }

    const {
        company, 
        position,
        location, 
        notes, 
        salary, 
        jobUrl, 
        columnId, 
        boardId, 
        tags, 
        description
    } = data


    if(!company || !position || !columnId || !boardId) {
        return {error : "Missing require fields"}
    }

    await connectDB()

    const isBoard = await Board.findOne({
        _id : boardId,
        userId : session.user.id
    })

    if(!isBoard) {
        return {error : "Board is not found"}
    }

    const isColumn = await Column.findOne({
        _id : columnId,
        userId : session.user.id
    })

    if(!isColumn) {
        return {error : "Column not found"}
    }


    const maxOrder = await JobApplication.findOne({ columnId })
    .sort({order : -1})
    .select("order")
    .lean() as {order : number} || null

    const jobApplication = await JobApplication.create({
        company, 
        position,
        location, 
        notes, 
        salary, 
        jobUrl, 
        columnId, 
        boardId, 
        tags : tags || [], 
        description,
        order : maxOrder ? maxOrder.order + 1 : 0,
        userId : session.user?.id,
    })


    await Column.findByIdAndUpdate(columnId, {
        $push : {
            jobs : jobApplication._id
        }
    })

    return {data : JSON.parse(JSON.stringify(jobApplication))}
    

}