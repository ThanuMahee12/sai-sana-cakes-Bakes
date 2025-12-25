/**
 * Custom Redux Hooks
 * Type-safe dispatch and selector hooks
 */

import { useDispatch, useSelector } from 'react-redux';

/**
 * Use throughout the app instead of plain `useDispatch`
 */
export const useAppDispatch = () => useDispatch();

/**
 * Use throughout the app instead of plain `useSelector`
 */
export const useAppSelector = useSelector;
