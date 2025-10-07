import { plans } from "./constants";
import React, { memo, SetStateAction } from "react";
import SubscriptionPlanCard from "./SubscriptionPlanCard";

const SubscriptionPlan = memo(
  ({
    setSelectedPriceId,
  }: {
    setSelectedPriceId: (
      value: SetStateAction<{
        amount: number;
        priceId: string;
      } | null>
    ) => void;
  }) => {
    return (
      <>
        <p className="text-center text-gray-600 mb-8">
          You do not have an active subscription. Choose a plan to get
          started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <SubscriptionPlanCard
              plan={plan}
              key={plan.priceId}
              isSelected={false}
              isProcessing={false}
              onSelectPlan={({
                amount,
                priceId,
              }: {
                amount: number;
                priceId: string;
              }) => {
                setSelectedPriceId({ priceId, amount });
              }}
            />
          ))}
        </div>
      </>
    );
  }
);

SubscriptionPlan.displayName = "SubscriptionPlan";

export default SubscriptionPlan;
