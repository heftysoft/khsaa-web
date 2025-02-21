import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, GraduationCap, Users2, Trophy } from "lucide-react";
import { db } from "@/lib/db";

async function getCommitteeMembers() {
  const members = await db.committee.findMany({
    orderBy: {
      order: "asc",
    },
  });
  return members;
}

export default async function AboutPage() {
  const members = await getCommitteeMembers();

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[300px] w-full">
        <Image
          src="/images/about-banner.jpg"
          alt="About Us Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            About Us
          </h1>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">3,000+</h3>
            <p className="text-muted-foreground">Alumni</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">50+</h3>
            <p className="text-muted-foreground">Awards Won</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CalendarDays className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">100+</h3>
            <p className="text-muted-foreground">Events</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Users2 className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-2">200+</h3>
            <p className="text-muted-foreground">Active Members</p>
          </div>
        </div>
      </div>

      {/* ESTD Section */}
      <div className="container mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] overflow-hidden">
            <Image
              src="/images/alumni-history.jpg"
              alt="Historical Alumni Gathering"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                ESTD of This Alumni Association
              </h2>
              <span className="text-6xl md:text-8xl font-bold text-primary/20">
                2023
              </span>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <p>
                Since its establishment in 2023, the Kurchhap High School Alumni
                Association has been a cornerstone of our educational community,
                fostering connections that span generations.
              </p>
              <p>
                A meeting was organized under the leadership of Honorable Alhaj
                Samiul Ahsan Bhuiyan, founder and president of the Managing
                Committee of Kurchap High School, at the call of former student
                Jahirul Islam (Batch 2007). Former students Mohammad Jahangir
                Alam (Batch 1984), Golam Mostafa (Batch 1984), Jahangir Alam
                (Batch 1991), Kamruzzaman Kamrun (Batch 1992), Mahbubur Rahman
                Bhuiyan (Batch 1997), Anisuzzaman Khan (Batch 2005), and Jahirul
                Islam (Batch 2007) were present in the meeting. They highlight
                necessity and importance. The former students and Founder agreed
                to form an Alumni Association in the name of Kurchhap High
                School Alumni Association. In the discussion meeting, the
                initiative to form an alumni association comprising the former
                students of Kurchap High School was taken to the final stage.
              </p>
              <p>
                Our Association has grown from a small group of dedicated
                graduates to a thriving community of thousands, united by their
                shared experiences and commitment to supporting future
                generations.
              </p>
              <p>
                Through nearly two years of service, we have maintained our
                founding principles of excellence, community, and educational
                advancement while adapting to meet the evolving needs of our
                alumni and current students.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="container mx-auto py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-baseline gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Our First Achievement in History
              </h2>
              <span className="text-6xl md:text-8xl font-bold text-primary/20">
                2012
              </span>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <p>
                In 2012, Kurchhap High School marked a significant milestone in
                its history with the establishment of its first formal alumni
                gathering, bringing together graduates from across different
                generations.
              </p>
              <p>
              This historic event laid the foundation for what would become a tradition of annual reunions, fostering lasting connections between alumni and strengthening our school’s community bonds.
              </p>
              <p>
              This reunions arrange our senior ex-student community, Then we were inspired to establish our Alumni Association.
              </p>
              <p>
              The success of this initial gathering demonstrated the strong sense of belonging and pride that our alumni felt towards their alma mater, setting the stage for decades of continued growth and achievement.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden order-1 md:order-2">
            <Image
              src="/images/first-achievement.jpg"
              alt="First Alumni Achievement"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/images/about-content.jpg"
              alt="About KHSAA"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-primary font-semibold mb-4">
              WELCOME TO KHSAA
            </h4>
            <h2 className="text-3xl font-bold mb-6">
              We Are The Largest Alumni Association Since 2023
            </h2>
            <p className="text-muted-foreground mb-6">
              The Kurchhap High School Alumni Association (KHSAA) has been
              fostering connections between graduates for over three decades.
              Our commitment to excellence and community building has made us
              one of the most active alumni networks in the region.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">
                  Supporting student scholarships and educational programs
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">
                  Organizing networking events and professional development
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">
                  Preserving and celebrating school history and traditions
                </p>
              </div>
            </div>
            <Button size="lg" asChild>
              <Link href="/register">Join Us Today</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h4 className="text-primary font-semibold mb-4">OUR MISSION</h4>
            <h2 className="text-3xl font-bold mb-6">What We Stand For</h2>
            <p className="text-muted-foreground">
              Our mission is to create a strong, supportive community that
              benefits both alumni and current students while preserving the
              legacy of our institution.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-4">Community Building</h3>
              <p className="text-muted-foreground">
                Creating lasting connections between alumni through networking
                events and reunions.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-4">Education Support</h3>
              <p className="text-muted-foreground">
                Providing scholarships and resources for current and future
                students.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-4">Legacy Preservation</h3>
              <p className="text-muted-foreground">
                Maintaining and celebrating our school&apos;s rich history and
                achievements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Committee Section */}
      <div className="container mx-auto py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Honorable Committee</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated individuals who lead and guide our alumni
            association
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.length > 0
            ? members.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative h-[300px] mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="bg-primary text-primary-foreground py-4 px-6 rounded-lg">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-primary-foreground/80">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative h-[400px]">
        <Image
          src="/images/cta-background.jpg"
          alt="Join KHSAA"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Growing Alumni Community
            </h2>
            <p className="text-lg mb-8 text-gray-200">
              Connect with fellow alumni, access exclusive benefits, and help
              shape the future of our institution.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Become a Member</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
