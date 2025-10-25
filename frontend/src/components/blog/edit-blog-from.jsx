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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
// import { editBlog } from "@/actions/blog-action";
// import { ArrayAddForm, ArrayAddFormRef } from "../showcase/array-add-add-form";
import { useRef } from "react";
import { editBlog } from "@/actions/blog/blog-action";
// import {
//   ImageSeletor,
//   ImageSeletorRef,
// } from "@/components/imagefrom/image-seletor";

const formSchema = z.object({
  slug: z
    .string({ required_error: "Please enter slug" })
    .min(1, { message: "Please enter slug" }),
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
  // details: z
  //   .string({ required_error: "Please enter details" })
  //   .min(1, { message: "Please enter details" }),
  // views: z.coerce
  //   .number({ required_error: "Please enter views" })
  //   .min(1, { message: "Please enter views" }),
  // comment: z.coerce
  //   .number({ required_error: "Please enter comment" })
  //   .min(1, { message: "Please enter comment" }),
});

export function EditBlogForm({ data, blogId }) {
  // const imagesAddFormRef = useRef  ;
  // const thumbnailimageAddFormRef = useRef;
  // const tagsAddFormRef = useRef < ArrayAddFormRef > null;
  // const relatedAddFormRef = useRef < ArrayAddFormRef > null;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: data.slug,
      category: data.category,
      title: data.title,
      thumbnail: data.thumbnail,
      description: data.description,
      // details: data.details,
      // views: data.views,
      // comment: data.comment,
    },
  });

  async function onSubmit(values) {
    // const thumbnail = thumbnailimageAddFormRef.current?.selectedImages[0]!;
    // const image = imagesAddFormRef.current?.selectedImages[0]!;
    // const tagsItems = tagsAddFormRef.current?.items;
    // const relatedItems = relatedAddFormRef.current?.items;
    // console.log(values);

    await editBlog(blogId, values);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Card className="max-w-[900px] w-full m-5">
        <CardHeader>
          <CardTitle className="text-2xl">Edit blog</CardTitle>
          <CardDescription>Edit a blog info</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>slug</FormLabel>
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

              {/* <ImageSeletor
                defaultImag={[thumbnail]}
                ref={thumbnailimageAddFormRef}
                multiselects={false}
                label={"thumbnail"}
              />

              <ImageSeletor
                defaultImag={[image]}
                ref={imagesAddFormRef}
                multiselects={false}
                label={"image"}
              /> */}

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

              {/* <FormField
                control={form.control}
                name="views"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>views</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="views" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>comment</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="comment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <ArrayAddForm
                defaultItems={tags}
                ref={tagsAddFormRef}
                label="tags"
              />
              <ArrayAddForm
                defaultItems={related}
                ref={relatedAddFormRef}
                label="related"
              /> */}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <RotateCw className="animate-spin" />} Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
