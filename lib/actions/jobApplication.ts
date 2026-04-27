"use server"

import { revalidatePath } from "next/cache";
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


    revalidatePath('/dashboard')

    return {data : JSON.parse(JSON.stringify(jobApplication))}
}


export async function updateJobApplication(id : string, 
    updates : {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    columnId?: string;
    order?: number;
    tags?: string[];
    description?: string;
}) {

    console.log('udpate job called');
    console.log('id', id);
    console.log('payload', updates)

    

    const session = await getSession()

    if(!session?.user) {
        return { error : 'Unautorized'}
    }

    const jobApplication = await JobApplication.findById(id)

    if(!jobApplication) {
        return { error : 'Job Application not found'}
    }

    if(jobApplication.userId !== session.user.id) {
        return { error : 'Unauthorized'}
    }

    const {columnId, order, ...otherUpdates} = updates

    const updatesToApply : Partial<{
        company : string,
        position: string;
        location: string;
        notes: string;
        salary: string;
        jobUrl: string;
        columnId: string;
        order: number;
        tags: string[]
        description: string;

    }> = otherUpdates


    const currentColumndId = jobApplication.columnId.toString()
    const newColumnId = columnId?.toString()

    const isMoving = newColumnId  && newColumnId !== currentColumndId


    if(isMoving) {

        await Column.findByIdAndUpdate(currentColumndId, {
            $pull :{
                jobs : id
            }
        })

        const jobsInTargetColumn = await JobApplication.find({
            columnId : newColumnId,
            _id : { $ne : id}
            },
        )
        .sort({order : 1})
        .lean()

        let newOrderValue : number;

        if(order !== undefined && order !== null) {
            newOrderValue = order * 100;


            const jobThatNeedToShift = jobsInTargetColumn.slice(order)
            for(const job of jobThatNeedToShift) {

                await JobApplication.findByIdAndUpdate(job._id, {
                    $set :{ order : job.order + 100 }
                })

            }   
        }else {
            if(jobsInTargetColumn.length > 0) {

                const lastJobOrder = jobsInTargetColumn[jobsInTargetColumn.length  - 1].order || 0
                newOrderValue = lastJobOrder * 100;

            }else {
                newOrderValue = 0;
            }
        }


        updatesToApply.columnId = newColumnId;
        updatesToApply.order = newOrderValue

        await Column.findByIdAndUpdate(newColumnId, {
            $push :{jobs : id}
        })


    }else {

        if(order !== undefined || order !== null) {

            const otherJobInColumn  = await JobApplication.find({
                columnId : currentColumndId,
                _id : {$ne : id}
            })
            .sort({order : 1})
            .lean()


            const currentJobOrder = jobApplication.order || 0;
            const currentPositionIndex = otherJobInColumn.findIndex(
                (job) => job.order > currentJobOrder
            )

            const oldPositionIndex = currentPositionIndex === - 1 ? otherJobInColumn.length - 1 : currentPositionIndex;
            
            const newOrderValue =  order && order * 100 || 0

            if(order && order < oldPositionIndex) {

                const jobToShiftDown = otherJobInColumn.slice(order, oldPositionIndex)

               for(const job of jobToShiftDown) {

                await JobApplication.findByIdAndUpdate(job._id,  {
                    $set : { order : job.order + 100  }
                })
               }
            }else if(order && order > oldPositionIndex) {

                const jobToShiftUp = otherJobInColumn.slice(order)

                for(const job of jobToShiftUp) {
                    const newOrder = Math.max(0, job.order - 100)
                    await JobApplication.findByIdAndUpdate(job._id, {
                        $set : {order : newOrder}
                    })
                }

                updatesToApply.order = newOrderValue

            }


        }

    }

    const update = await JobApplication.findByIdAndUpdate(id, updatesToApply, {new : true})

    console.log('updated job', update);
    

    revalidatePath('/dashboard')


    return { data : JSON.parse(JSON.stringify(update))}
}


export async function deleteJobAppication(jobId : string) {

    console.log('delte job Application', jobId);
    

    const session = await getSession()

    if(!session?.user) {
        return { error : "Unauthorized"}
    }

    const isJob = await JobApplication.findById(jobId) 

    if(!isJob) {
        return { error : "Job Application not found"}
    }

    if(session.user.id !==isJob.userId) {
        return { error : "Unauthorized"}
    } 
    
    
    await Column.findByIdAndUpdate(isJob.columnId, {
        $pull : {jobs : jobId}
    })

    await JobApplication.deleteOne({_id : jobId})

    revalidatePath('/dashboard')

    return { success : true }

}

export async function  deleteColumn(columnId : string) {

    const session = await getSession()

    if(!session?.user) {
        return { error : "Unauthorized" }
    }

    const isColumn = await Column.findById(columnId)

    if(!isColumn) {
        return { error : 'Invalid Column id' }
    }

    if(isColumn.userId !== session.user.id) {
        return { error : "Unauthorized" }  
    }

    await JobApplication.deleteMany({ columnId })
    await Column.findByIdAndDelete(columnId)

    await Board.findByIdAndUpdate(isColumn.boardId, {
        $pull: { columns: columnId }
    })

    revalidatePath('/dashboard')

    return { success : true }
    
}