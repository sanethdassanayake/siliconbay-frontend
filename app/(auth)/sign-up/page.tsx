"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

// Zod schema for form validation
const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

// Utility function to split full name into first and last names
const splitName = (
  fullName: string
): { firstName: string; lastName: string } => {
  const trimmedName = fullName.trim();
  const nameParts = trimmedName.split(/\s+/);

  if (nameParts.length === 0) {
    return { firstName: "", lastName: "" };
  } else if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: "" };
  } else {
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    return { firstName, lastName };
  }
};

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    setIsLoading(true);

    try {
      const { firstName, lastName } = splitName(data.name);

      const payload = {
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.status !== true) {
        throw new Error(responseData.message || "Failed to create account");
      }

      console.log("Account succesfully created!");

      router.push(`/verify?email=${encodeURIComponent(data.email)}`);

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
          <h2 className="text-xl font-medium">Create your account</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600">
          By signing up, you agree to SiliconBay&apos;s{" "}
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
          <span className="font-bold text-sm">Already have an account?</span>
          <Link
            href="/sign-in"
            className="text-sm text-blue-600 hover:underline"
          >
            Sign in to your account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
