import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { TMarketTypes, TPlatforms, THooks } from '../../types';

type TCFDState = {
    // Add your CFD states here
    accountId?: string;
    marketType?: TMarketTypes.All;
    platform?: TPlatforms.All;
    selectedJurisdiction?: THooks.AvailableMT5Accounts['shortcode'];
};

type TCFDContext = {
    getCFDState: <T extends keyof TCFDState>(key: T) => TCFDState[T];
    setCfdState: <T extends keyof TCFDState>(key: T, value: TCFDState[T]) => void;
};

const CFDContext = createContext<TCFDContext | null>(null);

export const useCFDContext = () => {
    const context = useContext(CFDContext);

    if (!context) {
        throw new Error('useCFDContext must be used within a CFDProvider. Please import Provider from @deriv/library');
    }

    return context;
};

export const CFDProvider = ({ children }: PropsWithChildren) => {
    const [cfdState, setCfdState] = useState<TCFDState>({});

    const getCFDState = useCallback(
        <T extends keyof TCFDState>(key: T): TCFDState[T] => {
            return cfdState[key];
        },
        [cfdState]
    );

    const updateCFDState = <T extends keyof TCFDState>(key: T, value: TCFDState[T]) => {
        setCfdState(prevState => ({ ...prevState, [key]: value }));
    };

    const providerValue = useMemo(() => ({ getCFDState, setCfdState: updateCFDState }), [getCFDState]);

    return <CFDContext.Provider value={providerValue}>{children}</CFDContext.Provider>;
};
