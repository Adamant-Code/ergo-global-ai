import {
  GetSubscriptionResponse,
  CreateSubscriptionResponse,
  UpdateSubscriptionResponse,
  CreatePortalSessionResponse,
} from "../types";
import apiClient from "@/lib/apiClient";

export const fetchUserSubscription = async () => {
  try {
    const data = await apiClient.get<{
      subscription: GetSubscriptionResponse;
    }>(`/user/subscription`);

    return data;
  } catch (err) {
    console.error("Error fetching subscription:", err);
    throw new Error("Failed to fetch subscription");
  }
};

export const createSubscription = async (
  priceId: string,
  paymentMethodId: string
): Promise<CreateSubscriptionResponse> => {
  try {
    const resData = await apiClient.post<CreateSubscriptionResponse>(
      `/stripe/subscription/create`,
      {
        priceId,
        paymentMethodId,
      }
    );
    return resData;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to create subscription");
  }
};

export const updateSubscription = async (
  newPriceId: string
): Promise<UpdateSubscriptionResponse> => {
  try {
    const resData = await apiClient.post<UpdateSubscriptionResponse>(
      `/stripe/subscription/update`,
      { newPriceId }
    );
    return resData;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to update subscription");
  }
};

export const createPortalSession =
  async (): Promise<CreatePortalSessionResponse> => {
    try {
      const resData =
        await apiClient.post<CreatePortalSessionResponse>(
          `/stripe/portal-session/create`
        );
      return resData;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Failed to update subscription");
    }
  };
