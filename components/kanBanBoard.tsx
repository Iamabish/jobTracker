"use client"
import { Board, Column, JobApplication } from "@/lib/models/modelTypes";
import { Award, Calendar, CheckCircle2, LucideIcon, Mic, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplication from "./createJobApplication";
import JobApplicationCard from "./jobApplicationCard";
import useBoard from "../lib/hooks/useBoard"
import  {DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { deleteColumn } from "@/lib/actions/jobApplication";

interface KanBanBoardProps {
    board : Board
    userId : string | undefined
}


interface ColConfig {
    color : string,
    icon : React.ReactNode
}

const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];


function DropableColumn({column, config, boardId, sortedColumns} : {
    column : Column,
    config : ColConfig, 
    boardId : string, 
    sortedColumns : Column[] | null
} ) {
    
    //col info with job application
    //sorting jobs in which they are appearing
    const sortedJobs = [...column.jobs].sort((a,b)=>a.order-b.order);

    const {setNodeRef, isOver}  = useDroppable({
        id : column._id,
        data :{
            type : 'column',
            columndId : column._id
        }
    })
    
    console.log('stuck at dropable column');
    

    return (

    <Card className="min-w-[300px] flex-shrink-0 shadow-md p-2 mb-3">
        <CardHeader className={`${config.color} text-white rounded-t-lg pb-3 pt-3`} >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {config.icon}
                    <CardTitle className="text-white text-base font-semibold">{column.name}</CardTitle> 
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center w-6 h-6 text-white hover:bg-white/20 rounded cursor-pointer">
                        <MoreVertical className="h-4 w-4"/>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteColumn(column._id)}>
                            <Trash2 className="mr-2 h-4 w-6"/>
                            Delete Column
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>

        <CardContent ref={setNodeRef}  className={`bg-gray-50/50 min-h-[400px] rounded-b-lg space-y-2 pt-4 ${isOver ? "ring-2  ring-blue-500 " : "" }  `}>

            <SortableContext 
                items={sortedJobs.map((job) => job._id)} 
                strategy={verticalListSortingStrategy}    
            >


                {sortedJobs.map((job, key) => (
                    <SortableJobCard key={key} job={{...job, columnId : job.columnId || column._id }} columns={sortedColumns}/>

                    //destructuring job to add  the column in which this jobs is in
                ))}

            </SortableContext>


            <CreateJobApplication columnId={column._id} boardId={boardId}/>
        </CardContent>
    </Card>


        )
}


function SortableJobCard({job, columns} : {job : JobApplication; columns : Column[] | null}) {

    //showign the info of the job

    //handle sorting, drag and droping

    console.log('stuck at sortable job card function ');
    
    const {
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging, 
        setNodeRef} = useSortable({
        id : job._id,
        data : {
            type : 'jobs',
            job,
        }
    })

    const style = {
        transform : CSS.Transform.toString((transform)),
        transition,
        opacity : isDragging ? '0.5' : 1
    }

   return <div ref={setNodeRef} style={style}>
    <JobApplicationCard job={job} columns={columns} dragHandleProps={{...attributes, ...listeners}}/>
   </div> 
}

export default function KanBanBoard({board, userId} : KanBanBoardProps) {
    const[activeId, setActiveId] = useState<string | null>(null)

    const {column, moveJob } = useBoard(board)

    console.log('stuck at kann ban board');
        
    // console.log('jobs',column && column[0].jobs);

    const sortedColumns = column ? [...column].sort((a,b)=>a.order-b.order) : [];


    async function handleDragStart (event : DragStartEvent) { 
        setActiveId(event.active.id as string)
    }

    async function handleDragEnd(event : DragEndEvent)  {

        const {over, active} = event

        if(!over || !active) return

        const overId = over.id as string
        const activeId = active.id as string

        let dragedJob : JobApplication | null = null
        let sourceColumn : Column | null = null
        let sourceIndex : number = -1;

        for(const col of sortedColumns) {
            let jobs = col.jobs.sort((a, b) => a.order - b.order)
            let jobIndex = jobs.findIndex((j) => j._id === activeId)

            if(jobIndex !== -1) {
                dragedJob = jobs[jobIndex]
                sourceColumn = col
                sourceIndex = jobIndex
                break;
            }
        }

        if(!sourceColumn || !dragedJob) return

        const targetColumn = sortedColumns.find((col) => col._id === overId)
        const targetJob = sortedColumns.flatMap((col) => col.jobs || [])
        .find((job) => job._id === overId)

        let targetColumnId : string;
        let newOrder : number;

        if(targetColumn) {
            targetColumnId = targetColumn._id
            let jobsInTargetColumn = targetColumn.jobs.filter((j) => j._id !== activeId)
            .sort((a, b) => a.order - b.order)
            newOrder = jobsInTargetColumn.length            
        }else if(targetJob) {

            let targetJobColumn = sortedColumns.find((col) => col.jobs.some((j) => j._id === targetJob._id))
            targetColumnId = targetJobColumn?._id || targetJob._id

            const targetColumnObj = sortedColumns.find((col) => col._id === targetColumnId)

            if(!targetColumnObj) return

            const allJobInTargetOriginal = targetColumnObj.jobs.sort((a, b) => a.order - b.order) || []

            const allJObInTargetFilter = allJobInTargetOriginal.filter((f) => f._id !== activeId) || []

            const targetIndexOriginal = allJobInTargetOriginal.findIndex((j) => j._id === overId) 

            const targetIndexFilter = allJObInTargetFilter.findIndex((j) => j._id === overId)


            if(targetIndexFilter !== -1) {

                if(sourceColumn._id === targetColumnId) {

                    if(sourceIndex < targetIndexOriginal){
                        newOrder = targetIndexOriginal + 1;
                    }else {
                        newOrder = targetIndexFilter
                    }

                }else {
                    newOrder = targetIndexFilter
                }
            }else {
                newOrder = allJObInTargetFilter.length
            }
        }else {
            return
        }
        
        if(!targetColumnId) return

        await moveJob(activeId, targetColumnId, newOrder )
    
    }       

    const sesnsor = useSensors(useSensor(
        PointerSensor, {
            activationConstraint : {
                distance : 8
            }
        }
    ))

    const activeJob = sortedColumns
    .flatMap((col) => col.jobs || [])
    .find((job) => job._id === activeId)
    
    return (
        <DndContext 
        sensors={sesnsor} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}>
            <div className="space-y-4">
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {sortedColumns && sortedColumns.map((col, key) => {

                        const config = COLUMN_CONFIG[key] || {
                            color: "bg-cyan-500",
                            icon: <Calendar className="h-4 w-4" />,
                        }

                        return <DropableColumn key={key} column={col} config={config} boardId={board._id}
                        sortedColumns={sortedColumns}
                        />
                    })}
                </div>
            </div>


            <DragOverlay>
                {activeJob ?  (
                    <div>
                        <JobApplicationCard job={activeJob}  columns={sortedColumns}/>
                    </div>
                ) :  ""}
            </DragOverlay>

        </DndContext>
    )

}