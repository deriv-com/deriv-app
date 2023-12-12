import React, { createContext, useContext, useState } from 'react';

type Region = 'EU' | 'Non-EU';

type TUIState = {
    region: Region;
};

type TUIContext = {
    setUIState: (key: keyof TUIState, value: TUIState[typeof key]) => void;
    uiState: TUIState;
};

const UIContext = createContext<TUIContext | null>(null);

export const useUI = () => {
    const context = useContext(UIContext);

    if (!context)
        throw new Error(
            'useUI must be used within a UIProvider. Make sure you have wrapped your component with UIProvider.'
        );

    return context;
};

export const useUpdateUI = (key: keyof TUIState, value: TUIState[keyof TUIState]) => {
    const { setUIState } = useUI();
    return () => setUIState(key, value);
};

const UIProvider = ({ children }: React.PropsWithChildren<unknown>) => {
    const [uiState, setUIState] = useState<TUIState>({ region: 'Non-EU' });

    const updateUIState = (key: keyof TUIState, value: TUIState[keyof TUIState]) => {
        setUIState(prevState => ({ ...prevState, [key]: value }));
    };

    return (
        <UIContext.Provider
            value={{
                setUIState: updateUIState,
                uiState,
            }}
        >
            {children}
        </UIContext.Provider>
    );
};

export default UIProvider;
