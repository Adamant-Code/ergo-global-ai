"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Button from "../Button/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import { EmailInput } from "../EmailInput/EmailInput";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import { parseError } from "@/lib/errors";
import { useError } from "@/hooks/useError";

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const { setError } = useError();

  // Using Formik with Zod schema validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    // Convert Zod schema to Formik validation schema
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await register(values.email, values.password);
        router.push("/dashboard");
      } catch (err) {
        // Handle JSON error format
        if (err instanceof Error) {
          try {
            if (
              err.message.startsWith("[") ||
              err.message.startsWith("{")
            ) {
              const parsedError = JSON.parse(err.message);

              if (Array.isArray(parsedError)) {
                const newErrors: Record<string, string> = {};

                parsedError.forEach((error) => {
                  if (
                    error.path &&
                    error.path.length > 0 &&
                    error.message
                  ) {
                    const fieldName =
                      error.path[error.path.length - 1];
                    newErrors[fieldName] = error.message;
                  }
                });

                if (Object.keys(newErrors).length > 0) {
                  setErrors(newErrors);
                  return;
                }
              }
            }
          } catch (jsonError) {
            const errorMessage =
              "Registration failed. Please try again.";
            setError(parseError(jsonError, errorMessage));
          }
        }

        // Default error handling
        setErrors({
          ...(formik.errors.password && {
            email: formik.errors.password,
          }),
          ...(formik.errors.confirmPassword && {
            email: formik.errors.confirmPassword,
          }),
          ...(formik.errors.email && { email: formik.errors.email }),
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-serif text-center text-gray-800">
          Create an Account
        </h1>
        <p className="text-gray-500 text-center mt-3">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form
        noValidate
        onSubmit={formik.handleSubmit}
        className="p-8 space-y-6"
      >
        {((formik.errors.email &&
          formik.touched.email &&
          formik.values.email !== "") ||
          (formik.errors.password &&
            formik.touched.password &&
            formik.values.password !== "") ||
          (formik.errors.confirmPassword &&
            formik.touched.confirmPassword &&
            formik.values.confirmPassword !== "")) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">
              {(formik.errors.email &&
                `Email: ${formik.errors.email}`) ||
                (formik.errors.password &&
                  `Password: ${formik.errors.password}`) ||
                (formik.errors.confirmPassword &&
                  `Confirm Password: ${formik.errors.confirmPassword}`)}
            </p>
          </div>
        )}

        <div>
          <EmailInput
            required
            name="email"
            label="Email Address"
            disabled={formik.isSubmitting}
            error={
              formik.touched.email ? formik.errors.email : undefined
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            emailValue={formik.values.email}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <PasswordInput
            required
            id="password"
            name="password"
            label="Password"
            disabled={formik.isSubmitting}
            placeholder="password"
            error={
              formik.touched.password
                ? formik.errors.password
                : undefined
            }
            value={formik.values.password}
            passwordValue={formik.values.password}
            handlePasswordChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>

        <div>
          <PasswordInput
            required
            confirmPassword
            disabled={formik.isSubmitting}
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="confirm password"
            error={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
            value={formik.values.confirmPassword}
            handlePasswordChange={formik.handleChange}
            onBlur={formik.handleBlur}
            passwordValue={formik.values.confirmPassword}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            ? "Creating account..."
            : "Create account"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
