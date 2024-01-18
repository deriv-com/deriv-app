import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TUIState = {
    // Add other UI states here
    accountType?: string;
    regulation?: string;
};

type TUIContext = {
    getUIState: <T extends keyof TUIState>(key: T) => TUIState[T];
    setUIState: <T extends keyof TUIState>(key: T, value: TUIState[T]) => void;
};

const UIContext = createContext<TUIContext | null>(null);

export const useUIContext = () => {
    const context = useContext(UIContext);

    if (!context) {
        throw new Error('useUIContext must be used within a UIProvider');
    }

    return context;
};

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
    const [uiState, setUIState] = useState<TUIState>({});

    const getUIState = useCallback(
        <T extends keyof TUIState>(key: T): TUIState[T] => {
            return uiState[key];
        },
        [uiState]
    );

    const updateUIState = <T extends keyof TUIState>(key: T, value: TUIState[T]) => {
        setUIState(prevState => ({ ...prevState, [key]: value }));
    };

    const providerValue = useMemo(() => ({ getUIState, setUIState: updateUIState }), [getUIState]);

    return <UIContext.Provider value={providerValue}>{children}</UIContext.Provider>;
};
