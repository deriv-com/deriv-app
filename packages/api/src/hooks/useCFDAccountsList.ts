import { useMemo } from 'react';
import useMT5AccountsList from './useMT5AccountsList';
import useDxtradeAccountsList from './useDxtradeAccountsList';
import useDerivezAccountsList from './useDerivezAccountsList';
import useCtraderAccountsList from './useCtraderAccountsList';

/** A custom hook that gets the list created MT5 accounts of the user. */
const useCFDAccountsList = () => {
    const { data: mt5_accounts } = useMT5AccountsList();
    const { data: dxtrade_accounts } = useDxtradeAccountsList();
    const { data: derivez_accounts } = useDerivezAccountsList();
    const { data: ctrader_accounts } = useCtraderAccountsList();

    const data = useMemo(() => {
        if (!mt5_accounts || !dxtrade_accounts || !derivez_accounts || !ctrader_accounts) return;

        return {
            mt5_accounts: mt5_accounts || [],
            dxtrade_accounts: dxtrade_accounts || [],
            derivez_accounts: derivez_accounts || [],
            ctrader_accounts: ctrader_accounts || [],
        };
    }, [mt5_accounts, dxtrade_accounts, derivez_accounts, ctrader_accounts]);

    return {
        /** The list of created MT5 and Non-MT5 accounts */
        data,
    };
};

export default useCFDAccountsList;
