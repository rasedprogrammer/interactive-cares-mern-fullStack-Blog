import { BlogNotFound } from "@/components/blog/blog-not-found";
import { EditBlogForm } from "@/components/blog/edit-blog-from";

export default async function Page({ searchParams }) {
  console.log(searchParams);

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
