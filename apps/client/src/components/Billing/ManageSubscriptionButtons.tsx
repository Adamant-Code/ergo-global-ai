"use client";

import { useCallback, useState } from "react";
import { ManageSubscriptionButtonsProps } from "./types";
import Button from "../Button/Button";

export default function ManageSubscriptionButtons({
  subscription,
  onManage,
}: ManageSubscriptionButtonsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const isBasic =
    subscription.stripe_price_id ===
    process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID;
  const isPremium =
    subscription.stripe_price_id ===
    process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID;

  const handleAction = useCallback(
    async (action: () => Promise<void>) => {
      setIsProcessing(true);
      await action();
      setIsProcessing(false);
    },
    []
  );

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 border rounded-lg shadow-lg bg-white text-center">
      <h2 className="text-2xl font-bold mb-2">Your Current Plan</h2>
      <p className="text-xl font-semibold capitalize text-blue-600 mb-6">
        {isBasic ? "Basic" : isPremium ? "Premium" : "Unknown"}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          type="submit"
          disabled={isProcessing}
          onClick={() => handleAction(onManage)}
        >
          {isProcessing
            ? "Redirecting..."
            : "Manage Billing & Invoices"}
        </Button>
        {/* <button
          onClick={() => handleAction(onManage)}
          disabled={isProcessing}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
        >
          {isProcessing
            ? "Redirecting..."
            : "Manage Billing & Invoices"}
        </button> */}
      </div>
    </div>
  );
}
