/**
 * Feedbacks Slice - Redux Toolkit with Entity Adapter
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { feedbacksService } from '@/services/firebase/database';

// Entity Adapter
const feedbacksAdapter = createEntityAdapter({
  selectId: (feedback) => feedback.id,
  sortComparer: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
});

// Initial state
const initialState = feedbacksAdapter.getInitialState({
  status: 'idle',
  error: null,
  cakeFeedbacks: {},
  pendingApproval: [],
});

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchFeedbacks = createAsyncThunk(
  'feedbacks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await feedbacksService.fetchAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbackById = createAsyncThunk(
  'feedbacks/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await feedbacksService.fetchById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbacksByCake = createAsyncThunk(
  'feedbacks/fetchByCake',
  async (cakeId, { rejectWithValue }) => {
    try {
      const feedbacks = await feedbacksService.fetchByCake(cakeId);
      return { cakeId, feedbacks };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchApprovedFeedbacks = createAsyncThunk(
  'feedbacks/fetchApproved',
  async (cakeId, { rejectWithValue }) => {
    try {
      const feedbacks = await feedbacksService.fetchApproved(cakeId);
      return { cakeId, feedbacks };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbacksByUser = createAsyncThunk(
  'feedbacks/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await feedbacksService.fetchByUser(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedbacks/create',
  async (feedbackData, { rejectWithValue }) => {
    try {
      return await feedbacksService.create(feedbackData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFeedback = createAsyncThunk(
  'feedbacks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await feedbacksService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveFeedback = createAsyncThunk(
  'feedbacks/approve',
  async (id, { rejectWithValue }) => {
    try {
      await feedbacksService.approve(id);
      return { id, approved: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedbacks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await feedbacksService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const feedbacksSlice = createSlice({
  name: 'feedbacks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
    clearCakeFeedbacks: (state, action) => {
      delete state.cakeFeedbacks[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchFeedbacks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        feedbacksAdapter.setAll(state, action.payload);
        // Update pending approval list
        state.pendingApproval = action.payload.filter((fb) => !fb.approved);
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        if (action.payload) {
          feedbacksAdapter.upsertOne(state, action.payload);
        }
      })

      // Fetch by cake
      .addCase(fetchFeedbacksByCake.fulfilled, (state, action) => {
        const { cakeId, feedbacks } = action.payload;
        state.cakeFeedbacks[cakeId] = feedbacks;
        feedbacksAdapter.upsertMany(state, feedbacks);
      })

      // Fetch approved
      .addCase(fetchApprovedFeedbacks.fulfilled, (state, action) => {
        const { cakeId, feedbacks } = action.payload;
        state.cakeFeedbacks[cakeId] = feedbacks;
        feedbacksAdapter.upsertMany(state, feedbacks);
      })

      // Fetch by user
      .addCase(fetchFeedbacksByUser.fulfilled, (state, action) => {
        feedbacksAdapter.upsertMany(state, action.payload);
      })

      // Create
      .addCase(createFeedback.fulfilled, (state, action) => {
        feedbacksAdapter.addOne(state, action.payload);
        // Add to pending if not approved
        if (!action.payload.approved) {
          state.pendingApproval.push(action.payload);
        }
      })

      // Update
      .addCase(updateFeedback.fulfilled, (state, action) => {
        feedbacksAdapter.upsertOne(state, action.payload);
      })

      // Approve
      .addCase(approveFeedback.fulfilled, (state, action) => {
        const { id, approved } = action.payload;
        feedbacksAdapter.updateOne(state, {
          id,
          changes: { approved },
        });
        // Remove from pending
        state.pendingApproval = state.pendingApproval.filter(
          (fb) => fb.id !== id
        );
      })

      // Delete
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        feedbacksAdapter.removeOne(state, action.payload);
        state.pendingApproval = state.pendingApproval.filter(
          (fb) => fb.id !== action.payload
        );
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const { clearError, resetStatus, clearCakeFeedbacks } =
  feedbacksSlice.actions;

// Entity selectors
export const {
  selectAll: selectAllFeedbacks,
  selectById: selectFeedbackById,
  selectIds: selectFeedbackIds,
  selectEntities: selectFeedbackEntities,
  selectTotal: selectTotalFeedbacks,
} = feedbacksAdapter.getSelectors((state) => state.feedbacks);

// Custom selectors
export const selectFeedbacksStatus = (state) => state.feedbacks.status;
export const selectFeedbacksError = (state) => state.feedbacks.error;
export const selectPendingApproval = (state) => state.feedbacks.pendingApproval;
export const selectCakeFeedbacks = (state, cakeId) =>
  state.feedbacks.cakeFeedbacks[cakeId] || [];

export const selectApprovedFeedbacks = (state) =>
  selectAllFeedbacks(state).filter((fb) => fb.approved === true);

export const selectFeedbacksByCakeId = (state, cakeId) =>
  selectAllFeedbacks(state).filter((fb) => fb.cakeId === cakeId);

export const selectAverageRating = (state, cakeId) => {
  const feedbacks = selectFeedbacksByCakeId(state, cakeId).filter(
    (fb) => fb.approved
  );
  if (feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, fb) => acc + (fb.rating || 0), 0);
  return Math.round((sum / feedbacks.length) * 10) / 10;
};

export default feedbacksSlice.reducer;
