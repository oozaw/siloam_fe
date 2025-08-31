"use client";

import { title } from "@/components/primitives";
import { useAuth } from "@/context/auth.context";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, LoginSchema } from "@/types";

export default function AboutPage() {
  const { register, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });
  const { login, loading } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  };

  return (
    <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col items-start justify-center gap-4 px-6 lg:px-16 text-start">
        <div className="w-full mb-6 text-start">
          <h1 className={title()}>Welcome back!</h1>
          <p className="mt-2 mb-0 text-default-600">
            Please enter your credentials to login.
          </p>
        </div>
        <Form
          className="flex flex-col w-full gap-4 md:max-w-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            {...register("email")}
            isRequired
            errorMessage="Please enter a valid email"
            isDisabled={loading}
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            radius="sm"
          />

          <Input
            {...register("password")}
            isRequired
            errorMessage="Please enter your password"
            isDisabled={loading}
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
            radius="sm"
          />
          <div className="flex gap-2">
            <Button
              color="primary"
              type="submit"
              radius="sm"
              isLoading={loading}
              isDisabled={loading}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>

      {/* Image */}
      <div className="hidden md:block">
        <Image
          removeWrapper
          src="/images/static/login-illustration.webp"
          alt="Login Illustration"
          className="object-cover w-full h-full rounded-none"
        />
      </div>
    </div>
  );
}
