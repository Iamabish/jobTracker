"use client"
import { Column, JobApplication } from "@/lib/models/modelTypes";
import { Card, CardContent } from "./ui/card";
import {
  Edit2,
  ExternalLink,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteJobAppication, updateJobApplication } from "@/lib/actions/jobApplication";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Column[] | null;
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {

    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [formData, setFormData] = useState({

        company: job.company || "",
        position: job.position || "",
        location: job.location || "",
        salary: job.salary || "",
        jobUrl: job.jobUrl || "",
        tags: job.tags?.join(", ") || "",
        description: job.description || "",
        notes: job.notes || "",
    })

    async function handleMove(newColId : string) {
        try {

            console.log('handle move called with this new col id', newColId);
            
            await updateJobApplication(job._id, {columnId : newColId})
        }catch(err) {
            console.error("Failed to move job Application", err);

        }
    } 

    async function handleUpdate(e : React.FormEvent) {
        e.preventDefault()
        try {

            const res = await updateJobApplication(job._id, {
                ...formData,
                tags : formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(tag => tag.length > 0)
            })

            if(!res.error) {
                setIsEdit(false)
            }
            
        }catch(err) {
            console.error("Failed to move job Application", err);

        }
    }


    async function handleDelete(jobId : string) {
        try {

            console.log('handle delete called with this job id', jobId);
            
            await deleteJobAppication(jobId)
        }catch(err) {
            console.error("Failed to delete job Application", err);

        }
    }


    function handleChange(e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { value, name } = e.target

        setFormData((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    

    //handles the ui of job application card
  return (

    <>
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
              <DropdownMenuTrigger >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl"
              >
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={()=> setIsEdit(true)}>
                  <Edit2 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                {columns && columns.length > 1 &&
                  columns
                    .filter((c) => c._id !== job.columnId)
                    .map((col, key) => (
                      <DropdownMenuItem
                        key={key}
                        className="cursor-pointer"
                        onClick={() => handleMove(col._id)}
                      >
                        Move to {col.name}
                      </DropdownMenuItem>
                    ))}

                <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer focus:text-red-600" onClick={() => handleDelete(job._id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>




    <Dialog open={isEdit} onOpenChange={setIsEdit}>
      <DialogContent className="sm:max-w-xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Add Job Application
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleUpdate}>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                placeholder="Coffevilla"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                placeholder="Senior day dreamer"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Heaven"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                placeholder="50000"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              name="jobUrl"
              placeholder="https://"
              value={formData.jobUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="React, Tailwind, Next.js"
              value={formData.tags}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description of the role..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEdit(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}