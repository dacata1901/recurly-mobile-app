import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// useLocalSearchParams: Lấy tham số [id] từ thanh địa chỉ URL
// useRouter: Dùng để quay lại trang trước (router.back())
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

// Nhập kho dữ liệu Zustand và hàm format tiền
import { formatCurrency } from "../../../lib/utils";
import { useSubscriptionStore } from "../../../store/useSubscriptionStore";

export default function SubscriptionDetailScreen() {
  // 1. Đọc mã id của gói dịch vụ mà người dùng vừa bấm vào
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 2. Lấy danh sách gói và hàm xóa từ Zustand Store
  const { subscriptions, deleteSubscription } = useSubscriptionStore();

  // 3. Tìm đúng gói dịch vụ có id trùng khớp
  const subscription = subscriptions.find((sub) => sub.id === id);

  // Nếu không tìm thấy (hoặc vừa bị xóa xong) -> Hiển thị thông báo
  if (!subscription) {
    return (
      <SafeAreaView className="flex-1 bg-[#fbf8f2] items-center justify-center p-5">
        <Text className="text-base font-bold text-stone-700">
          Không tìm thấy gói dịch vụ này
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-[#e87a53] px-5 py-2.5"
        >
          <Text className="text-xs font-bold text-white">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Hàm xử lý khi bấm nút Xóa gói dịch vụ
  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn hủy theo dõi gói ${subscription.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa ngay",
          style: "destructive",
          onPress: () => {
            deleteSubscription(subscription.id);
            router.back(); // Xóa xong tự động quay về màn hình trước
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf8f2] px-5">
      {/* 1. Thanh điều hướng phía trên: Nút Quay lại (Back) */}
      <View className="flex-row items-center justify-between py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white border border-stone-200"
        >
          <Ionicons name="arrow-back" size={20} color="#1c1917" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-stone-900">
          Chi tiết gói đăng ký
        </Text>
        {/* Khối trống để cân đối tiêu đề vào chính giữa */}
        <View className="h-10 w-10" />
      </View>

      {/* 2. Thẻ Hero lớn ở giữa: Hiển thị Icon, Tên dịch vụ và Giá tiền */}
      <View className="mt-4 items-center rounded-3xl bg-white p-6 border border-stone-100 shadow-sm">
        <View
          className="h-20 w-20 items-center justify-center rounded-full mb-4"
          style={{ backgroundColor: `${subscription.color}20` }}
        >
          <Ionicons
            name={subscription.iconName as any}
            size={40}
            color={subscription.color}
          />
        </View>

        <Text className="text-2xl font-extrabold text-stone-900">
          {subscription.name}
        </Text>
        <Text className="mt-1 text-xs font-medium text-stone-400">
          {subscription.category}
        </Text>

        <View className="mt-4 flex-row items-baseline">
          <Text className="text-3xl font-extrabold text-[#e87a53]">
            {formatCurrency(subscription.price, subscription.currency)}
          </Text>
          <Text className="ml-1 text-sm text-stone-400">
            /{subscription.billingPeriod === "monthly" ? "tháng" : "năm"}
          </Text>
        </View>
      </View>

      {/* 3. Bảng thông số chi tiết */}
      <View className="mt-5 rounded-3xl bg-white p-5 border border-stone-100 shadow-sm space-y-4">
        <View className="flex-row justify-between py-2 border-b border-stone-100">
          <Text className="text-xs text-stone-500">Chu kỳ thanh toán</Text>
          <Text className="text-xs font-bold capitalize text-stone-800">
            {subscription.billingPeriod}
          </Text>
        </View>

        <View className="flex-row justify-between py-2 border-b border-stone-100">
          <Text className="text-xs text-stone-500">Ngày gia hạn kế tiếp</Text>
          <Text className="text-xs font-bold text-stone-800">
            {subscription.renewalDate}
          </Text>
        </View>

        <View className="flex-row justify-between py-2 border-b border-stone-100">
          <Text className="text-xs text-stone-500">Đơn vị tiền tệ</Text>
          <Text className="text-xs font-bold text-stone-800">
            {subscription.currency}
          </Text>
        </View>

        <View className="flex-row justify-between py-2">
          <Text className="text-xs text-stone-500">Trạng thái</Text>
          <View className="flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-emerald-500" />
            <Text className="text-xs font-bold uppercase text-emerald-600">
              {subscription.status}
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Nút Xóa gói đăng ký */}
      <TouchableOpacity
        onPress={handleDelete}
        activeOpacity={0.8}
        className="mt-6 flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 border border-red-200"
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
        <Text className="text-sm font-bold text-red-600">
          Xóa gói đăng ký này
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
