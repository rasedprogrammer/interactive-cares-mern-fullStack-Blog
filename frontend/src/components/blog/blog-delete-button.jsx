"use client";

// import { deleteBlog } from "@/actions/blog/blog-action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

export function DeleteBlogButton({ blogName, blogId, deleteRedirectUrl }) {
  const [open, setOpen] = useState(false);

  async function submitDeleteForm() {
    await deleteBlog({
      blogId: blogId,
      deleteRedirectUrl: deleteRedirectUrl,
    });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the Blog {blogName}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <form action={submitDeleteForm}>
            <DeleteButton />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" type="submit" disabled={pending}>
      {pending && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
      Delete
    </Button>
  );
}
