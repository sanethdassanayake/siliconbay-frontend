"use client";

import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter, useSearchParams } from "next/navigation";
import { AlertOctagon, LoaderCircle } from "lucide-react";

type VerifyPayload = {
  email: string;
  verificationCode: string;
};

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
});

type VerificationValues = z.infer<typeof verificationSchema>;

const VerifyCodeContent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const verificationCode = searchParams.get("verificationCode");

  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: verificationCode || "",
    },
  });

  if (!email) {
    return (
      <div className="p-4 h-64 w-md flex flex-col items-center space-y-4">
        <div className="flex justify-center items-center gap-2 border border-red-500 rounded-2xl text-red-500 p-4">
          <AlertOctagon />
          <h2 className="text-xl font-medium">Invalid Access</h2>
        </div>

        <p className="text-gray-500 text-center">
          Something missing in parameters. Please check your email box and use
          the link provided there to access
        </p>

        <p className="text-gray-500 text-center">
          If you believe this is a mistake, please contact{" "}
          <Link href={"#"} className="text-blue-600">
            support
          </Link>
          .
        </p>
      </div>
    );
  }

  const onSubmit = async (data: VerificationValues) => {
    setIsLoading(true);

    try {
      const payload: VerifyPayload = {
        email: email || "",
        verificationCode: data.code,
      };

      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Verification failed");
      }

      console.log("Verification Successful!");
      router.push("/sign-in");
    } catch (error) {
      console.error("Verification Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mb-8 rounded-lg border-0 sm:border shadow-none">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-medium">Enter Verification Code</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          We sent a 6-digit verification code to your email.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
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
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600">
          Didn’t get the code?{" "}
          <button className="text-blue-600 hover:underline" type="button">
            Resend
          </button>
        </p>
      </CardContent>

      <CardFooter>
        <div className="grid border-t pt-4 w-full gap-2">
          <Link
            href="/sign-in"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function VerifyCode() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center p-8">
          <LoaderCircle className="animate-spin h-8 w-8 text-amber-600 mb-2" />
          <p className="text-sm text-gray-500">Loading verification...</p>
        </div>
      }
    >
      <VerifyCodeContent />
    </Suspense>
  );
}