/**
 * Users Slice - Redux Toolkit with Entity Adapter
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { usersService } from '@/services/firebase/database';

// Entity Adapter - use uid as ID
const usersAdapter = createEntityAdapter({
  selectId: (user) => user.uid,
  sortComparer: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
});

// Initial state
const initialState = usersAdapter.getInitialState({
  status: 'idle',
  error: null,
  currentUser: null,
});

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await usersService.fetchAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserByUid = createAsyncThunk(
  'users/fetchByUid',
  async (uid, { rejectWithValue }) => {
    try {
      return await usersService.fetchByUid(uid);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (userData, { rejectWithValue }) => {
    try {
      await usersService.create(userData);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ uid, data }, { rejectWithValue }) => {
    try {
      return await usersService.update(uid, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (uid, { rejectWithValue }) => {
    try {
      await usersService.delete(uid);
      return uid;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserBlock = createAsyncThunk(
  'users/toggleBlock',
  async ({ uid, blocked }, { rejectWithValue }) => {
    try {
      return await usersService.toggleBlock(uid, blocked);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ uid, role }, { rejectWithValue }) => {
    try {
      return await usersService.updateRole(uid, role);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ============================================
// SLICE
// ============================================

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map id to uid for entity adapter
        const users = action.payload.map((user) => ({
          ...user,
          uid: user.uid || user.id,
        }));
        usersAdapter.setAll(state, users);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch by UID
      .addCase(fetchUserByUid.fulfilled, (state, action) => {
        if (action.payload) {
          usersAdapter.upsertOne(state, action.payload);
        }
      })

      // Create
      .addCase(createUser.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action.payload);
      })

      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        usersAdapter.upsertOne(state, action.payload);
      })

      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        usersAdapter.removeOne(state, action.payload);
      })

      // Toggle block
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const { uid, blocked } = action.payload;
        usersAdapter.updateOne(state, {
          id: uid,
          changes: { blocked },
        });
      })

      // Update role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { uid, role } = action.payload;
        usersAdapter.updateOne(state, {
          id: uid,
          changes: { role },
        });
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const { clearError, resetStatus, setCurrentUser, clearCurrentUser } =
  usersSlice.actions;

// Entity selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserByUid,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectTotal: selectTotalUsers,
} = usersAdapter.getSelectors((state) => state.users);

// Custom selectors
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectAdminUsers = (state) =>
  selectAllUsers(state).filter((user) => user.role === 'admin');
export const selectBlockedUsers = (state) =>
  selectAllUsers(state).filter((user) => user.blocked === true);

export default usersSlice.reducer;
