import { Suspense } from "react";
import ResetPassword from "@/components/Auth/ResetPassword";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  if (!searchParams.token) {
    return (
      <div className="text-center">
        <p className="text-red-600">Invalid reset token</p>
        <a
          href="/login"
          className="text-blue-600 hover:underline"
        >
          Back to login
        </a>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full mx-auto">
        <div className="w-full max-w-md mx-auto">
          <ResetPassword token={searchParams.token} />
        </div>
      </div>
    </Suspense>
  );
}
