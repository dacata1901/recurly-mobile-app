import { create } from "zustand";

// Định nghĩa thông tin của 1 người dùng (User)
export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

// Định nghĩa các dữ liệu và hành động trong Kho xác thực (Auth Store)
interface AuthState {
  isSignedIn: boolean; // Người dùng đã đăng nhập hay chưa?
  user: UserProfile | null; // Thông tin người dùng hiện tại
  // Hàm đăng nhập
  signIn: (email: string, name?: string) => void;
  // Hàm đăng xuất
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Mặc định cho phép vào thẳng hoặc bắt đăng nhập (ta để true ban đầu hoặc test đăng xuất)
  isSignedIn: true,
  user: {
    name: "Khang Dev",
    email: "khang@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  },

  // Khi đăng nhập thành công: bật isSignedIn = true và lưu thông tin user
  signIn: (email, name) =>
    set({
      isSignedIn: true,
      user: {
        // Nếu người dùng không nhập tên (lúc Sign In), tự lấy phần trước chữ @ của email làm tên
        name: name || email.split("@")[0],
        email: email,
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      },
    }),

  // Khi bấm Đăng xuất: đưa isSignedIn về false và xóa thông tin user
  signOut: () =>
    set({
      isSignedIn: false,
      user: null,
    }),
}));
