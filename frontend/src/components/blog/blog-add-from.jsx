"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const formSchema = z.object({
  slug: z
    .string({ required_error: "Please enter slag" })
    .min(1, { message: "Please enter slag" }),
  category: z
    .string({ required_error: "Please enter category" })
    .min(1, { message: "Please enter category" }),
  title: z
    .string({ required_error: "Please enter title" })
    .min(1, { message: "Please enter title" }),
  thumbnail: z
    .string({ required_error: "Please enter thumbnail" })
    .min(1, { message: "Please enter thumbnail" }),

  description: z
    .string({ required_error: "Please enter description" })
    .min(1, { message: "Please enter description" }),
});

export function AddBlogForm() {
  const [error, setError] = useState();
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [newBlogId, setNewBlogId] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      category: "",
      title: "",
      thumbnail: "",

      description: "",
    },
  });

  async function onSubmit(values) {
    setError(undefined);
    console.log(values);

    form.reset();
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Card className="max-w-[500px] w-full m-5">
        <CardHeader>
          <CardTitle className="text-2xl">Add Blog</CardTitle>
          <CardDescription>Add a new Blog</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>slag</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>category</FormLabel>
                    <FormControl>
                      <Input placeholder="category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>thumbnail</FormLabel>
                    <FormControl>
                      <Input placeholder="thumbnail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>description</FormLabel>
                    <FormControl>
                      <Input placeholder="description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <FormMessage>{error}</FormMessage>}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <RotateCw className="animate-spin" />} Add Blog
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={successAlertOpen} onOpenChange={setSuccessAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              You have successfully added a new Blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href={"/admin-dashboard/blog/" + newBlogId}>View</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
