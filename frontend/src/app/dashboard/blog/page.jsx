import { DeleteBlogButton } from "@/components/blog/blog-delete-button";
import { EditBlogButton } from "@/components/blog/blog-edit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageQueryPegination,
  parsePageParams,
} from "@/components/ui/page-query-pegination";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  console.log(searchParams);

  // const page = parsePageParams((await searchParams).page);
  // const total = await Blog.countDocuments({
  //   where: { createdById: User.id },
  // });
  // const itemPerPage = 10;

  // const blogs = await Blog.find({ createdById: user._id })
  //   .populate("createdById") // শুধু name + email আনবে
  //   .sort({ createdAt: -1 });

  // if (blogs.length < 1) {
  //   return (
  <main className="flex justify-center items-center h-full">
    <div className="flex flex-col items-center gap-2">
      <div>No Blog found!</div>
      <Button asChild>
        <Link href={"/dashboard/blog/add"}>Add Blog</Link>
      </Button>
    </div>
  </main>;
  //   );
  // }

  return (
    <main className="m-5">
      <div className="flex justify-end mb-5">
        <Button asChild>
          <Link href={"/dashboard/blog/add"}>Add Blog</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {/* {blogs.map((blog) => {
          return ( */}
        <Card key={`AdminItemCard-${"blog.id"}`}>
          <CardHeader>
            <CardTitle>Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              Id: <span>{"blog.id"}</span>
            </div>
            <div>
              slug: <span>{"blog.slug"}</span>
            </div>
            <div>
              category: <span>{"blog.category"}</span>
            </div>
            <div>
              title: <span>{"blog.title"}</span>
            </div>
            <div>
              thumbnail: <span>{"blog.thumbnail"}</span>
            </div>
            {/* <div>
                  image: <span>{blog.image}</span>
                </div> */}
            <div>
              description: <span>{"blog.description"}</span>
            </div>
            {/* <div>
                  details: <span>{blog.details}</span>
                </div> */}
            <div>
              comment: <span>{"blog.comment"}</span>
            </div>
            <div>
              like: <span>{"blog.like"}</span>
            </div>
            <div>
              dislike: <span>{"blog.dislike"}</span>
            </div>
            {/* {blog.tags.map((e, i) => {
                  return (
                    <div key={i}>
                      Tags: <span>{e}</span>
                    </div>
                  );
                })} */}
            {/* {blog.relatedBlogs.map((e, i) => {
                  return (
                    <div key={i}>
                      relatedBlogs: <span>{e.id}</span>
                    </div>
                  ); */}
            {/* })} */}
            <div>
              createdBy:
              <span>
                A
                {/* {blog.createdById?.firstName + " " + blog.createdById?.lastName} */}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-5 justify-start items-center">
            <Button variant={"outline"} asChild>
              <Link href={`/dashboard/blog/${"blog.id"}`}>View</Link>
            </Button>
            <EditBlogButton blogId={"blog.id"} />

            <DeleteBlogButton blogName={"blog.category"} blogId={"blog.id"} />
          </CardFooter>
        </Card>
        {/* );
        })} */}
      </div>
      {/* <PageQueryPegination
        currentPage={page}
        totalResult={total}
        itemPerPage={itemPerPage}
      /> */}
    </main>
  );
}
