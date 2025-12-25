/**
 * Firebase Realtime Database Service
 * CRUD operations for all collections
 */

import { database as db } from './config';
import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  onValue,
  off,
} from 'firebase/database';

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

/**
 * Fetch all items from a collection
 */
export const fetchAll = async (collection) => {
  const snapshot = await get(ref(db, collection));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
};

/**
 * Fetch single item by ID
 */
export const fetchById = async (collection, id) => {
  const snapshot = await get(ref(db, `${collection}/${id}`));
  if (!snapshot.exists()) return null;

  return { id, ...snapshot.val() };
};

/**
 * Create new item
 */
export const create = async (collection, data) => {
  const newRef = push(ref(db, collection));
  const timestamp = Date.now();
  const newData = {
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await set(newRef, newData);
  return { id: newRef.key, ...newData };
};

/**
 * Update existing item
 */
export const updateItem = async (collection, id, data) => {
  const updates = {
    ...data,
    updatedAt: Date.now(),
  };
  await update(ref(db, `${collection}/${id}`), updates);
  return { id, ...updates };
};

/**
 * Delete item
 */
export const deleteItem = async (collection, id) => {
  await remove(ref(db, `${collection}/${id}`));
  return id;
};

// ============================================
// CAKES OPERATIONS
// ============================================

export const cakesService = {
  fetchAll: () => fetchAll('cakes'),
  fetchById: (id) => fetchById('cakes', id),
  create: (data) => create('cakes', data),
  update: (id, data) => updateItem('cakes', id, data),
  delete: (id) => deleteItem('cakes', id),

  // Fetch by tag
  fetchByTag: async (tag) => {
    const allCakes = await fetchAll('cakes');
    return allCakes.filter((cake) => cake.tags?.includes(tag));
  },

  // Fetch top rated
  fetchTopRated: async (limit = 10) => {
    const allCakes = await fetchAll('cakes');
    return allCakes
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  },

  // Fetch latest
  fetchLatest: async (limit = 10) => {
    const allCakes = await fetchAll('cakes');
    return allCakes
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, limit);
  },
};

// ============================================
// USERS OPERATIONS
// ============================================

export const usersService = {
  fetchAll: () => fetchAll('users'),
  fetchById: (id) => fetchById('users', id),
  fetchByUid: (uid) => fetchById('users', uid),
  create: (data) => set(ref(db, `users/${data.uid}`), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }),
  update: (uid, data) => updateItem('users', uid, data),
  delete: (uid) => deleteItem('users', uid),

  // Block/Unblock user
  toggleBlock: async (uid, blocked) => {
    await updateItem('users', uid, { blocked });
    return { uid, blocked };
  },

  // Update role
  updateRole: async (uid, role) => {
    await updateItem('users', uid, { role });
    return { uid, role };
  },
};

// ============================================
// ORDERS OPERATIONS
// ============================================

export const ordersService = {
  fetchAll: () => fetchAll('orders'),
  fetchById: (id) => fetchById('orders', id),
  create: (data) => create('orders', data),
  update: (id, data) => updateItem('orders', id, data),
  delete: (id) => deleteItem('orders', id),

  // Fetch by user
  fetchByUser: async (userId) => {
    const allOrders = await fetchAll('orders');
    return allOrders.filter((order) => order.userId === userId);
  },

  // Fetch by status
  fetchByStatus: async (status) => {
    const allOrders = await fetchAll('orders');
    return allOrders.filter((order) => order.status === status);
  },

  // Update status
  updateStatus: async (id, status) => {
    await updateItem('orders', id, { status });
    return { id, status };
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    await updateItem('orders', id, { paymentStatus });
    return { id, paymentStatus };
  },
};

// ============================================
// FEEDBACKS OPERATIONS
// ============================================

export const feedbacksService = {
  fetchAll: () => fetchAll('feedbacks'),
  fetchById: (id) => fetchById('feedbacks', id),
  create: (data) => create('feedbacks', data),
  update: (id, data) => updateItem('feedbacks', id, data),
  delete: (id) => deleteItem('feedbacks', id),

  // Fetch by cake
  fetchByCake: async (cakeId) => {
    const allFeedbacks = await fetchAll('feedbacks');
    return allFeedbacks.filter((fb) => fb.cakeId === cakeId);
  },

  // Fetch by user
  fetchByUser: async (userId) => {
    const allFeedbacks = await fetchAll('feedbacks');
    return allFeedbacks.filter((fb) => fb.userId === userId);
  },

  // Fetch approved only
  fetchApproved: async (cakeId) => {
    const allFeedbacks = await fetchAll('feedbacks');
    return allFeedbacks.filter(
      (fb) => fb.cakeId === cakeId && fb.approved === true
    );
  },

  // Approve feedback
  approve: async (id) => {
    await updateItem('feedbacks', id, { approved: true });
    return { id, approved: true };
  },
};

// ============================================
// REALTIME LISTENERS
// ============================================

export const subscribeToCollection = (collection, callback) => {
  const collectionRef = ref(db, collection);
  onValue(collectionRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const items = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));
    callback(items);
  });

  // Return unsubscribe function
  return () => off(collectionRef);
};
