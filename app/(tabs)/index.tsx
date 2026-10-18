import { useState } from "react";
// Nhập các thành phần giao diện từ React Native
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// 1. Nhập useUser từ Clerk để lấy thông tin người dùng đang đăng nhập
import { useUser } from "@clerk/clerk-expo";

import CreateSubscriptionModal from "../../components/CreateSubscriptionModal";
import SubscriptionCard from "../../components/SubscriptionCard";
import { mockUser } from "../../constants/mockData";
import { formatCurrency } from "../../lib/utils";
import { useSubscriptionStore } from "../../store/useSubscriptionStore";

export default function HomeScreen() {
  // 2. Lấy thông tin user từ Clerk
  const { user } = useUser();

  // Tự động lấy tên trước dấu @ của email (VD: minhkhang@gmail.com -> minhkhang)
  const displayName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    mockUser.name;

  // Lấy ảnh đại diện từ Clerk (nếu không có thì dùng ảnh mặc định)
  const displayAvatar = user?.imageUrl || mockUser.avatarUrl;

  const { subscriptions } = useSubscriptionStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Tính tổng chi tiêu tháng
  const totalMonthlySpend = subscriptions.reduce(
    (acc, sub) => acc + sub.price,
    0,
  );
  const upcomingSubscriptions = subscriptions.slice(0, 2);

  // Hàm toggle mở rộng thẻ
  const handleToggleExpand = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Component Header chứa phần đầu trang để đưa vào FlatList
  const renderHeader = () => (
    <View className="mb-4">
      {/* 1. Header trên cùng: Avatar, Lời chào theo tên Email, Nút thêm (+) */}
      <View className="flex-row items-center justify-between py-2">
        <View className="flex-row items-center gap-3">
          {/* Avatar tròn */}
          <Image
            source={{ uri: displayAvatar }}
            className="h-12 w-12 rounded-full border border-stone-200"
          />
          <View>
            <Text className="text-xs text-stone-500">Xin chào trở lại 👋</Text>
            {/* 3. Hiển thị tên lấy từ Email ở đây */}
            <Text className="text-lg font-bold text-stone-900">
              {displayName}
            </Text>
          </View>
        </View>

        {/* Nút bấm hình dấu cộng (+) màu cam */}
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-[#e87a53]"
          activeOpacity={0.8}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 2. Thẻ số dư / Tổng chi tiêu (Balance Card) */}
      <View className="mt-4 rounded-3xl bg-[#1c1917] p-6 shadow-md">
        <Text className="text-xs font-medium uppercase tracking-wider text-stone-400">
          Tổng chi tiêu tháng này
        </Text>
        <Text className="mt-2 text-3xl font-extrabold text-white">
          {formatCurrency(totalMonthlySpend)}
        </Text>

        <View className="mt-4 flex-row items-center justify-between border-t border-stone-800 pt-3">
          <Text className="text-xs text-stone-400">Số gói đang hoạt động</Text>
          <Text className="text-xs font-bold text-[#e87a53]">
            {subscriptions.length} dịch vụ
          </Text>
        </View>
      </View>

      {/* 3. Tiêu đề mục "Sắp đến hạn thanh toán" */}
      <View className="mt-6 mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-stone-900">Sắp đến hạn</Text>
        <Text className="text-xs font-semibold text-[#e87a53]">Xem tất cả</Text>
      </View>

      {/* Danh sách cuộn ngang các gói sắp đến hạn */}
      <FlatList
        data={upcomingSubscriptions}
        keyExtractor={(item) => `upcoming-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="mr-3 w-40 rounded-2xl bg-white p-4 border border-stone-100 shadow-sm">
            <View
              className="h-10 w-10 items-center justify-center rounded-full mb-3"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Ionicons
                name={item.iconName as any}
                size={20}
                color={item.color}
              />
            </View>
            <Text
              className="text-sm font-bold text-stone-900"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text className="mt-1 text-xs text-stone-400">
              Hạn: {item.renewalDate}
            </Text>
            <Text className="mt-2 text-sm font-extrabold text-[#e87a53]">
              {formatCurrency(item.price)}
            </Text>
          </View>
        )}
      />

      {/* 4. Tiêu đề mục "Tất cả gói đăng ký" */}
      <View className="mt-6 mb-2">
        <Text className="text-lg font-bold text-stone-900">
          Tất cả gói đăng ký
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fbf8f2] px-5">
      {/* FlatList chính cuộn toàn bộ màn hình */}
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <SubscriptionCard
            item={item}
            isExpanded={expandedId === item.id}
            onToggleExpand={() => handleToggleExpand(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      />
      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}
