import { ROUTES } from "@/lib/constants";
import { extractErrorMessage } from "@/lib/errors";
import { registerSchema, type RegisterSchema } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { FormFieldWrapper } from "./FormFieldWrapper";

const RegistrationForm = () => {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      await register(values);
      navigate({ to: ROUTES.DASHBOARD });
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        "Registration failed. Please try again"
      );
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border p-4 rounded-md">
      <CardHeader>
        <CardTitle className="text-center">Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldWrapper
              control={form.control}
              name="name"
              label="Name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
            />
            <FormFieldWrapper
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
            />
            <FormFieldWrapper
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="password"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
