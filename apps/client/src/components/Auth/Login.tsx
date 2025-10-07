"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Button from "../Button/Button";
import { useAuth } from "@/hooks/useAuth";
import { parseError } from "@/lib/errors";
import { useRouter } from "next/navigation";
import { useError } from "@/hooks/useError";
import { EmailInput } from "../EmailInput/EmailInput";
import { loginSchema } from "@request-response/types";
import { PasswordInput } from "../PasswordInput/PasswordInput";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { setError } = useError();

  // Using Formik with Zod schema validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    // Convert Zod schema to Formik validation schema
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email, values.password);
        router.push("/dashboard");
      } catch (err) {
        setErrors({
          ...(formik.errors.password && {
            email: formik.errors.password,
          }),
          ...(formik.errors.email && { email: formik.errors.email }),
        });
        setError(parseError(err));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-serif text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mt-3">
          Sign in to access your account or{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 font-medium"
          >
            create a new account
          </Link>
        </p>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="p-8 space-y-6"
        noValidate
      >
        {(formik.errors.email || formik.errors.password) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">
              {formik.errors.email || formik.errors.password}
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
            error={
              formik.touched.password
                ? formik.errors.password
                : undefined
            }
            value={formik.values.password}
            passwordValue={formik.values.password}
            placeholder="Enter your password"
            handlePasswordChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
