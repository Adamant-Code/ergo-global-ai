"use client";

import Button from "../Button/Button";
import { SubscriptionPlanCardProps } from "./types";

export default function SubscriptionPlanCard({
  plan,
  isSelected,
  onSelectPlan,
  isProcessing,
}: SubscriptionPlanCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 shadow-md bg-white ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500"
          : "border-gray-300"
      }`}
    >
      <h3 className="text-2xl font-bold text-gray-800">
        {plan.name}
      </h3>
      <p className="text-4xl font-bold my-4">
        {plan.price}
        <span className="text-lg font-normal text-gray-500">
          /month
        </span>
      </p>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center"
          >
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        type="submit"
        className="w-full"
        disabled={isProcessing}
        onClick={() =>
          onSelectPlan({ priceId: plan.priceId, amount: plan.amount })
        }
        variant={
          plan.priceId === process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID
            ? "outline"
            : "default"
        }
      >
        {isProcessing && isSelected ? "Processing..." : "Select Plan"}
      </Button>
      {/* <button
        disabled={isProcessing}
        onClick={() =>
          onSelectPlan({ priceId: plan.priceId, amount: plan.amount })
        }
        className={`w-full ${
          plan.priceId === process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID
            ? "bg-white border border-blue-700 hover:text-white"
            : "bg-blue-600 text-white"
        } py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400`}
      >
        {isProcessing && isSelected ? "Processing..." : "Select Plan"}
      </button> */}
    </div>
  );
}
