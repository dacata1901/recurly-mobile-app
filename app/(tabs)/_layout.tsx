import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
// Dùng useAuth của Clerk thay cho store cũ
import { useAuth } from "@clerk/clerk-expo";
export default function TabLayout() {
  // isSignedIn: Người dùng đã đăng nhập chưa?
  // isLoaded: Clerk đã tải xong dữ liệu phiên đăng nhập chưa?
  const { isSignedIn, isLoaded } = useAuth();
  // Đợi Clerk kiểm tra xong
  if (!isLoaded) return null;
  // Nếu chưa đăng nhập -> Đá về trang Sign In
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <Tabs
      screenOptions={{
        // Ẩn thanh header mặc định của hệ điều hành ở trên cùng vì chúng ta sẽ tự thiết kế header riêng
        headerShown: false,
        // Màu của icon và chữ khi tab đang được chọn (Active) - màu cam chủ đạo của app
        tabBarActiveTintColor: "#e87a53",
        // Màu của icon và chữ khi tab không được chọn (Inactive) - màu xám nhạt
        tabBarInactiveTintColor: "#8c857b",
        // Style tùy biến cho thanh Tab Bar dưới cùng
        tabBarStyle: {
          backgroundColor: "#ffffff", // Nền trắng nổi bật
          borderTopWidth: 1, // Viền mỏng phân cách bên trên
          borderTopColor: "#f0ece1", // Màu viền nhạt tinh tế
          height: 60, // Chiều cao thanh tab bar
          paddingBottom: 8, // Khoảng cách đệm phía dưới cho vừa ngón tay bấm
          paddingTop: 8, // Khoảng cách đệm phía trên
        },
        tabBarLabelStyle: {
          fontSize: 12, // Cỡ chữ nhãn tab
          fontWeight: "600", // Độ đậm chữ vừa phải
        },
      }}
    >
      {/* 1. Tab Trang chủ (Home) */}
      <Tabs.Screen
        name="index" // Trỏ tới file index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            // focused = true nếu người dùng đang đứng ở tab này -> đổi sang icon đặc (home), ngược lại dùng icon viền (home-outline)
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Tab Quản lý gói cước (Subscriptions) */}
      <Tabs.Screen
        name="subscriptions" // Trỏ tới file subscriptions.tsx
        options={{
          title: "Subscriptions",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "card" : "card-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Tab Báo cáo/Thống kê (Insights) */}
      <Tabs.Screen
        name="insights" // Trỏ tới file insights.tsx
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "pie-chart" : "pie-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 4. Tab Cài đặt (Settings) */}
      <Tabs.Screen
        name="settings" // Trỏ tới file settings.tsx
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions/[id]"
        options={{
          href: null, // href: null nghĩa là không hiển thị icon trên thanh Tab Bar
        }}
      />
    </Tabs>
  );
}
