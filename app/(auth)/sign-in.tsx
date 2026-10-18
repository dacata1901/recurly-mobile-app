import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// useSignIn: Hook của Clerk xử lý đăng nhập thật
import { useSignIn } from "@clerk/clerk-expo";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm gọi lên máy chủ Clerk để kiểm tra tài khoản & mật khẩu
  const handleSignIn = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      // 1. Gửi email (identifier) và password lên máy chủ Clerk
      const signInAttempt = await signIn.create({
        identifier: email.trim(),
        password: password,
      });

      // 2. Nếu máy chủ Clerk báo mật khẩu đúng (status === 'complete')
      if (signInAttempt.status === "complete") {
        // Kích hoạt phiên đăng nhập và lưu vào thiết bị
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        setError("Đăng nhập chưa hoàn tất. Vui lòng kiểm tra lại.");
      }
    } catch (err: any) {
      // 3. Nếu sai mật khẩu hoặc tài khoản không tồn tại, Clerk sẽ ném lỗi về đây
      const clerkMessage =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        "Email hoặc mật khẩu không chính xác!";
      setError(clerkMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf8f2] px-6 justify-center">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="items-center mb-8">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-[#e87a53] mb-4 shadow-md">
            <Ionicons name="wallet-outline" size={32} color="#ffffff" />
          </View>
          <Text className="text-3xl font-extrabold text-stone-900">
            Recurly
          </Text>
          <Text className="mt-1 text-sm text-stone-500">
            Đăng nhập bằng tài khoản Clerk của bạn
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-xl bg-red-50 p-3 border border-red-200 flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={18} color="#ef4444" />
            <Text className="text-xs font-semibold text-red-600 flex-1">
              {error}
            </Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="mb-1.5 text-xs font-semibold text-stone-600">
            Địa chỉ Email
          </Text>
          <TextInput
            placeholder="name@example.com"
            placeholderTextColor="#a8a29e"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-900"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-1.5 text-xs font-semibold text-stone-600">
            Mật khẩu
          </Text>
          <TextInput
            placeholder="Nhập mật khẩu của bạn"
            placeholderTextColor="#a8a29e"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-900"
          />
        </View>

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          activeOpacity={0.85}
          className="items-center justify-center rounded-2xl bg-[#e87a53] py-4 shadow-md"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-bold text-white">Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-stone-500">Chưa có tài khoản? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-bold text-[#e87a53]">
                Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
