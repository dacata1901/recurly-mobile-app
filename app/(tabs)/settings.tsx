import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// useUser: Lấy thông tin tài khoản đang đăng nhập từ Clerk
// useClerk: Lấy hàm signOut() để đăng xuất khỏi máy chủ Clerk
import { useClerk, useUser } from "@clerk/clerk-expo";

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  // Lấy địa chỉ email chính của người dùng từ Clerk
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "user@example.com";
  // Lấy tên hiển thị (nếu chưa đặt tên thì lấy phần đầu của email)
  const displayName = user?.firstName || userEmail.split("@")[0];

  return (
    <SafeAreaView className="flex-1 bg-[#fbf8f2] px-5">
      <View className="py-2">
        <Text className="text-2xl font-bold text-stone-900">Settings</Text>
        <Text className="mt-1 text-xs text-stone-500">
          Quản lý hồ sơ Clerk & tùy chọn ứng dụng
        </Text>
      </View>

      <View className="mt-4 flex-row items-center gap-4 rounded-3xl bg-white p-5 border border-stone-100 shadow-sm">
        <Image
          source={{
            uri:
              user?.imageUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
          }}
          className="h-16 w-16 rounded-full border border-stone-200"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-stone-900">
            {displayName}
          </Text>
          <Text className="text-xs text-stone-500">{userEmail}</Text>
          <View className="mt-1.5 self-start rounded-full bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
            <Text className="text-[10px] font-bold text-emerald-600">
              CLERK VERIFIED
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => signOut()}
        activeOpacity={0.8}
        className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 border border-red-200"
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text className="text-sm font-bold text-red-600">
          Đăng xuất tài khoản
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
