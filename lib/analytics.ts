// Bộ công cụ theo dõi hành vi người dùng (Product Analytics)
// Trong môi trường Development, nó in rõ sự kiện ra Terminal để bạn kiểm tra.
// Khi lên Production, bạn có thể gắn trực tiếp posthog.capture() vào đây.

export const analytics = {
  // Hàm ghi nhận một sự kiện (Event) kèm thông tin chi tiết (Properties)
  capture: (eventName: string, properties?: Record<string, any>) => {
    if (__DEV__) {
      console.log(`📊 [Analytics Event]: ${eventName}`, properties || {});
    }
  },
};
