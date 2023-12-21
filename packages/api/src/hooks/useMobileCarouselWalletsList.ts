import { useState, useEffect } from 'react';
import useWalletAccountsList from './useWalletAccountsList';
import useCurrencyConfig from './useCurrencyConfig';

/** A custom hook that gets the list of all wallet accounts for the current user. */
const useMobileCarouselWalletsList = () => {
    const { data: walletAccountsList, isLoading } = useWalletAccountsList();
    const { isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const [staleWalletAccountsList, setStaleWalletAccountslist] = useState(walletAccountsList);
    const [staleIsLoading, setStaleIsLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isCurrencyConfigLoading && walletAccountsList && !staleWalletAccountsList) {
            setStaleIsLoading(false);
            setStaleWalletAccountslist(walletAccountsList);
        }

        if (
            !isLoading &&
            !isCurrencyConfigLoading &&
            walletAccountsList &&
            staleWalletAccountsList &&
            staleWalletAccountsList?.length !== walletAccountsList?.length
        ) {
            setStaleWalletAccountslist(walletAccountsList);
        }
    }, [isLoading, isCurrencyConfigLoading, walletAccountsList]);

    return {
        /** The list of wallet accounts for the current user. */
        data: staleWalletAccountsList,
        isLoading: staleIsLoading,
    };
};

export default useMobileCarouselWalletsList;
