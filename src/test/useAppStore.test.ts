import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../../store/useAppStore';

describe('Zustand Store - useAppStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useAppStore.setState({
            user: null,
            modals: {
                assessment: false,
                contact: false,
                login: false,
                search: false,
                leadCapture: false,
            },
            selectedService: '',
            searchQuery: '',
            leadCaptureMode: 'download',
            leadCaptureContext: '',
            chatTrigger: null,
        });
    });

    describe('User State', () => {
        it('should initialize with null user', () => {
            const { result } = renderHook(() => useAppStore());

            expect(result.current.user).toBeNull();
        });

        it('should set user', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.setUser({
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'admin',
                });
            });

            expect(result.current.user).toEqual({
                name: 'Test User',
                email: 'test@example.com',
                role: 'admin',
            });
        });

        it('should clear user on logout', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.setUser({ name: 'Test', email: 'test@test.com' });
            });

            expect(result.current.user).not.toBeNull();

            act(() => {
                result.current.setUser(null);
            });

            expect(result.current.user).toBeNull();
        });
    });

    describe('Modal State', () => {
        it('should initialize with all modals closed', () => {
            const { result } = renderHook(() => useAppStore());

            expect(result.current.modals).toEqual({
                assessment: false,
                contact: false,
                login: false,
                search: false,
                leadCapture: false,
            });
        });

        it('should open modal', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.openModal('contact');
            });

            expect(result.current.modals.contact).toBe(true);
            expect(result.current.modals.login).toBe(false);
        });

        it('should close modal', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.openModal('login');
            });

            expect(result.current.modals.login).toBe(true);

            act(() => {
                result.current.closeModal('login');
            });

            expect(result.current.modals.login).toBe(false);
        });

        it('should close all modals', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.openModal('contact');
                result.current.openModal('login');
                result.current.openModal('search');
            });

            expect(result.current.modals.contact).toBe(true);
            expect(result.current.modals.login).toBe(true);
            expect(result.current.modals.search).toBe(true);

            act(() => {
                result.current.closeAllModals();
            });

            expect(result.current.modals).toEqual({
                assessment: false,
                contact: false,
                login: false,
                search: false,
                leadCapture: false,
            });
        });
    });

    describe('Chat Trigger', () => {
        it('should trigger chat with message', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.triggerChat('Test question');
            });

            expect(result.current.chatTrigger).toMatchObject({
                message: 'Test question',
            });
            expect(result.current.chatTrigger?.timestamp).toBeGreaterThan(0);
        });

        it('should clear chat trigger', () => {
            const { result } = renderHook(() => useAppStore());

            act(() => {
                result.current.triggerChat('Test');
            });

            expect(result.current.chatTrigger).not.toBeNull();

            act(() => {
                result.current.clearChatTrigger();
            });

            expect(result.current.chatTrigger).toBeNull();
        });
    });
});
