export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: "monthly" | "yearly";
  category: string;
  status: "active" | "inactive";
  renewalDate: string; // ISO 8601 date string
  color: string; // Hex color code for UI representation
  iconName: string; // Name of the icon to represent the subscription
}
