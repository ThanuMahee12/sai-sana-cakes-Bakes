/**
 * Firebase Realtime Database Collection Models
 * Sai Sana Cakes & Bakes
 */

// ============================================
// CAKES COLLECTION - /cakes
// ============================================
export const CakeModel = {
  id: '',              // Firebase auto-generated key
  name: '',            // Cake name
  description: '',     // Cake description
  imageURL: '',        // Image URL (Supabase Storage)
  price: 0,            // Price in currency
  quantity: 0,         // Available stock
  rating: 0,           // Average rating (0-5) - calculated from feedbacks
  totalRatings: 0,     // Total number of ratings
  tags: [],            // Array of tags ['birthday', 'chocolate', 'custom']
  createdAt: null,     // Timestamp
  updatedAt: null,     // Timestamp
};

// ============================================
// FEEDBACKS COLLECTION - /feedbacks
// ============================================
export const FeedbackModel = {
  id: '',              // Firebase auto-generated key
  cakeId: '',          // Reference to cake
  cakeName: '',        // Cake name (for display)
  userId: '',          // User who gave feedback
  userName: '',        // User display name
  userEmail: '',       // User email
  rating: 0,           // Rating (1-5)
  comment: '',         // Feedback text
  approved: false,     // Admin approval status
  createdAt: null,     // Timestamp
};

// ============================================
// USERS COLLECTION - /users
// ============================================
export const UserModel = {
  uid: '',             // Firebase Auth UID
  name: '',            // Display name
  email: '',           // Email address
  role: 'customer',    // 'customer' | 'admin'
  blocked: false,      // Is user blocked?
  createdAt: null,     // Timestamp
  updatedAt: null,     // Timestamp
};

// User roles
export const UserRoles = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

// ============================================
// ORDERS COLLECTION - /orders
// ============================================
export const OrderModel = {
  orderId: '',         // Format: {CakeName}{SerialNum}{Timestamp} e.g., "CHOCO001-1703520000"
  userId: '',          // User who placed order
  userName: '',        // User display name
  userEmail: '',       // User email
  items: [],           // Array of OrderItem objects
  totalAmount: 0,      // Total order amount
  deliverable: true,   // Is order deliverable?
  deliveryAddress: '', // Delivery address
  paymentStatus: '',   // 'pending' | 'paid' | 'failed' | 'refunded'
  payment: 0,          // Payment amount
  paymentMethod: '',   // Payment method used
  notes: '',           // Customer notes
  status: '',          // 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: null,     // Timestamp
  updatedAt: null,     // Timestamp
};

// Order item sub-model
export const OrderItemModel = {
  cakeId: '',          // Cake ID
  cakeName: '',        // Cake name
  quantity: 1,         // Quantity ordered
  price: 0,            // Price per item
  subtotal: 0,         // quantity * price
};

// Order statuses
export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment statuses
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate Order ID
 * Format: {CakeNamePrefix}{SerialNum}-{Timestamp}
 * Example: CHOCO001-1703520000
 */
export const generateOrderId = (cakeName, serialNum = 1) => {
  const prefix = cakeName
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 5);
  const serial = String(serialNum).padStart(3, '0');
  const timestamp = Math.floor(Date.now() / 1000);
  return `${prefix}${serial}-${timestamp}`;
};

/**
 * Create new Cake object
 */
export const createCake = (data) => ({
  ...CakeModel,
  ...data,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

/**
 * Create new User object
 */
export const createUser = (data) => ({
  ...UserModel,
  ...data,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

/**
 * Create new Order object
 */
export const createOrder = (data) => ({
  ...OrderModel,
  ...data,
  orderId: generateOrderId(data.items?.[0]?.cakeName || 'ORDER', 1),
  status: OrderStatus.PENDING,
  paymentStatus: PaymentStatus.PENDING,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

/**
 * Create new Feedback object
 */
export const createFeedback = (data) => ({
  ...FeedbackModel,
  ...data,
  id: `fb_${Date.now()}`,
  createdAt: Date.now(),
});
