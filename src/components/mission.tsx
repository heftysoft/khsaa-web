import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Mission = () => {
  return (
    <section className="container mx-auto py-16">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-primary/5 -skew-y-6 transform origin-top-left rounded-3xl" />

        <div className="relative grid md:grid-cols-2 gap-8 items-center p-8">
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/images/mission.jpg"
              alt="Our Mission"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our mission is to foster lifelong connections among alumni,
                support current students, and strengthen the bond between
                graduates and their alma mater through meaningful engagement and
                collaborative initiatives.
              </p>
              <p>
                We strive to create a vibrant community that promotes
                professional growth, facilitates networking opportunities, and
                contributes to the continued success of our institution and its
                alumni.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/about">Know More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
