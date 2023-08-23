import React from 'react';
import { useFetch } from '@deriv/api';
import useAuthorize from './useAuthorize';
import useWalletAccountsList from './useWalletAccountsList';
import useCurrencyConfig from './useCurrencyConfig';
import useAvailableAccounts from './useAvailableAccounts';

const useAvailableWallets = () => {
    const { data } = useAvailableAccounts();
};

export default useAvailableWallets;
