import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useWS } from '@deriv/shared';
import { useStore } from '@deriv/stores';

type TWalletMigrationContext = {
    state?: string;
    // state?: 'ineligible' | 'eligible' | 'in_progress' | 'migrated' | 'failed';
    is_ineligible: boolean;
    is_eligible: boolean;
    is_in_progress: boolean;
    is_migrated: boolean;
    is_failed: boolean;
    // need to use startMigration, but need to use the same name as in useWalletMigration hook
    start_migration: () => void;
    // need to use resetMigration, but need to use the same name as in useWalletMigration hook
    reset_migration: () => void;
};

type TWalletMigrationProvider = {
    children: React.ReactNode;
};

const WalletMigrationContext = createContext<TWalletMigrationContext | null>(null);

export const useWalletMigrationContext = () => {
    const context = useContext(WalletMigrationContext);

    if (!context) {
        throw new Error('useWalletMigrationContext must be used within a WalletMigrationProvider');
    }
    return context;
};

const WalletMigrationProvider = ({ children }: TWalletMigrationProvider) => {
    const WS = useWS();
    const { client } = useStore();
    const { is_authorize } = client;
    const [state, setState] = useState<string | undefined>(undefined);

    const getState = useCallback(async () => {
        const response = await WS?.send({ wallet_migration: 'state' });
        if (response?.wallet_migration?.state) setState(response?.wallet_migration?.state);
    }, [WS]);

    const startMigration = useCallback(() => WS?.send({ wallet_migration: 'start' }), [WS]);

    const resetMigration = useCallback(() => WS?.send({ wallet_migration: 'reset' }), [WS]);

    useEffect(() => {
        if (is_authorize) getState();
    }, [WS, getState, is_authorize]);

    // check the state every 2 seconds if migration started
    useEffect(() => {
        let id: ReturnType<typeof setInterval>;
        if (state === 'in_progress') {
            id = setInterval(() => {
                getState();
            }, 2000);
        }

        return () => clearInterval(id);
    }, [WS, getState, state]);

    const value = React.useMemo(
        () => ({
            state,
            /** A boolean to check if the status is not_eligible */
            is_ineligible: state === 'ineligible',
            /** A boolean to check if the status is eligible */
            is_eligible: state === 'eligible',
            /** A boolean to check if the status is in_progress */
            is_in_progress: state === 'in_progress',
            /** A boolean to check if the status is completed */
            is_migrated: state === 'migrated',
            /** A boolean to check if the status is failed */
            is_failed: state === 'failed',
            /** Sends a request to wallet_migration API to start the migration process */
            start_migration: startMigration,
            /** Sends a request to wallet_migration API to reset the migration process */
            reset_migration: resetMigration,
        }),
        [resetMigration, startMigration, state]
    );

    return <WalletMigrationContext.Provider value={value}>{children}</WalletMigrationContext.Provider>;
};

export default WalletMigrationProvider;
