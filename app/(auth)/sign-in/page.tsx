"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setIsLoading(true);

    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.status) {
        toast.error(responseData.message || "Sign-in failed");
        return;
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      toast.success("Signed in successfully!");

      router.replace(returnTo);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Account creation failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mb-8 rounded-lg border-0 sm:border shadow-none">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-medium">Sign in to your account</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full mt-2 rounded-full bg-amber-600 hover:bg-amber-700"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600">
          By signing in, you agree to SiliconBay&apos;s{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>

      <CardFooter>
        <div className="grid border-t pt-4 w-full gap-2">
          <span className="font-bold text-sm">New to SiliconBay?</span>
          <Link
            href="/sign-up"
            className="text-sm text-blue-600 hover:underline"
          >
            Create a free account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
