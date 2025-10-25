import { BlogNotFound } from "@/components/blog/blog-not-found";
import { EditBlogForm } from "@/components/blog/edit-blog-from";

export default async function Page({ searchParams }) {
  console.log(searchParams);

  // await connectMongoDB();
  // const blogId = (await searchParams).id;
  // if (!blogId) {
  //   return <BlogNotFound />;
  // }

  // // console.log("hello" + blogId);

  // const blog = await Blog.findById(blogId);
  // // console.log("hi" + blog);

  // if (!blog) {
  //   return <BlogNotFound />;
  // }

  return (
    <main className="flex justify-center">
      <EditBlogForm
        data={{
          slug: blog.slug,
          category: blog.category,
          title: blog.title,
          description: blog.description,
          //   details: blog.details,
          //   views: blog.views,
          thumbnail: blog.thumbnail,
          // comment: blog.comment,
        }}
        blogId={blog.id}
        // tags={blog.tags}
        // thumbnail={blog.thumbnail}
        // image={blog.image}
        // related={blog.relatedBlogs.map((e) => e.id)}
      />
    </main>
  );
}
