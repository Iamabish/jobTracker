"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import createJobApplication from "@/lib/actions/jobApplication";
import { useRouter } from "next/navigation";

interface CreateJobApplicationProps {
  columnId: string;
  boardId: string;
}

const INITIAL_FORM_DATA = {
    company: "",
    position: "",
    location: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
    notes: "",
}

export default function CreateJobApplication({
  columnId,
  boardId,
}: CreateJobApplicationProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const[open, setOpen] = useState(false)

  const route = useRouter()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({
      ...formData,
      columnId,
      boardId,
    });


    const data = await createJobApplication({
        ...formData, 
        columnId, 
        boardId, 
        tags : formData.tags.split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    })


    if(!data.error) {
        console.log('data', data.data);
        
        setFormData(INITIAL_FORM_DATA)
        setOpen(false)
    }else {
        console.log('error', data.error);
    }
  
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Add Job Application
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Job Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}