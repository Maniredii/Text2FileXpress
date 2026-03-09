import { useState, useCallback } from 'react';
import type { ToastType } from '../components/Toast';
import type { ToastState } from '../types';

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'info',
        visible: false,
    });

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ message, type, visible: true });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    return { toast, showToast, hideToast };
};
