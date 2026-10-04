import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Explore courses" };

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, description, price_paise, status")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Explore Dropcourses</h1>
      <p className="mt-2 text-muted-foreground">
        Learn from student creators across India.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((course) => (
          <Link key={course.id} href={`/courses/${course.slug}`}>
            <Card className="h-full border-white/10 bg-glass-panel transition hover:border-infly-electric/40">
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {course.description}
                </p>
                <p className="mt-4 font-semibold">
                  {course.price_paise === 0
                    ? "Free"
                    : formatINR(course.price_paise)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!courses?.length && (
          <p className="text-muted-foreground col-span-full">
            No published courses yet. Be the first creator.
          </p>
        )}
      </div>
    </div>
  );
}
