import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { THooks, TMarketTypes, TPlatforms } from '@/types';

type TCFDState = {
    // Add your CFD states here
    account?: THooks.CtraderAccountsList | THooks.DxtradeAccountsList | THooks.MT5AccountsList;
    accountId?: string;
    description?: string;
    isInvestorPassword?: boolean;
    marketType?: TMarketTypes.All;
    platform?: TPlatforms.All;
    selectedJurisdiction?: THooks.AvailableMT5Accounts['shortcode'];
};

type TCFDContext = {
    cfdState: TCFDState;
    setCfdState: (newState: TCFDState) => void;
};

const CFDContext = createContext<TCFDContext | null>(null);

export const useCFDContext = () => {
    const context = useContext(CFDContext);

    if (!context) {
        throw new Error('useCFDContext must be used within a CFDProvider. Please import Provider from CFDProvider');
    }

    return context;
};

export const CFDProvider = ({ children }: PropsWithChildren) => {
    const [cfdState, setCfdState] = useState<TCFDState>({});

    const updateCFDState = useCallback((newState: TCFDState) => {
        setCfdState(prevState => ({ ...prevState, ...newState }));
    }, []);

    const providerValue = useMemo(
        () => ({
            setCfdState: updateCFDState,
            cfdState,
        }),
        [cfdState, updateCFDState]
    );

    return <CFDContext.Provider value={providerValue}>{children}</CFDContext.Provider>;
};
