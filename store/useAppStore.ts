import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    role?: string;
}

interface ModalState {
    assessment: boolean;
    contact: boolean;
    login: boolean;
    search: boolean;
    leadCapture: boolean;
}

interface AppState {
    // User state
    user: User | null;
    setUser: (user: User | null) => void;

    // Modal state
    modals: ModalState;
    openModal: (modal: keyof ModalState) => void;
    closeModal: (modal: keyof ModalState) => void;
    closeAllModals: () => void;

    // Contact form context
    selectedService: string;
    setSelectedService: (service: string) => void;

    // Search context
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Lead capture context
    leadCaptureMode: 'download' | 'consultation';
    leadCaptureContext: string;
    setLeadCaptureContext: (mode: 'download' | 'consultation', context: string) => void;

    // Chat trigger
    chatTrigger: { message: string; timestamp: number } | null;
    triggerChat: (message: string) => void;
    clearChatTrigger: () => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        (set) => ({
            // User state
            user: null,
            setUser: (user) => set({ user }, false, 'setUser'),

            // Modal state
            modals: {
                assessment: false,
                contact: false,
                login: false,
                search: false,
                leadCapture: false,
            },
            openModal: (modal) =>
                set(
                    (state) => ({ modals: { ...state.modals, [modal]: true } }),
                    false,
                    `openModal/${modal}`
                ),
            closeModal: (modal) =>
                set(
                    (state) => ({ modals: { ...state.modals, [modal]: false } }),
                    false,
                    `closeModal/${modal}`
                ),
            closeAllModals: () =>
                set(
                    {
                        modals: {
                            assessment: false,
                            contact: false,
                            login: false,
                            search: false,
                            leadCapture: false,
                        },
                    },
                    false,
                    'closeAllModals'
                ),

            // Contact form context
            selectedService: '',
            setSelectedService: (service) => set({ selectedService: service }, false, 'setSelectedService'),

            // Search context
            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }, false, 'setSearchQuery'),

            // Lead capture context
            leadCaptureMode: 'download',
            leadCaptureContext: '',
            setLeadCaptureContext: (mode, context) =>
                set({ leadCaptureMode: mode, leadCaptureContext: context }, false, 'setLeadCaptureContext'),

            // Chat trigger
            chatTrigger: null,
            triggerChat: (message) =>
                set({ chatTrigger: { message, timestamp: Date.now() } }, false, 'triggerChat'),
            clearChatTrigger: () => set({ chatTrigger: null }, false, 'clearChatTrigger'),
        }),
        { name: 'AppStore' }
    )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useModals = () => useAppStore((state) => state.modals);
export const useModalActions = () => useAppStore((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
}));
