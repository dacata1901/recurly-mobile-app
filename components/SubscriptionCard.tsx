import { Ionicons } from "@expo/vector-icons";
// 1. Đã thêm TouchableOpacity vào đây
import { useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "../lib/utils";
import { Subscription } from "../types/subscription";

interface Props {
  item: Subscription;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function SubscriptionCard({
  item,
  isExpanded,
  onToggleExpand,
}: Props) {
  const router = useRouter();

  return (
    // Pressable: Vùng bấm có phản hồi chạm mượt mà
    <Pressable
      onPress={onToggleExpand}
      // Áp dụng viền cam nổi bật nếu thẻ đang được mở rộng
      className={`mb-3 rounded-2xl bg-white p-4 shadow-sm border ${
        isExpanded ? "border-[#e87a53]" : "border-stone-100"
      }`}
    >
      {/* Hàng trên cùng: Icon màu đại diện, Tên dịch vụ, và Giá tiền */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3 gap-3">
          {/* Hộp tròn chứa icon với màu nền đặc trưng của thương hiệu */}
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <Ionicons
              name={item.iconName as any}
              size={24}
              color={item.color}
            />
          </View>
          {/* Cột hiển thị tên và danh mục */}
          <View>
            <Text className="text-base font-bold text-stone-900">
              {item.name}
            </Text>
            <Text className="text-xs text-stone-500">{item.category}</Text>
          </View>
        </View>
        {/* Cột hiển thị giá và chu kỳ thanh toán */}
        <View className="items-end">
          <Text className="text-base font-bold text-stone-900">
            {formatCurrency(item.price, item.currency)}
          </Text>
          <Text className="text-xs text-stone-400">/{item.billingPeriod}</Text>
        </View>
      </View>

      {/* Phần mở rộng chi tiết (Chỉ render khi isExpanded === true) */}
      {isExpanded && (
        <View className="mt-4 pt-3 border-t border-stone-100">
          {/* Dòng ngày thanh toán kế tiếp */}
          <View className="flex-row justify-between py-1">
            <Text className="text-xs text-stone-500">Ngày gia hạn:</Text>
            <Text className="text-xs font-semibold text-stone-800">
              {item.renewalDate}
            </Text>
          </View>

          {/* Dòng trạng thái */}
          <View className="flex-row justify-between py-1">
            <Text className="text-xs text-stone-500">Trạng thái:</Text>
            <View className="flex-row items-center gap-1">
              <View className="h-2 w-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-semibold capitalize text-emerald-600">
                {item.status}
              </Text>
            </View>
          </View>

          {/* ---> ĐÂY LÀ CHỖ CHÈN NÚT XEM CHI TIẾT <--- */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/subscriptions/[id]",
                params: { id: item.id },
              })
            }
            className="mt-3 flex-row items-center justify-center rounded-xl bg-stone-100 py-2.5"
          >
            <Text className="text-xs font-bold text-stone-700 mr-1">
              Xem chi tiết gói
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#44403c" />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
}
