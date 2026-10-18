import { Subscription } from "../types/subscription";
export const mockUser = {
  name: "Khang Dev",
  email: "khang@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
};

export const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    price: 15.99,
    currency: "USD",
    billingPeriod: "monthly",
    category: "Entertainment",
    status: "active",
    renewalDate: "2026-10-18", // Sắp đến hạn
    color: "#E50914",
    iconName: "film-outline",
  },
  {
    id: "2",
    name: "Spotify Premium",
    price: 10.99,
    currency: "USD",
    billingPeriod: "monthly",
    category: "Music",
    status: "active",
    renewalDate: "2026-10-21",
    color: "#1DB954",
    iconName: "musical-notes-outline",
  },
  {
    id: "3",
    name: "ChatGPT Plus",
    price: 20.0,
    currency: "USD",
    billingPeriod: "monthly",
    category: "Productivity",
    status: "active",
    renewalDate: "2026-11-05",
    color: "#10A37F",
    iconName: "bulb-outline",
  },
  {
    id: "4",
    name: "iCloud 2TB",
    price: 9.99,
    currency: "USD",
    billingPeriod: "monthly",
    category: "Cloud Storage",
    status: "active",
    renewalDate: "2026-11-12",
    color: "#007AFF",
    iconName: "cloud-outline",
  },
];
