import { useEffect } from 'react';
import { Regulation } from '@/constants';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api-v2';
import useRegulationFlags from './useRegulationFlags';

/**
 * @description This hook contains the logic that is used to switch between EU and non-EU accounts
 * @returns  {buttons: {label: string}[], handleButtonClick: (label: string) => void}
 * @example
 * const { buttons, handleButtonClick } = useRegulationSwitcher();
 */
const useRegulationSwitcher = () => {
    const { switchAccount } = useAuthorize();
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { setUIState, uiState } = useUIContext();
    const currentRegulation = uiState.regulation;
    const { isEU, isHighRisk } = useRegulationFlags();

    const realCRAccount = tradingAccountsList?.find(account => account.loginid.startsWith('CR'))?.loginid ?? '';
    const realMFAccount = tradingAccountsList?.find(account => account.loginid.startsWith('MF'))?.loginid ?? '';

    const { data: activeTrading } = useActiveTradingAccount();

    const buttons = [{ label: Regulation.NonEU }, { label: Regulation.EU }];

    const handleButtonClick = (label: string) => {
        if (label !== currentRegulation) {
            if (label === Regulation.NonEU) {
                setUIState({
                    regulation: Regulation.NonEU,
                });
                if (realCRAccount) {
                    switchAccount(realCRAccount);
                }
            } else {
                setUIState({
                    regulation: Regulation.EU,
                });
                if (realMFAccount) {
                    switchAccount(realMFAccount);
                }
            }
        }
    };

    useEffect(() => {
        if (activeTrading?.loginid.startsWith('CR') || isHighRisk) {
            setUIState({
                regulation: Regulation.NonEU,
            });
        } else if (activeTrading?.loginid.startsWith('MF') || isEU) {
            setUIState({
                regulation: Regulation.EU,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        // Contains the array of buttons to be rendered in the switcher E.g. [{label: 'EU'}, {label: 'Non-EU'}]
        buttons,
        // Contains the function to be called when a button is clicked and to update the state E.g. (label: string) => void
        handleButtonClick,
    };
};

export default useRegulationSwitcher;
