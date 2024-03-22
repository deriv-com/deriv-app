import { useCallback, useEffect, useState } from 'react';
import { Regulation } from '@/constants';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize, useIsDIELEnabled, useTradingAccountsList } from '@deriv/api-v2';
import useQueryParams from './useQueryParams';
import useRegulationFlags from './useRegulationFlags';

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
    const activeAccountType = activeTradingAccount?.is_virtual ? accountTypes[0].value : accountTypes[1].value;
    const activeType = accountTypes.find(account => account.value === activeAccountType);
    const [selectedAccount, setSelected] = useState(activeType);
    const firstRealLoginId = tradingAccountsList?.find(acc => !acc.is_virtual)?.loginid;
    const demoLoginId = tradingAccountsList?.find(acc => acc.is_virtual)?.loginid;
    const { data: isDIEL } = useIsDIELEnabled();

    const { isEU } = useRegulationFlags();
    const { openModal } = useQueryParams();

    useEffect(() => {
        if (isDIEL && activeAccountType === accountTypes[0].value) {
            setUIState({
                regulation: Regulation.NonEU,
            });
        }

        if (activeType) {
            setSelected(activeType);
            setUIState({
                accountType: activeAccountType,
            });
        }
    }, [activeAccountType, activeType, isDIEL, setUIState]);

    const setSelectedAccount = useCallback(
        (account: TAccountType) => {
            setSelected(account);
            setUIState({
                accountType: account.value,
            });

            const loginId = account.value === accountTypes[0].value ? demoLoginId : firstRealLoginId;
            if (loginId) {
                switchAccount(loginId);
            }

            // Open the RealAccountCreation modal if the user is in the EU and is switching to a real account
            if (isEU && openModal && account.value === 'real') {
                openModal('RealAccountCreation');
            }
        },
        [demoLoginId, firstRealLoginId, isEU, openModal, setUIState, switchAccount]
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
