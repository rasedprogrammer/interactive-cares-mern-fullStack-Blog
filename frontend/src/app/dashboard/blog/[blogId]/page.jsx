import { DeleteBlogButton } from "@/components/blog/blog-delete-button";
import { EditBlogButton } from "@/components/blog/blog-edit-button";
import { BlogNotFound } from "@/components/blog/blog-not-found";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Page({ params }) {
  const { blogId } = await params;
  console.log(blogId);

  // await connectMongoDB();
  // const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/singin");
  // }

  // //   console.log(params);

  // const blog = await Blog.findOne({ _id: blogId }).populate("createdById");

  // // console.log(blog);

  // if (!blog) {
  //   return <BlogNotFound />;
  // }

  return (
    <main className="m-5">
      <div className="flex flex-col gap-2">
        <Card key={`AdminItemCard-${blog.id}`}>
          <CardHeader>
            <CardTitle>Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              Id: <span>{blog.id}</span>
            </div>
            <div>
              slag: <span>{blog.slug}</span>
            </div>
            <div>
              category: <span>{blog.category}</span>
            </div>
            <div>
              title: <span>{blog.title}</span>
            </div>
            <div>
              thumbnail: <span>{blog.thumbnail}</span>
            </div>
            {/* <div>
              image: <span>{blog.image}</span>
            </div> */}
            <div>
              description: <span>{blog.description}</span>
            </div>
            <div>
              details: <span>{blog.details}</span>
            </div>
            <div>
              comment: <span>{blog.comment}</span>
            </div>
            <div>
              views: <span>{blog.views}</span>
            </div>
            {/* {blog.tags.map((e, i) => {
              return (
                <div key={i}>
                  Tags: <span>{e}</span>
                </div>
              );
            })}
            {blog.relatedBlogs.map((e, i) => {
              return (
                <div key={i}>
                  relatedBlogs: <span>{e.id}</span>
                </div>
              );
            })} */}
            <div>
              createdBy:{" "}
              <span>
                {" "}
                {blog.createdById?.firstName + " " + blog.createdById?.lastName}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-5 justify-start items-center">
            <EditBlogButton blogId={blog.id} />

            <DeleteBlogButton blogName={blog.category} blogId={blog.id} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
