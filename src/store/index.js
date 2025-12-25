/**
 * Redux Store Configuration
 * Sai Sana Cakes & Bakes
 */

import { configureStore } from '@reduxjs/toolkit';
import cakesReducer from './slices/cakesSlice';
import usersReducer from './slices/usersSlice';
import ordersReducer from './slices/ordersSlice';
import feedbacksReducer from './slices/feedbacksSlice';

export const store = configureStore({
  reducer: {
    cakes: cakesReducer,
    users: usersReducer,
    orders: ordersReducer,
    feedbacks: feedbacksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript (optional, for future use)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
