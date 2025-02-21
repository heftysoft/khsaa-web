"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("from") ?? "/dashboard";
  const registered = searchParams.get("registered");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!result?.error) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl: callbackUrl,
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  return (
    <>
      <Card className="w-[400px] border-none shadow-lg">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your alumni account</CardDescription>
        </CardHeader>
        <CardContent>
          {registered && (
            <Alert className="mb-4 bg-green-50">
              <AlertDescription>
                Registration successful! Please sign in.
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mb-4 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mb-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("google")}
            >
              Continue with Google
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("facebook")}
            >
              Continue with Facebook
            </Button> */}
          </div>
        </CardContent>
      </Card>
      <Card className="w-[400px] mt-4">
        <CardContent className="p-2">
          <div className="flex items-center justify-center gap-2">
            <CardDescription>Don&apos;t have an account?</CardDescription>
            <Link type="button" className="text-sm" href="/register">
              Register →
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
