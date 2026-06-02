export type UserRole = "customer" | "vendor" | "delivery" | "admin";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "washing"
  | "chopping"
  | "packing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled";

export type FulfillmentType = "pickup" | "delivery";

export type VendorCategory =
  | "vegetables"
  | "fruits"
  | "cooked_food"
  | "snacks"
  | "household"
  | "water"
  | "clothing"
  | "electronics"
  | "services"
  | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: VendorCategory;
  marketLocation: string;
  stallNumber?: string;
  rating: number;
  reviewCount: number;
  orderCount: number;
  isOpen: boolean;
  openHours: string;
  verified: boolean;
  featured: boolean;
  coverImage?: string;
  profileImage?: string;
  paymentInfo: {
    mpesaNumber?: string;
    paybill?: string;
    tillNumber?: string;
    bankAccount?: string;
    instructions?: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  tags: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: VendorCategory;
  image?: string;
  inStock: boolean;
  prepTime?: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  total: number;
  notes?: string;
  deliveryAddress?: string;
  deliveryRunner?: string;
  estimatedReady?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  notes?: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "system" | "promotion" | "vendor";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SearchFilters {
  query: string;
  category: VendorCategory | "all";
  location: string;
  sortBy: "rating" | "distance" | "orders" | "newest";
  isOpen: boolean;
}
