// create: Hàm khởi tạo store từ Zustand
import { create } from "zustand";
// Kiểu dữ liệu Subscription đã viết ở Giai đoạn 4
import { Subscription } from "../types/subscription";
// Dữ liệu mẫu ban đầu
import { mockSubscriptions } from "../constants/mockData";

// Định nghĩa kiểu dữ liệu cho toàn bộ State và Actions trong Store
interface SubscriptionState {
  // 1. STATE (Dữ liệu lưu trữ)
  subscriptions: Subscription[];

  // 2. ACTIONS (Các hàm thay đổi dữ liệu)
  // Hàm thêm gói mới: nhận vào 1 gói và chèn vào store
  addSubscription: (newSub: Subscription) => void;
  // Hàm xóa gói: nhận vào id của gói muốn xóa
  deleteSubscription: (id: string) => void;
}

// Khởi tạo custom hook useSubscriptionStore
export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  // Khởi tạo state ban đầu bằng dữ liệu mẫu
  subscriptions: mockSubscriptions,

  // Action thêm gói mới: đưa gói mới lên ĐẦU mảng (unshift pattern)
  addSubscription: (newSub) =>
    set((state) => ({
      subscriptions: [newSub, ...state.subscriptions],
    })),

  // Action xóa gói: lọc bỏ phần tử có id trùng khớp
  deleteSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
    })),
}));
