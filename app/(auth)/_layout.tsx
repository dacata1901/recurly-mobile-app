import { Redirect, Stack } from "expo-router";
// useAuth: Hook của Clerk trả về trạng thái isSignedIn thật từ máy chủ Clerk
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  // Nếu đã đăng nhập trên Clerk -> chuyển thẳng về trang chủ "/"
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
