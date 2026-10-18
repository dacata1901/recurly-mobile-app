import { analytics } from "../lib/analytics";

import { useState } from "react";
// Nhập các thành phần cốt lõi từ React Native
import { Ionicons } from "@expo/vector-icons";
import {
    Alert, // Khung cuộn chống tràn nội dung
    KeyboardAvoidingView,
    Modal, // Tự động đẩy nội dung lên khi bàn phím ảo xuất hiện
    Platform, // Nút bấm có hiệu ứng mờ nhẹ khi chạm
    Pressable, // Nút bấm linh hoạt dùng làm lớp nền overlay
    ScrollView, // Khối bọc layout (tương đương <div>)
    Text, // Chữ hiển thị
    TextInput, // Ô nhập liệu văn bản (tương đương <input>)
    TouchableOpacity, // Cửa sổ bật lên native của hệ thống
    View, // Khối bọc layout (tương đương <div>)
} from "react-native";

// Nhập Store Zustand và kiểu dữ liệu Subscription
import { useSubscriptionStore } from "../store/useSubscriptionStore";
import { Subscription } from "../types/subscription";

// Danh sách các danh mục có sẵn để người dùng chọn nhanh
const CATEGORIES = [
  "Entertainment",
  "Music",
  "Productivity",
  "Cloud Storage",
  "Utilities",
];

// Bảng màu & icon đại diện tương ứng theo từng danh mục
const CATEGORY_STYLES: Record<string, { color: string; icon: string }> = {
  Entertainment: { color: "#E50914", icon: "film-outline" },
  Music: { color: "#1DB954", icon: "musical-notes-outline" },
  Productivity: { color: "#10A37F", icon: "bulb-outline" },
  "Cloud Storage": { color: "#007AFF", icon: "cloud-outline" },
  Utilities: { color: "#F59E0B", icon: "construct-outline" },
};

// Định nghĩa các props mà component Modal này nhận từ component cha
interface Props {
  visible: boolean; // Modal đang mở (true) hay đóng (false)
  onClose: () => void; // Hàm gọi khi muốn đóng Modal
}

export default function CreateSubscriptionModal({ visible, onClose }: Props) {
  // Lấy hàm addSubscription từ Zustand Store để lưu dữ liệu toàn cục
  const { addSubscription } = useSubscriptionStore();

  // State quản lý giá trị của từng ô nhập liệu trong Form
  const [name, setName] = useState(""); // Tên gói (vd: Netflix)
  const [price, setPrice] = useState(""); // Giá tiền (vd: 12.99)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  ); // Chu kỳ
  const [category, setCategory] = useState("Entertainment"); // Danh mục

  // Hàm xử lý khi người dùng nhấn nút "Lưu gói dịch vụ"
  const handleSubmit = () => {
    // 1. Kiểm tra validation (không được để trống tên và giá)
    if (!name.trim()) {
      Alert.alert("Lỗi nhập liệu", "Vui lòng nhập tên dịch vụ!");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert(
        "Lỗi nhập liệu",
        "Vui lòng nhập giá tiền hợp lệ (lớn hơn 0)!",
      );
      return;
    }

    // 2. Tính toán ngày gia hạn tiếp theo:
    // Lấy ngày hiện tại, nếu chọn monthly thì cộng 1 tháng, yearly thì cộng 1 năm
    const now = new Date();
    if (billingPeriod === "monthly") {
      now.setMonth(now.getMonth() + 1);
    } else {
      now.setFullYear(now.getFullYear() + 1);
    }
    // Định dạng thành chuỗi YYYY-MM-DD
    const renewalDateStr = now.toISOString().split("T")[0];

    // Lấy màu sắc và icon phù hợp theo danh mục đã chọn
    const styleInfo = CATEGORY_STYLES[category] || {
      color: "#e87a53",
      icon: "card-outline",
    };

    // 3. Tạo object Subscription hoàn chỉnh
    const newSub: Subscription = {
      id: Date.now().toString(), // Tạo id ngẫu nhiên duy nhất bằng timestamp hiện tại
      name: name.trim(),
      price: parsedPrice,
      currency: "USD",
      billingPeriod: billingPeriod,
      category: category,
      status: "active",
      renewalDate: renewalDateStr,
      color: styleInfo.color,
      iconName: styleInfo.icon,
    };

    // 4. Đẩy gói mới này vào Zustand Store
    addSubscription(newSub);
    // Ghi nhận sự kiện Analytics (giống posthog.capture trong video)
    analytics.capture("subscription_created", {
      subscription_name: newSub.name,
      subscription_price: newSub.price,
      subscription_frequency: newSub.billingPeriod,
      subscription_category: newSub.category,
    });
    // 5. Reset lại form về rỗng để lần sau mở lên không bị dính chữ cũ
    setName("");
    setPrice("");
    setBillingPeriod("monthly");
    setCategory("Entertainment");

    // 6. Đóng modal
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide" // Hiệu ứng trượt từ dưới lên
      transparent={true} // Để lộ nền mờ phía sau
      onRequestClose={onClose} // Xử lý khi người dùng Android nhấn nút Back vật lý
    >
      {/* KeyboardAvoidingView: Giúp giao diện co giãn khi bàn phím ảo bật lên
          Trên iOS dùng 'padding', trên Android để trống (mặc định xử lý tốt hơn) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end"
      >
        {/* Vùng nền mờ màu đen (Backdrop): Bấm vào đây sẽ đóng Modal */}
        <Pressable className="flex-1 bg-black/40" onPress={onClose} />

        {/* Nội dung chính của Modal (Nằm ở nửa dưới màn hình) */}
        <View className="rounded-t-3xl bg-white px-6 pt-5 pb-8 shadow-2xl">
          {/* Thanh gạch ngang nhỏ trên đầu (Drag handle) tạo cảm giác kéo vuốt */}
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-stone-300" />

          {/* Tiêu đề Modal & Nút X đóng */}
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-stone-900">
              Thêm gói đăng ký mới
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="rounded-full bg-stone-100 p-1.5"
            >
              <Ionicons name="close" size={20} color="#78716c" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. Ô nhập tên dịch vụ */}
            <View className="mb-4">
              <Text className="mb-1.5 text-xs font-semibold text-stone-600">
                Tên dịch vụ
              </Text>
              <TextInput
                placeholder="Ví dụ: Netflix, Spotify, iCloud..."
                placeholderTextColor="#a8a29e"
                value={name}
                onChangeText={setName}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900"
              />
            </View>

            {/* 2. Ô nhập giá tiền */}
            <View className="mb-4">
              <Text className="mb-1.5 text-xs font-semibold text-stone-600">
                Giá tiền (USD)
              </Text>
              <TextInput
                placeholder="Ví dụ: 9.99"
                placeholderTextColor="#a8a29e"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad" // Chỉ hiện bàn phím số và dấu chấm thập phân
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900"
              />
            </View>

            {/* 3. Chọn chu kỳ thanh toán: Hàng tháng hay Hàng năm */}
            <View className="mb-4">
              <Text className="mb-1.5 text-xs font-semibold text-stone-600">
                Chu kỳ thanh toán
              </Text>
              <View className="flex-row gap-3">
                {/* Nút Tháng */}
                <TouchableOpacity
                  onPress={() => setBillingPeriod("monthly")}
                  className={`flex-1 items-center justify-center rounded-xl py-3 border ${
                    billingPeriod === "monthly"
                      ? "border-[#e87a53] bg-[#e87a53]/10"
                      : "border-stone-200 bg-stone-50"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      billingPeriod === "monthly"
                        ? "text-[#e87a53]"
                        : "text-stone-600"
                    }`}
                  >
                    Hàng tháng (Monthly)
                  </Text>
                </TouchableOpacity>

                {/* Nút Năm */}
                <TouchableOpacity
                  onPress={() => setBillingPeriod("yearly")}
                  className={`flex-1 items-center justify-center rounded-xl py-3 border ${
                    billingPeriod === "yearly"
                      ? "border-[#e87a53] bg-[#e87a53]/10"
                      : "border-stone-200 bg-stone-50"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      billingPeriod === "yearly"
                        ? "text-[#e87a53]"
                        : "text-stone-600"
                    }`}
                  >
                    Hàng năm (Yearly)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 4. Chọn danh mục */}
            <View className="mb-6">
              <Text className="mb-2 text-xs font-semibold text-stone-600">
                Danh mục
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`rounded-full px-3.5 py-2 border ${
                        isSelected
                          ? "border-[#e87a53] bg-[#e87a53]"
                          : "border-stone-200 bg-stone-50"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? "text-white" : "text-stone-600"
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 5. Nút bấm Tạo gói dịch vụ */}
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              className="items-center justify-center rounded-2xl bg-[#e87a53] py-4 shadow-md shadow-[#e87a53]/30"
            >
              <Text className="text-base font-bold text-white">
                Lưu gói dịch vụ
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
