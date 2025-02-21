import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="container-wrapper">
      <div className="container max-w-4xl py-16">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-4xl font-bold">
              Terms and Conditions
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Last updated: February 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                2. Membership
              </h2>
              <p className="text-muted-foreground mb-4">
                Membership is available to alumni of Kurchhap High School.
                Members must:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Provide accurate and complete information
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Maintain and update their information
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Comply with all applicable rules and policies
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                3. User Conduct
              </h2>
              <p className="text-muted-foreground mb-4">Users agree not to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Violate any applicable laws or regulations
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Impersonate any person or entity
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Interfere with the operation of the website
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Share inappropriate or offensive content
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                4. Intellectual Property
              </h2>
              <p className="text-muted-foreground">
                All content on this website is the property of KHSAA and is
                protected by copyright and other intellectual property laws.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                5. Payment Terms
              </h2>
              <p className="text-muted-foreground mb-4">Members agree to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Pay all applicable membership fees
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Provide accurate payment information
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Accept our refund and cancellation policies
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                KHSAA shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of
                the service.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                7. Changes to Terms
              </h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting to the website.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                8. Contact Information
              </h2>
              <p className="text-muted-foreground">
                For questions about these Terms and Conditions, please contact
                us at:
              </p>
              <p className="text-primary font-medium mt-2">
                Email: info@khs-aa.org
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
