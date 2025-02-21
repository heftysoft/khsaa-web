import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="container-wrapper">
      <div className="container max-w-4xl py-16">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-4xl font-bold">Privacy Policy</CardTitle>
            <CardDescription className="text-lg mt-2">
              Last updated: February 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-primary">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Name and contact information
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Educational history and achievements
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Professional information and experience
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Payment information when applicable
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Provide and maintain our services
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Process your membership applications
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Send important updates and notifications
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Improve and personalize our services
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                3. Information Sharing
              </h2>
              <p className="text-muted-foreground mb-4">
                We do not sell or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Other alumni members (with your consent)
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Service providers who assist in our operations
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Law enforcement when required by law
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                4. Data Security
              </h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                5. Your Rights
              </h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Access your personal information
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Request correction of inaccurate data
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Request deletion of your information
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Opt-out of marketing communications
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-primary">
                6. Contact Us
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
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
