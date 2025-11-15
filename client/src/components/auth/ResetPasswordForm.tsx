import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";
import { ROUTES } from "@/lib/constants";
import { extractErrorMessage } from "@/lib/errors";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/lib/validation/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFieldWrapper } from "./FormFieldWrapper";

const ResetPasswordForm = () => {
  const { isLoading, resetPasswordWithToken } = useAuthStore();
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" });

  // get token from URL query params
  const token = (search as { token?: string })?.token || "";

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    try {
      await resetPasswordWithToken({
        token: values.token,
        password: values.password,
      });

      toast.success("Password reset successfully! You can now login.", {
        position: "top-center",
        duration: 3000,
      });

      setTimeout(() => {
        navigate({ to: ROUTES.LOGIN });
      }, 2000);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to reset password. Please try again."
      );
      form.setError("root", { message: errorMessage });
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto border p-4 rounded-md">
        <CardHeader>
          <CardTitle className="text-center">Invalid Reset Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            The reset link is invalid or missing a token.
          </p>
          <Button
            onClick={() => navigate({ to: ROUTES.FORGOT_PASSWORD })}
            className="w-full"
          >
            Request New Reset Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border p-4 rounded-md">
      <CardHeader>
        <CardTitle className="text-center">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter your new password below.
            </p>

            <FormFieldWrapper
              control={form.control}
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              autoComplete="new-password"
            />

            <FormFieldWrapper
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />

            {form.formState.errors.root && (
              <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
