export interface Plan {
  name: string;
  price: string;
  amount: number;
  priceId: string;
  features: string[];
}

export interface CheckoutFormProps {
  priceId: string;
  onBack: () => void;
  onSubscriptionConfirmed: () => void;
}

export interface SubscriptionPlanCardProps {
  plan: Plan;
  isSelected: boolean;
  isProcessing: boolean;
  onSelectPlan: ({ priceId: string, amount: number }) => void;
}

export interface ManageSubscriptionButtonsProps {
  subscription: ISubscription;
  onManage: () => Promise<void>;
}

export interface GetSubscriptionResponse {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  stripe_price_id: string;
  trial_end: string | null;
  current_period_end: string;
  current_period_start: string;
  stripe_subscription_id: string;
  status:
    | "active"
    | "unpaid"
    | "paused"
    | "trialing"
    | "canceled"
    | "past_due"
    | "incomplete"
    | "incomplete_expired";
}

export interface CreateSubscriptionResponse {
  status: string;
  subscriptionId: string;
  subscriptionId: string;
  clientSecret: string | null;
}

export interface UpdateSubscriptionResponse {
  success: boolean;
  message: string;
  subscription: {
    id: string;
    status: string;
    isUpgrade: boolean;
    isDowngrade: boolean;
    current_period_end: number;
  };
}

export interface CreatePortalSessionResponse {
  url: string;
}
