"use client"
import { Board, Column, JobApplication } from "@/lib/models/modelTypes";
import { Award, Calendar, CheckCircle2, LucideIcon, Mic, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplication from "./createJobApplication";
import JobApplicationCard from "./jobApplicationCard";
import useBoard from "../lib/hooks/useBoard"

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

    console.log('stuck at dropable column');
    

    return <Card className="min-w-[300px] flex-shrink-0 shadow-md p-2 mb-3">
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
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-6"/>
                            Delete Column
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>

        <CardContent className="bg-gray-50/50 min-h-[400px] rounded-b-lg space-y-2 pt-4 ">

            {sortedJobs.map((job, key) => (
                <SortableJobCard key={key} job={{...job, columnId : job.columnId || column._id }} columns={sortedColumns}/>

                //destructuring job to add  the column in which this jobs is in
            ))}

            <CreateJobApplication columnId={column._id} boardId={boardId}/>
        </CardContent>
    </Card>

}


function SortableJobCard({job, columns} : {job : JobApplication; columns : Column[] | null}) {

    //showign the info of the job

    //handle sorting, drag and droping

    console.log('stuck at sortable job card function ');
    

   return <div>
    <JobApplicationCard job={job} columns={columns}/>
   </div> 
}



export default function KanBanBoard({board, userId} : KanBanBoardProps) {

    const {column } = useBoard(board)

    console.log('stuck at kann ban board');
        
    // console.log('jobs',column && column[0].jobs);

    const sortedColumns = column ? [...column].sort((a,b)=>a.order-b.order) : [];

    
    
    return (
        <>
            <div>
                <div>
                    {column && column.map((col, key) => {

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
        </>
    )

}