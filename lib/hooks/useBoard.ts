"use client"
import { useEffect, useState } from "react";
import { Board, Column } from "../models/modelTypes";

export default function useBoard(initBoard : Board ) {

    const [board, setBoard] = useState<Board | null>(initBoard || null)
    const [column, setColumn] = useState<Column[] | null>(initBoard?.columns || null)
    const [error, setError] = useState<string  | null>(null)


    useEffect(()=> {
        if(initBoard) {
            setBoard(initBoard)
            setColumn(initBoard.columns || [])
        }
    }, [initBoard])

    // async function moveJob(jobApplicationId : string, newColumnId : string, newOrder : string) {
    // }


    return {board, column, error }
}

