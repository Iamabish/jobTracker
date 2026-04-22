import { Column, JobApplication } from "@/lib/models/modelTypes";
import { Card, CardContent } from "./ui/card";
import {
  Edit2,
  ExternalLink,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {

    //handles the ui of job application card
  return (
    <Card className="group border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-base font-semibold text-zinc-900 leading-tight">
                {job.position}
              </h3>

              <p className="text-sm text-zinc-500 mt-1">
                {job.company}
              </p>
            </div>

            {job.description && (
              <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                {job.description}
              </p>
            )}

            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, key) => (
                  <span
                    key={key}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {job.jobUrl && (
              <a
                target="_blank"
                href={job.jobUrl}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                View Job
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl opacity-70 hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl"
              >
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                {columns.length > 1 &&
                  columns
                    .filter((c) => c._id !== job.columnId)
                    .map((col, key) => (
                      <DropdownMenuItem
                        key={key}
                        className="cursor-pointer"
                      >
                        Move to {col.name}
                      </DropdownMenuItem>
                    ))}

                <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer focus:text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}