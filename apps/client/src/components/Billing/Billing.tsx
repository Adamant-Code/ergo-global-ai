"use client";

import Loader from "../Loader/Loader";
import { getStripe } from "@/lib/stripe";
import CheckoutForm from "./CheckoutForm";
import { useError } from "@/hooks/useError";
import { GetSubscriptionResponse } from "./types";
import SubscriptionPlan from "./SubscriptionPlan";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { useState, useEffect, useCallback, useMemo } from "react";
import ManageSubscriptionButtons from "./ManageSubscriptionButtons";
import { createPortalSession, fetchUserSubscription } from "./utils";

export default function Billing() {
  const { setError } = useError();
  const [subscription, setSubscription] =
    useState<GetSubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );
  const [selectedPriceId, setSelectedPriceId] = useState<{
    amount: number;
    priceId: string;
  } | null>(null);

  const stripePromise = getStripe();

  const options: StripeElementsOptions = useMemo(
    () => ({
      mode: "payment",
      currency: "usd",
      paymentMethodCreation: "manual",
      amount: selectedPriceId?.amount || 1000,
    }),
    [selectedPriceId?.amount]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const userSub = await fetchUserSubscription();
        setSubscription(userSub.subscription);
      } catch (err) {
        setError(err);
        if (
          err !== null &&
          typeof err === "object" &&
          "message" in err &&
          typeof err.message === "string"
        ) {
          setSubscription(null);
          setErrorMessage(err.message);
        } else {
          const msg =
            "Could not fetch your subscription status. Please refresh.";
          setErrorMessage(msg);
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManageBilling = useCallback(async () => {
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      setError(err);
      const msg = "Could not redirect to billing portal.";
      if (err instanceof Error) setError(err.message || msg);
      else setError(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSubscription = useMemo(
    () =>
      subscription &&
      ["active", "trialing"].includes(subscription.status),
    [subscription]
  );

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Subscription & Billing
      </h1>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {activeSubscription ? (
        <ManageSubscriptionButtons
          subscription={{
            ...subscription,
            planId: subscription?.stripe_price_id,
          }}
          onManage={handleManageBilling}
        />
      ) : selectedPriceId ? (
        <Elements
          options={options}
          stripe={stripePromise}
        >
          <CheckoutForm
            priceId={selectedPriceId?.priceId}
            onBack={() => setSelectedPriceId(null)}
            onSubscriptionConfirmed={() => window.location.reload()}
          />
        </Elements>
      ) : (
        <SubscriptionPlan setSelectedPriceId={setSelectedPriceId} />
      )}
    </div>
  );
}
