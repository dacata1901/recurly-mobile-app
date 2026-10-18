import { useMemo, useState } from "react";
// Nhập các component giao diện
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Nhập Zustand store để lấy dữ liệu dùng chung
import SubscriptionCard from "../../components/SubscriptionCard";
import { useSubscriptionStore } from "../../store/useSubscriptionStore";

// Danh sách các danh mục để lọc
const CATEGORIES = [
  "All",
  "Entertainment",
  "Music",
  "Productivity",
  "Cloud Storage",
];

export default function SubscriptionsScreen() {
  // Lấy danh sách subscriptions và hàm delete từ Zustand store
  const { subscriptions, deleteSubscription } = useSubscriptionStore();

  // State lưu từ khóa người dùng đang gõ tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  // State lưu danh mục đang chọn (mặc định là 'All')
  const [selectedCategory, setSelectedCategory] = useState("All");
  // State lưu id của thẻ đang mở rộng chi tiết
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // useMemo: Tối ưu hiệu năng, chỉ tính toán lại danh sách lọc khi searchQuery, selectedCategory hoặc subscriptions thay đổi
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // 1. Kiểm tra từ khóa tìm kiếm (không phân biệt chữ hoa/thường)
      const matchesSearch = sub.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // 2. Kiểm tra danh mục
      const matchesCategory =
        selectedCategory === "All" || sub.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, subscriptions]);

  // Xử lý bật/tắt mở rộng thẻ
  const handleToggleExpand = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fbf8f2] px-5">
      {/* 1. Header màn hình */}
      <View className="py-2">
        <Text className="text-2xl font-bold text-stone-900">Subscriptions</Text>
        <Text className="text-xs text-stone-500 mt-1">
          Tổng cộng {filteredSubscriptions.length} gói dịch vụ
        </Text>
      </View>

      {/* 2. Thanh tìm kiếm (Search Bar) */}
      <View className="mt-3 flex-row items-center rounded-2xl bg-white px-4 py-3 border border-stone-200">
        <Ionicons name="search-outline" size={20} color="#8c857b" />
        <TextInput
          placeholder="Tìm kiếm gói dịch vụ..."
          placeholderTextColor="#8c857b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="ml-2 flex-1 text-sm text-stone-900"
        />
        {/* Nút xóa nhanh từ khóa tìm kiếm nếu đang có chữ */}
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#8c857b" />
          </TouchableOpacity>
        )}
      </View>

      {/* 3. Danh sách cuộn ngang các danh mục lọc (Category Filter Chips) */}
      <View className="mt-4">
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                className={`mr-2 rounded-full px-4 py-2 border ${
                  isSelected
                    ? "bg-[#e87a53] border-[#e87a53]"
                    : "bg-white border-stone-200"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? "text-white" : "text-stone-600"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* 4. Danh sách các thẻ gói dịch vụ sau khi đã lọc */}
      <View className="mt-4 flex-1">
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          // Khoảng trống đệm dưới đáy để không bị Bottom Tab Bar che mất thẻ cuối cùng
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View>
              <SubscriptionCard
                item={item}
                isExpanded={expandedId === item.id}
                onToggleExpand={() => handleToggleExpand(item.id)}
              />
              {/* Nếu thẻ đang mở rộng -> hiện thêm nút Xóa nhanh gói */}
              {expandedId === item.id && (
                <TouchableOpacity
                  onPress={() => deleteSubscription(item.id)}
                  className="mb-3 -mt-1 flex-row items-center justify-center rounded-xl bg-red-50 py-2 border border-red-200"
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  <Text className="ml-1 text-xs font-bold text-red-500">
                    Xóa gói này
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          // Giao diện khi không tìm thấy kết quả nào
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Ionicons name="file-tray-outline" size={48} color="#8c857b" />
              <Text className="mt-3 text-sm font-semibold text-stone-500">
                Không tìm thấy gói cước nào
              </Text>
              <Text className="text-xs text-stone-400 mt-1">
                Thử thay đổi từ khóa hoặc bộ lọc danh mục
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
