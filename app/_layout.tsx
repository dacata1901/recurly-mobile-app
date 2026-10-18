import { Stack } from "expo-router";
import "../global.css";
// ClerkProvider: Bọc ngoài toàn bộ ứng dụng để mọi màn hình đều truy cập được thông tin đăng nhập
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Cấu hình bộ nhớ đệm lưu Token đăng nhập vào máy điện thoại
// Lưu ý: SecureStore chỉ chạy trên iOS/Android, còn trên trình duyệt Web thì Clerk tự dùng Cookie
const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === "web") return null;
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === "web") return;
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  },
};

// Đọc khóa Publishable Key từ file .env
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Thiếu EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY! Hãy kiểm tra lại file .env của bạn.",
  );
}

export default function RootLayout() {
  return (
    // Bọc toàn bộ app trong ClerkProvider
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {/* ClerkLoaded đảm bảo Clerk đã kiểm tra xong phiên đăng nhập trước khi vẽ giao diện */}
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
