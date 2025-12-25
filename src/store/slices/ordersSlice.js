/**
 * Orders Slice - Redux Toolkit with Entity Adapter
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { ordersService } from '@/services/firebase/database';
import { OrderStatus, PaymentStatus } from '@/models';

// Entity Adapter
const ordersAdapter = createEntityAdapter({
  selectId: (order) => order.id,
  sortComparer: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
});

// Initial state
const initialState = ordersAdapter.getInitialState({
  status: 'idle',
  error: null,
  userOrders: [],
  statusFilter: null,
});

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersService.fetchAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await ordersService.fetchById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrdersByUser = createAsyncThunk(
  'orders/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await ordersService.fetchByUser(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrdersByStatus = createAsyncThunk(
  'orders/fetchByStatus',
  async (status, { rejectWithValue }) => {
    try {
      return await ordersService.fetchByStatus(status);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      return await ordersService.create(orderData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ordersService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await ordersService.updateStatus(id, status);
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ id, paymentStatus }, { rejectWithValue }) => {
    try {
      await ordersService.updatePaymentStatus(id, paymentStatus);
      return { id, paymentStatus };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await ordersService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearStatusFilter: (state) => {
      state.statusFilter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        ordersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        if (action.payload) {
          ordersAdapter.upsertOne(state, action.payload);
        }
      })

      // Fetch by user
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        ordersAdapter.upsertMany(state, action.payload);
      })

      // Fetch by status
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        ordersAdapter.upsertMany(state, action.payload);
      })

      // Create
      .addCase(createOrder.fulfilled, (state, action) => {
        ordersAdapter.addOne(state, action.payload);
      })

      // Update
      .addCase(updateOrder.fulfilled, (state, action) => {
        ordersAdapter.upsertOne(state, action.payload);
      })

      // Update status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        ordersAdapter.updateOne(state, {
          id,
          changes: { status, updatedAt: Date.now() },
        });
      })

      // Update payment status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const { id, paymentStatus } = action.payload;
        ordersAdapter.updateOne(state, {
          id,
          changes: { paymentStatus, updatedAt: Date.now() },
        });
      })

      // Delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        ordersAdapter.removeOne(state, action.payload);
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const { clearError, resetStatus, setStatusFilter, clearStatusFilter } =
  ordersSlice.actions;

// Entity selectors
export const {
  selectAll: selectAllOrders,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
  selectEntities: selectOrderEntities,
  selectTotal: selectTotalOrders,
} = ordersAdapter.getSelectors((state) => state.orders);

// Custom selectors
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectStatusFilter = (state) => state.orders.statusFilter;

export const selectOrdersByStatus = (state, status) =>
  selectAllOrders(state).filter((order) => order.status === status);

export const selectPendingOrders = (state) =>
  selectOrdersByStatus(state, OrderStatus.START);

export const selectInProcessOrders = (state) =>
  selectOrdersByStatus(state, OrderStatus.INPROCESS);

export const selectReadyOrders = (state) =>
  selectOrdersByStatus(state, OrderStatus.READY);

export const selectDeliveredOrders = (state) =>
  selectOrdersByStatus(state, OrderStatus.DELIVERED);

export const selectUnpaidOrders = (state) =>
  selectAllOrders(state).filter(
    (order) => order.paymentStatus === PaymentStatus.PENDING
  );

export default ordersSlice.reducer;
