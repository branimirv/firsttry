import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import { extractErrorMessage } from "@/lib/errors";
import { loginSchema, type LoginSchema } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFieldWrapper } from "./FormFieldWrapper";
import AuthCard from "./AuthCard";

const LoginForm = () => {
  const { isLoading, login } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
      navigate({ to: ROUTES.DASHBOARD });
      toast.success("You successfully logged in!", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        "Login failed. Please check your credentials"
      );
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <AuthCard title="Login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex items-center gap-2">
            <Checkbox
              className="cursor-pointer"
              id="remember-me"
              checked={form.watch("rememberMe") as boolean}
              onCheckedChange={(checked) => {
                form.setValue("rememberMe", checked as boolean);
              }}
            />
            <Label htmlFor="remember-me" className="cursor-pointer">
              Remember me
            </Label>
          </div>

          <div>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {form.formState.errors.root && (
            <FormMessage className="text-destructive text-sm">
              {form.formState.errors.root.message}
            </FormMessage>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
