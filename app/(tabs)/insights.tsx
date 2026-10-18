import { useMemo } from "react";
// Nhập các thẻ giao diện cơ bản từ React Native
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Nhập kho dữ liệu Zustand và hàm format tiền tệ
import { formatCurrency } from "../../lib/utils";
import { useSubscriptionStore } from "../../store/useSubscriptionStore";

export default function InsightsScreen() {
  // 1. Lấy danh sách các gói dịch vụ từ Kho trung tâm (Zustand Store)
  const { subscriptions } = useSubscriptionStore();

  // 2. Tính tổng chi tiêu hàng tháng
  // Nếu gói nào trả theo năm (yearly) thì chia 12 để quy về chi phí mỗi tháng
  const totalMonthly = useMemo(() => {
    return subscriptions.reduce((sum, sub) => {
      const monthlyCost =
        sub.billingPeriod === "yearly" ? sub.price / 12 : sub.price;
      return sum + monthlyCost;
    }, 0);
  }, [subscriptions]);

  // 3. Ước tính tổng chi tiêu cả năm (Tháng x 12)
  const totalYearly = totalMonthly * 12;

  // 4. Tìm ra gói dịch vụ đắt tiền nhất để cảnh báo người dùng
  const mostExpensiveSub = useMemo(() => {
    if (subscriptions.length === 0) return null;
    // Sắp xếp giảm dần theo giá và lấy phần tử đầu tiên
    return [...subscriptions].sort((a, b) => b.price - a.price)[0];
  }, [subscriptions]);

  // 5. Gom nhóm chi tiêu theo từng Danh mục (Category) để vẽ biểu đồ phần trăm
  const categoryBreakdown = useMemo(() => {
    // Tạo một bảng đếm: { "Entertainment": 15.99, "Music": 10.99, ... }
    const map: Record<string, { total: number; color: string; count: number }> =
      {};

    subscriptions.forEach((sub) => {
      const monthlyCost =
        sub.billingPeriod === "yearly" ? sub.price / 12 : sub.price;
      if (!map[sub.category]) {
        map[sub.category] = { total: 0, color: sub.color, count: 0 };
      }
      map[sub.category].total += monthlyCost;
      map[sub.category].count += 1;
    });

    // Chuyển bảng đếm thành mảng và tính phần trăm (%) so với tổng chi tiêu
    return Object.entries(map)
      .map(([category, data]) => ({
        category,
        total: data.total,
        color: data.color,
        count: data.count,
        percentage:
          totalMonthly > 0 ? Math.round((data.total / totalMonthly) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total); // Danh mục tốn nhiều tiền nhất xếp lên đầu
  }, [subscriptions, totalMonthly]);

  return (
    <SafeAreaView className="flex-1 bg-[#fbf8f2] px-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Tiêu đề trang */}
        <View className="py-2">
          <Text className="text-2xl font-bold text-stone-900">Insights</Text>
          <Text className="mt-1 text-xs text-stone-500">
            Phân tích chi tiêu & thống kê tài chính của bạn
          </Text>
        </View>

        {/* Hàng 1: 2 Thẻ thống kê (Chi tiêu tháng & Dự kiến cả năm) */}
        <View className="mt-4 flex-row gap-3">
          {/* Thẻ bên trái: Trung bình tháng */}
          <View className="flex-1 rounded-2xl bg-white p-4 border border-stone-100 shadow-sm">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#e87a53]/15 mb-2">
              <Ionicons name="calendar-outline" size={18} color="#e87a53" />
            </View>
            <Text className="text-xs text-stone-500">Trung bình / tháng</Text>
            <Text className="mt-1 text-xl font-extrabold text-stone-900">
              {formatCurrency(totalMonthly)}
            </Text>
          </View>

          {/* Thẻ bên phải: Dự kiến cả năm */}
          <View className="flex-1 rounded-2xl bg-[#1c1917] p-4 shadow-sm">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white/10 mb-2">
              <Ionicons name="trending-up-outline" size={18} color="#e87a53" />
            </View>
            <Text className="text-xs text-stone-400">Dự kiến / năm</Text>
            <Text className="mt-1 text-xl font-extrabold text-white">
              {formatCurrency(totalYearly)}
            </Text>
          </View>
        </View>

        {/* Hàng 2: Điểm nhấn - Gói dịch vụ tốn kém nhất */}
        {mostExpensiveSub && (
          <View className="mt-4 rounded-2xl bg-white p-4 border border-stone-100 shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${mostExpensiveSub.color}20` }}
              >
                <Ionicons
                  name={mostExpensiveSub.iconName as any}
                  size={24}
                  color={mostExpensiveSub.color}
                />
              </View>
              <View>
                <Text className="text-xs font-medium text-stone-400">
                  Gói chi tiêu cao nhất
                </Text>
                <Text className="text-base font-bold text-stone-900">
                  {mostExpensiveSub.name}
                </Text>
              </View>
            </View>
            <Text className="text-base font-extrabold text-[#e87a53]">
              {formatCurrency(mostExpensiveSub.price)}
            </Text>
          </View>
        )}

        {/* Hàng 3: Biểu đồ tỷ trọng theo từng danh mục (Category Breakdown) */}
        <View className="mt-6 rounded-3xl bg-white p-5 border border-stone-100 shadow-sm">
          <Text className="text-base font-bold text-stone-900 mb-4">
            Tỷ trọng theo danh mục
          </Text>

          {categoryBreakdown.map((item) => (
            <View key={item.category} className="mb-4">
              {/* Dòng chữ trên thanh biểu đồ: Tên danh mục + Số tiền + Phần trăm */}
              <View className="flex-row justify-between items-center mb-1.5">
                <View className="flex-row items-center gap-2">
                  {/* Chấm màu đại diện danh mục */}
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text className="text-sm font-semibold text-stone-800">
                    {item.category}
                  </Text>
                  <Text className="text-xs text-stone-400">
                    ({item.count} gói)
                  </Text>
                </View>

                <Text className="text-xs font-bold text-stone-700">
                  {formatCurrency(item.total)} ({item.percentage}%)
                </Text>
              </View>

              {/* Thanh Progress Bar: Nền xám nhạt, ruột bên trong dài theo số % */}
              <View className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
