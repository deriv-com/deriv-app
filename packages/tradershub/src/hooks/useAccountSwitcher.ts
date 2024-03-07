import { useCallback, useEffect, useState } from 'react';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api-v2';

const accountTypes = [
    { label: 'Demo', value: 'demo' },
    { label: 'Real', value: 'real' },
] as const;

type TAccountType = typeof accountTypes[number];

/**
 * @description This hook contains the logic that is used to switch between demo and real accounts
 * @returns {selected: {label: string, value: string}, selectAccount: (account: TAccount) => void}
 * @example
 * const { selected, selectAccount } = useAccountSwitcher();
 * selectAccount({ label: 'Demo', value: 'demo' });
 */
const useAccountSwitcher = () => {
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { switchAccount } = useAuthorize();
    const { setUIState } = useUIContext();
    const activeAccountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';
    const activeType = accountTypes.find(account => account.value === activeAccountType);
    const [selectedAccount, setSelected] = useState(activeType);
    const firstRealLoginId = tradingAccountsList?.find(acc => !acc.is_virtual)?.loginid;
    const demoLoginId = tradingAccountsList?.find(acc => acc.is_virtual)?.loginid;

    useEffect(() => {
        if (activeType) {
            setSelected(activeType);
            setUIState({
                accountType: activeAccountType,
            });
        }
    }, [activeAccountType, activeType, setUIState]);

    const setSelectedAccount = useCallback(
        (account: TAccountType) => {
            setSelected(account);
            setUIState({
                accountType: account.value,
            });

            const loginId = account.value === 'demo' ? demoLoginId : firstRealLoginId;
            if (loginId) {
                switchAccount(loginId);
            }
        },
        [demoLoginId, firstRealLoginId, setUIState, switchAccount]
    );

    return {
        // selected: {label: string, value: string}
        selectedAccount,
        // selectAccount: (account: TAccount) => void
        setSelectedAccount,
        // accountTypes: {label: Demo | Real, value: demo | real}[]
        accountTypes,
    };
};

export default useAccountSwitcher;
