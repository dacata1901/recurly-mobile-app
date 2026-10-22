# 📱 Recurly — Subscription & Recurring Expense Tracker

Ứng dụng di động đa nền tảng (iOS & Android) giúp người dùng theo dõi, phân tích và quản lý các gói đăng ký dịch vụ định kỳ (Netflix, Spotify, ChatGPT, iCloud...) theo thời gian thực.

🔗 **Tải trực tiếp bản cài đặt Android (.APK):** [Download Recurly APK (Expo EAS Cloud)](https://expo.dev/artifacts/eas/ykNsozh4R7ORkQzxsmcIse0L3Z6cHGn9O3Ae-ZKaWkc.apk)

---

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Core Framework:** React Native & Expo (SDK 54+)
- **Ngôn ngữ:** TypeScript (Strict Mode & Typed Routes)
- **Điều hướng (Navigation):** Expo Router (File-based Routing, Route Groups, Dynamic Routes)
- **Styling & UI:** NativeWind (Tailwind CSS cho React Native), Ionicons
- **State Management:** Zustand (Global Store đồng bộ thời gian thực)
- **Authentication & Bảo mật:** Clerk (`@clerk/clerk-expo`), Xác thực OTP 2 lớp qua Email, lưu trữ phiên đăng nhập mã hóa bằng `expo-secure-store`
- **Cloud Build & Deployment:** Expo Application Services (EAS Build)

---

## ✨ Tính năng nổi bật (Key Features)

1. **Xác thực người dùng & Bảo vệ Route (Authentication & Auth Guard):**
   - Đăng ký tài khoản kèm xác thực mã OTP 6 chữ số gửi trực tiếp qua Email.
   - Tự động duy trì phiên đăng nhập an toàn trên thiết bị bằng phần cứng mã hóa (`SecureStore`).
   - Cơ chế `Redirect` bảo vệ các màn hình bên trong nhóm `(tabs)` khi chưa đăng nhập.

2. **Bảng điều khiển thông minh (Home Dashboard):**
   - Tự động tính tổng chi tiêu hàng tháng và số lượng dịch vụ đang hoạt động.
   - Danh sách cuộn ngang hiển thị các gói sắp đến hạn thanh toán.
   - Danh sách gói đăng ký hỗ trợ đóng/mở chi tiết (Expandable Cards) và tối ưu hóa cuộn mượt 60 FPS với `ListHeaderComponent`.

3. **Tìm kiếm, Lọc & Quản lý Gói đăng ký (Subscriptions Management):**
   - Tìm kiếm tức thì theo tên dịch vụ và bộ lọc theo danh mục (`Entertainment`, `Music`, `Productivity`, `Cloud Storage`).
   - Thêm gói dịch vụ mới qua Slide-up Modal có kiểm tra dữ liệu đầu vào (Validation) và tự động tính ngày gia hạn kế tiếp.
   - Xem trang chi tiết từng gói qua Dynamic Route (`/subscriptions/[id]`) và xóa gói dịch vụ.

4. **Phân tích Tài chính (Financial Insights):**
   - Thống kê chi phí trung bình mỗi tháng và ước tính tổng chi tiêu cả năm.
   - Tự động xác định gói dịch vụ tiêu tốn nhiều chi phí nhất.
   - Biểu đồ thanh tiến trình (Progress Bar) trực quan hóa tỷ trọng chi tiêu (%) theo từng danh mục.

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
├── app/
│   ├── _layout.tsx                # Root Layout & Cấu hình ClerkProvider + SecureStore
│   ├── (auth)/                    # Route Group: Luồng xác thực người dùng
│   │   ├── _layout.tsx            # Auth Guard cho màn hình đăng nhập/đăng ký
│   │   ├── sign-in.tsx            # Màn hình Đăng nhập
│   │   └── sign-up.tsx            # Màn hình Đăng ký & Xác thực Email OTP
│   └── (tabs)/                    # Route Group: Các màn hình chính có Bottom Tab Bar
│       ├── _layout.tsx            # Cấu hình Bottom Tabs & Protected Route Guard
│       ├── index.tsx              # Màn hình Home Dashboard
│       ├── subscriptions.tsx      # Màn hình Tìm kiếm & Lọc theo danh mục
│       ├── insights.tsx           # Màn hình Phân tích & Thống kê tài chính
│       ├── settings.tsx           # Màn hình Hồ sơ người dùng & Đăng xuất
│       └── subscriptions/
│           └── [id].tsx           # Dynamic Route: Chi tiết từng gói đăng ký
├── components/
│   ├── SubscriptionCard.tsx       # Thẻ hiển thị gói dịch vụ (Expandable Card)
│   └── CreateSubscriptionModal.tsx# Modal trượt lên để tạo gói đăng ký mới
├── store/
│   └── useSubscriptionStore.ts    # Kho quản lý State toàn cục bằng Zustand
├── constants/
│   └── mockData.ts                # Dữ liệu khởi tạo mẫu
├── lib/
│   ├── utils.ts                   # Hàm tiện ích định dạng tiền tệ (Intl.NumberFormat)
│   └── analytics.ts               # Bộ ghi nhận sự kiện người dùng (Product Analytics)
└── types/
    └── subscription.ts            # Định nghĩa kiểu dữ liệu TypeScript
```

---

## 🛠️ Hướng dẫn cài đặt và chạy dự án (Getting Started)

### 1. Cài đặt thư viện

```bash
npm install
```

### 2. Cấu hình biến môi trường (`.env`)

Tạo file `.env` ở thư mục gốc và thêm khóa Publishable Key từ [Clerk Dashboard](https://clerk.com):

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
```

### 3. Khởi chạy ứng dụng

```bash
npx expo start --clear
```

- Nhấn `a` để mở trên Android Emulator.
- Nhấn `w` để mở trên trình duyệt Web.
- Hoặc quét mã QR bằng ứng dụng **Expo Go** trên điện thoại thực tế.
