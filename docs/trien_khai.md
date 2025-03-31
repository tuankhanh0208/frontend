# Triển Khai Hệ Thống Quản Lý Đơn Hàng

## Cấu trúc dự án

Dự án được triển khai với Next.js, Tailwind CSS, và các thành phần React.

## Các file chính

### 1. CSS Toàn cục (globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 16 100% 50%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 16 100% 50%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 16 100% 50%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 16 100% 50%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 2. Layout chính (layout.tsx)

```tsx
import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quản Lý Đơn Hàng",
  description: "Trang quản lý đơn hàng e-commerce",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. Trang chính (page.tsx)

```tsx
import OrderManagement from "@/components/order-management"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <OrderManagement />
    </main>
  )
}
```

### 4. Component quản lý đơn hàng (order-management.tsx)

```tsx
"use client"

import { useState } from "react"
import { Search, Bell, User, ShoppingBag, Gift, CreditCard, MessageSquare, Store, CheckCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const orderTabs = [
  { id: "all", label: "Tất cả", active: true },
  { id: "pending", label: "Chờ thanh toán", active: false },
  { id: "shipping", label: "Vận chuyển", active: false },
  { id: "delivering", label: "Chờ giao hàng", count: 1, active: false },
  { id: "completed", label: "Hoàn thành", active: false },
  { id: "cancelled", label: "Đã hủy", active: false },
  { id: "refund", label: "Trả hàng/Hoàn tiền", active: false },
]

const sidebarItems = [
  { id: "notifications", label: "Thông Báo", icon: <Bell className="w-5 h-5 text-orange-500" /> },
  { id: "account", label: "Tài Khoản Của Tôi", icon: <User className="w-5 h-5 text-blue-500" /> },
  { id: "orders", label: "Đơn Mua", icon: <ShoppingBag className="w-5 h-5 text-orange-500" /> },
  { id: "vouchers", label: "Kho Voucher", icon: <Gift className="w-5 h-5 text-orange-500" /> },
  { id: "coins", label: "Shopee Xu", icon: <CreditCard className="w-5 h-5 text-orange-500" /> },
  {
    id: "freeship",
    label: "4.4 Siêu Hội Freeship",
    icon: <ShoppingBag className="w-5 h-5 text-orange-500" />,
    badge: "New",
  },
]

const orders = [
  {
    id: 1,
    shop: { name: "linggingno.vn", favorite: true },
    product: {
      name: "Cáp Sạc USB Cho Đồng Hồ T55 Pro T500 Pro",
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
      originalPrice: "₫19.142",
      price: "₫9.591",
    },
    totalPrice: "₫9.591",
    status: "CHỜ GIAO HÀNG",
    isDelivered: true,
    actions: ["Đã Nhận Hàng", "Yêu Cầu Trả Hàng/Hoàn Tiền", "Liên Hệ Người Bán"],
    message:
      'Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề nào.',
  },
  {
    id: 2,
    shop: { name: "KingsnamTechnology", favorite: true },
    product: {
      name: "Box ổ cứng M2 NVMe M2 SATA NGFF cao cấp",
      image: "/placeholder.svg?height=80&width=80",
      quantity: 1,
      category: "Phân loại hàng: M2 NVME",
      originalPrice: "₫260.000",
      price: "₫195.000",
    },
    totalPrice: "₫164.000",
    status: "HOÀN THÀNH",
    isCompleted: true,
    actions: ["Mua Lại", "Liên Hệ Người Bán"],
  },
]

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="User avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">vannamdang03</p>
              <button className="text-xs text-gray-500 flex items-center">
                <span>Sửa Hồ Sơ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 flex flex-1">
        {/* Sidebar */}
        <div className="w-64 pr-6">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <a key={item.id} href="#" className="flex items-center p-2 hover:bg-gray-100 rounded-md group">
                {item.icon}
                <span className={cn("ml-3", item.id === "account" ? "text-blue-500" : "text-gray-700")}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs text-white bg-red-500 rounded">{item.badge}</span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="bg-white rounded-t-md border-b border-gray-200">
            <div className="flex">
              {orderTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={cn(
                    "px-4 py-3 text-sm font-medium relative",
                    activeTab === tab.id ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-700",
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {tab.count && <span className="ml-1 text-orange-500">({tab.count})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-4 mt-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-md shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center space-x-2">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        order.shop.favorite ? "bg-orange-100 text-orange-500" : "bg-gray-100",
                      )}
                    >
                      Yêu thích
                    </span>
                    <span className="font-medium">{order.shop.name}</span>
                    <button className="px-2 py-1 text-xs bg-orange-500 text-white rounded">
                      <MessageSquare className="w-3 h-3 inline mr-1" />
                      Chat
                    </button>
                    <button className="px-2 py-1 text-xs border border-gray-300 rounded flex items-center">
                      <Store className="w-3 h-3 mr-1" />
                      Xem Shop
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.isDelivered && (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Giao hàng thành công</span>
                      </div>
                    )}
                    <span
                      className={cn("text-sm font-medium", order.isDelivered ? "text-orange-500" : "text-green-500")}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4">
                  <div className="flex">
                    <div className="w-16 h-16 mr-4">
                      <Image
                        src={order.product.image || "/placeholder.svg"}
                        alt={order.product.name}
                        width={80}
                        height={80}
                        className="object-cover border border-gray-200 rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{order.product.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">x{order.product.quantity}</p>
                          {order.product.category && (
                            <p className="text-xs text-gray-500 mt-1">{order.product.category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 line-through">{order.product.originalPrice}</p>
                          <p className="text-sm text-orange-500">{order.product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t">
                  {order.message && (
                    <div className="mb-3 p-3 bg-gray-100 text-xs text-gray-600 rounded">{order.message}</div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Thành tiền:</span>
                      <span className="ml-2 text-xl font-medium text-orange-500">{order.totalPrice}</span>
                    </div>
                    <div className="flex space-x-2">
                      {order.actions.map((action, index) => (
                        <button
                          key={index}
                          className={cn(
                            "px-4 py-2 text-sm rounded",
                            index === 0 && !order.isCompleted
                              ? "bg-orange-500 text-white"
                              : "border border-gray-300 text-gray-700",
                          )}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-orange-500 text-white p-3 rounded-full shadow-lg">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
```

### 5. Cấu hình Tailwind (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        orange: {
          500: "#ee4d2d",
          100: "#fff1ee",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

## Cấu trúc giao diện

Giao diện hệ thống quản lý đơn hàng bao gồm các thành phần chính sau:

1. **Header** - Hiển thị thông tin người dùng và avatar
2. **Sidebar** - Menu điều hướng với các chức năng quản lý tài khoản, đơn hàng, voucher
3. **Tabs** - Điều hướng giữa các trạng thái đơn hàng
4. **Search** - Tìm kiếm đơn hàng
5. **Order List** - Danh sách đơn hàng với thông tin chi tiết
6. **Chat Button** - Nút chat cố định góc dưới màn hình

## Chức năng

- Xem và lọc đơn hàng theo trạng thái
- Tìm kiếm đơn hàng 
- Quản lý trạng thái đơn hàng (Đã nhận, Trả hàng, v.v.)
- Liên hệ với người bán
- Truy cập thông tin shop

