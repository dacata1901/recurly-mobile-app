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
// useSignUp: Hook của Clerk tạo tài khoản & gửi email mã OTP 6 số thật
import { useSignUp } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State bước xác thực mã OTP gửi về email
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // BƯỚC 1: Tạo tài khoản trên Clerk & Yêu cầu Clerk gửi email mã OTP
  const handleSignUp = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      // 1. Tạo yêu cầu đăng ký với email & mật khẩu trên Clerk
      await signUp.create({
        emailAddress: email.trim(),
        password: password,
      });

      // 2. Yêu cầu Clerk gửi email chứa mã 6 chữ số (email_code) tới hộp thư của người dùng
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // 3. Chuyển sang màn hình nhập mã OTP
      setPendingVerification(true);
    } catch (err: any) {
      const clerkMessage =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        "Không thể đăng ký. Vui lòng kiểm tra lại email/mật khẩu!";
      setError(clerkMessage);
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: Kiểm tra mã OTP 6 số người dùng nhập từ Gmail
  const handleVerifyOtp = async () => {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      // Gửi mã 6 số lên Clerk để đối chiếu
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: otpCode.trim(),
      });

      // Nếu mã đúng -> Kích hoạt phiên đăng nhập và đưa vào App!
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        setError("Xác thực chưa hoàn tất. Vui lòng kiểm tra lại mã.");
      }
    } catch (err: any) {
      const clerkMessage =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        "Mã xác thực OTP không chính xác!";
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
        {pendingVerification ? (
          <View>
            <View className="items-center mb-6">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#e87a53]/15 mb-4">
                <Ionicons name="mail-open-outline" size={32} color="#e87a53" />
              </View>
              <Text className="text-2xl font-extrabold text-stone-900">
                Kiểm tra hộp thư Email
              </Text>
              <Text className="mt-1 text-center text-xs text-stone-500">
                Clerk vừa gửi mã xác nhận gồm 6 chữ số tới{"\n"}
                <Text className="font-bold text-stone-800">{email}</Text>
              </Text>
            </View>

            {error ? (
              <Text className="mb-3 text-center text-xs font-bold text-red-500">
                {error}
              </Text>
            ) : null}

            <TextInput
              placeholder="Nhập mã 6 số từ Email"
              placeholderTextColor="#a8a29e"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
              className="mb-5 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-center text-lg font-bold tracking-widest text-stone-900"
            />

            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={loading}
              className="items-center justify-center rounded-2xl bg-[#e87a53] py-4 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  Xác thực & Hoàn tất
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View className="items-center mb-6">
              <Text className="text-3xl font-extrabold text-stone-900">
                Tạo tài khoản
              </Text>
              <Text className="mt-1 text-sm text-stone-500">
                Nhập email thật của bạn để nhận mã xác thực OTP
              </Text>
            </View>

            {error ? (
              <View className="mb-4 rounded-xl bg-red-50 p-3 border border-red-200">
                <Text className="text-xs font-semibold text-red-600">
                  {error}
                </Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="mb-1 text-xs font-semibold text-stone-600">
                Địa chỉ Email thật của bạn
              </Text>
              <TextInput
                placeholder="youremail@gmail.com"
                placeholderTextColor="#a8a29e"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-900"
              />
            </View>

            <View className="mb-6">
              <Text className="mb-1 text-xs font-semibold text-stone-600">
                Mật khẩu (tối thiểu 8 ký tự, không quá dễ đoán)
              </Text>
              <TextInput
                placeholder="Nhập mật khẩu mạnh..."
                placeholderTextColor="#a8a29e"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-900"
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
              className="items-center justify-center rounded-2xl bg-[#e87a53] py-4 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">Tiếp tục</Text>
              )}
            </TouchableOpacity>

            <View className="mt-6 flex-row justify-center">
              <Text className="text-sm text-stone-500">Đã có tài khoản? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-sm font-bold text-[#e87a53]">
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
