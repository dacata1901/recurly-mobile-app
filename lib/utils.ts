// Hàm format số tiền thành chuỗi có dấu phân cách và ký hiệu tiền tệ
// Ví dụ: 15.99 -> "$15.99"
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Dự phòng nếu thiết bị không hỗ trợ Intl đầy đủ
    return `$${amount.toFixed(2)}`;
  }
}
