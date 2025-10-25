import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EditBlogButton({ blogId }) {
  return (
    <Button asChild>
      <Link href={`/dashboard/blog/edit-blog?id=${blogId}`}>Edit</Link>
    </Button>
  );
}
