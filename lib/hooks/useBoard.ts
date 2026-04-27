"use client"
import { useEffect, useState } from "react";
import { Board, Column, JobApplication } from "../models/modelTypes";
import { string } from "zod";
import { updateJobApplication } from "../actions/jobApplication";

export default function useBoard(initBoard : Board ) {

    const [board, setBoard] = useState<Board | null>(initBoard || null)
    const [column, setColumn] = useState<Column[] | null>(initBoard?.columns || [])
    const [error, setError] = useState<string  | null>(null)


    useEffect(()=> {
        if(initBoard) {
            setBoard(initBoard)
            setColumn(initBoard.columns || [])
        }
    }, [initBoard])

    async function moveJob(jobApplicationId : string, newColumnId : string, newOrder : number) {

        setColumn((prev) => {
            const newColumn = prev?.map((col) => ({
                ...col,
                jobs : [...col.jobs]
            }))

            if(!newColumn) return []//dirty fix

            let  jobToMove : JobApplication | null = null
            let  oldColumnId : string | null = null

            for(const col of newColumn) {
                const jobIndex = col.jobs.findIndex((j) => j._id === jobApplicationId)
                if(jobIndex !== -1 && jobIndex !== undefined) {
                    jobToMove = col.jobs[jobIndex]
                    oldColumnId = col._id
                    col.jobs = col.jobs.filter((col) => col._id !== jobApplicationId)
                    break;
                }
            }


            if(jobToMove && oldColumnId) {
                let targetColumnIndex = newColumn.findIndex((col) => col._id === newColumnId)

                if(targetColumnIndex !== -1) {
                    let targetColumn = newColumn[targetColumnIndex]
                    let currentJobs  = targetColumn.jobs

                    const updatedJobs = [...currentJobs]
                    updatedJobs.splice(newOrder, 0, {
                        ...jobToMove,
                        columnId : newColumnId,
                        order : newOrder * 100
                    })


                    const jobsWithUpdatedOrder = updatedJobs.map((job,idx) => ({
                        ...job,
                        order : idx * 100
                    }))

                    newColumn[targetColumnIndex] =  {
                        ...targetColumn,
                        jobs : jobsWithUpdatedOrder
                    }
                }

            }

            return newColumn
        })

        try {

            const res = await updateJobApplication(jobApplicationId, {
                columnId : newColumnId,
                order : newOrder
            })

        }catch(err) {
            console.log('Fail to move the job', err);
            
        }

    }



    


    return {board, column, error, moveJob }
}

