import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TUIState = {
    // Add other UI states here
    accountType?: string;
    isSignupWizardOpen?: boolean;
    regulation?: string;
};

type TUIContext = {
    setUIState: (newState: TUIState) => void;
    uiState: TUIState;
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

    const updateUIState = useCallback((newState: TUIState) => {
        setUIState(prevState => ({ ...prevState, ...newState }));
    }, []);

    const providerValue = useMemo(() => ({ setUIState: updateUIState, uiState }), [uiState, updateUIState]);

    return <UIContext.Provider value={providerValue}>{children}</UIContext.Provider>;
};
