/**
 * Cakes Slice - Redux Toolkit with Entity Adapter
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { cakesService } from '@/services/firebase/database';

// Entity Adapter
const cakesAdapter = createEntityAdapter({
  selectId: (cake) => cake.id,
  sortComparer: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
});

// Initial state
const initialState = cakesAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  topRated: [],
  latest: [],
});

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchCakes = createAsyncThunk(
  'cakes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await cakesService.fetchAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCakeById = createAsyncThunk(
  'cakes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await cakesService.fetchById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopRatedCakes = createAsyncThunk(
  'cakes/fetchTopRated',
  async (limit = 10, { rejectWithValue }) => {
    try {
      return await cakesService.fetchTopRated(limit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLatestCakes = createAsyncThunk(
  'cakes/fetchLatest',
  async (limit = 10, { rejectWithValue }) => {
    try {
      return await cakesService.fetchLatest(limit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCake = createAsyncThunk(
  'cakes/create',
  async (cakeData, { rejectWithValue }) => {
    try {
      return await cakesService.create(cakeData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCake = createAsyncThunk(
  'cakes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await cakesService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCake = createAsyncThunk(
  'cakes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await cakesService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const cakesSlice = createSlice({
  name: 'cakes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCakes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCakes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        cakesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCakes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchCakeById.fulfilled, (state, action) => {
        if (action.payload) {
          cakesAdapter.upsertOne(state, action.payload);
        }
      })

      // Fetch top rated
      .addCase(fetchTopRatedCakes.fulfilled, (state, action) => {
        state.topRated = action.payload;
        cakesAdapter.upsertMany(state, action.payload);
      })

      // Fetch latest
      .addCase(fetchLatestCakes.fulfilled, (state, action) => {
        state.latest = action.payload;
        cakesAdapter.upsertMany(state, action.payload);
      })

      // Create
      .addCase(createCake.fulfilled, (state, action) => {
        cakesAdapter.addOne(state, action.payload);
      })

      // Update
      .addCase(updateCake.fulfilled, (state, action) => {
        cakesAdapter.upsertOne(state, action.payload);
      })

      // Delete
      .addCase(deleteCake.fulfilled, (state, action) => {
        cakesAdapter.removeOne(state, action.payload);
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const { clearError, resetStatus } = cakesSlice.actions;

// Entity selectors
export const {
  selectAll: selectAllCakes,
  selectById: selectCakeById,
  selectIds: selectCakeIds,
  selectEntities: selectCakeEntities,
  selectTotal: selectTotalCakes,
} = cakesAdapter.getSelectors((state) => state.cakes);

// Custom selectors
export const selectCakesStatus = (state) => state.cakes.status;
export const selectCakesError = (state) => state.cakes.error;
export const selectTopRatedCakes = (state) => state.cakes.topRated;
export const selectLatestCakes = (state) => state.cakes.latest;
export const selectCakesByTag = (state, tag) =>
  selectAllCakes(state).filter((cake) => cake.tags?.includes(tag));

export default cakesSlice.reducer;
