"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import useToast from "@/hooks/useToast";
import { useError } from "@/hooks/useError";
import { CheckoutFormProps } from "./types";
import { useState, FormEvent } from "react";
import { createSubscription } from "./utils";
import Button from "../Button/Button";

export default function CheckoutForm({
  priceId,
  onBack,
  onSubscriptionConfirmed,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { setError } = useError();
  const { success, error } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setMessage(null);
    setIsProcessing(true);

    // 1. Trigger form validation and gather card details
    const { error: submitError } = await elements.submit();

    if (submitError) {
      const message =
        submitError.message || "Please check your card details.";
      setMessage(message);
      setError(message);
      setIsProcessing(false);
      return;
    }

    // 2. Create the PaymentMethod
    const { error: pmError, paymentMethod } =
      await stripe.createPaymentMethod({
        elements,
      });

    if (pmError) {
      const message =
        pmError.message || "Failed to create payment method.";
      setMessage(message);
      setError(message);
      setIsProcessing(false);
      return;
    }

    // 3. Send priceId and paymentMethod.id to your server
    try {
      const { clientSecret } = await createSubscription(
        priceId,
        paymentMethod.id
      );

      if (!clientSecret) {
        error(
          "Could not initiate payment. Please try again or contact support."
        );
        setMessage("Could not initiate payment.");
        setIsProcessing(false);
        return;
      }

      // 4. Confirm the payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret
      );

      if (confirmError) {
        const message =
          confirmError.message || "Failed to confirm payment.";
        setMessage(message);
        setError(message);
        setIsProcessing(false);
        return;
      }
      const msg = "Success! Your subscription is active.";
      success(msg);
      setMessage(msg);
      onSubscriptionConfirmed();
    } catch (error: unknown) {
      const message = "Failed to create subscription.";
      if (error instanceof Error)
        setMessage(error.message || message);
      else setMessage("An unexpected error occurred.");
      setError(error);
    }

    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg bg-white">
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to plans
      </button>
      <form
        id="payment-form"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold mb-4">
          Enter Payment Details
        </h3>
        <PaymentElement id="payment-element" />
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={isProcessing || !stripe || !elements}
        >
          {isProcessing ? "Processing..." : `Subscribe to Plan`}
        </Button>
        {/* <button
          disabled={isProcessing || !stripe || !elements}
          id="submit"
          className="w-full mt-6 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isProcessing ? "Processing..." : `Subscribe to Plan`}
        </button> */}
        {message && (
          <div
            className={`mt-2 ${
              message.startsWith("Success")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
