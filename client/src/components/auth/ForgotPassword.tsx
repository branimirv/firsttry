import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/validation/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Form, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants";
import { extractErrorMessage } from "@/lib/errors";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Button } from "@/components/ui/button";
import AuthCard from "./AuthCard";

const ForgotPasswordForm = () => {
  const { isLoading, resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    try {
      await resetPassword(values.email);
      toast.success("Password reset email sent! Please check your inbox.", {
        position: "top-center",
        duration: 3000,
      });

      setTimeout(() => {
        navigate({ to: ROUTES.LOGIN });
      }, 2000);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "Failed to send password reset email. Please try again."
      );
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <AuthCard
      title="Forgot password"
      description={
        <p>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormFieldWrapper
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="email"
          />

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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default ForgotPasswordForm;
