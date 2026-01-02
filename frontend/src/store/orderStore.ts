import { create } from 'zustand';
import { orderService } from '../services/order.service';
import type { Order, CreateOrderDto, CancelOrderDto, OrderQueryDto } from '../types/order.types';
import { handleApiError } from '../api/error-handler';

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    isLoading: boolean;
    error: string | null;
    createOrder: (data: CreateOrderDto) => Promise<Order>;
    fetchMyOrders: (query?: OrderQueryDto) => Promise<void>;
    fetchOrderById: (id: string) => Promise<void>;
    cancelOrder: (id: string, data: CancelOrderDto) => Promise<void>;
    clearCurrentOrder: () => void;
    clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    currentOrder: null,
    pagination: null,
    isLoading: false,
    error: null,

    createOrder: async (data) => {
        set({ isLoading: true });
        try {
            const order = await orderService.createOrder(data);
            set({ currentOrder: order, isLoading: false });
            return order;
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    fetchMyOrders: async (query) => {
        set({ isLoading: true });
        try {
            const res = await orderService.getMyOrders(query);
            set({
                orders: res.orders,
                pagination: res,
                isLoading: false,
            });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    fetchOrderById: async (id) => {
        set({ isLoading: true });
        try {
            const order = await orderService.getMyOrderById(id);
            set({ currentOrder: order, isLoading: false });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    cancelOrder: async (id, data) => {
        set({ isLoading: true });
        try {
            const order = await orderService.cancelMyOrder(id, data);
            set({
                currentOrder: order,
                orders: get().orders.map((o) => (o.id === id ? order : o)),
                isLoading: false,
            });
        } catch (error) {
            const apiError = handleApiError(error);
            set({ error: apiError.message, isLoading: false });
            throw error;
        }
    },

    clearCurrentOrder: () => set({ currentOrder: null }),
    clearError: () => set({ error: null }),
}));

export const useOrders = () => useOrderStore((state) => ({
    orders: state.orders,
    currentOrder: state.currentOrder,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
}));

export const useOrderActions = () => useOrderStore((state) => ({
    createOrder: state.createOrder,
    fetchMyOrders: state.fetchMyOrders,
    fetchOrderById: state.fetchOrderById,
    cancelOrder: state.cancelOrder,
    clearCurrentOrder: state.clearCurrentOrder,
    clearError: state.clearError,
}));