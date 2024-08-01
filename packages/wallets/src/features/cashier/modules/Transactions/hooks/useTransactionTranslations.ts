import { useMemo } from 'react';
import { useTranslations } from '@deriv-com/translations';

const useTransactionTranslations = () => {
    const { localize } = useTranslations();

    const translations = useMemo(
        () => ({
            all: localize('All'),
            deposit: localize('Deposit'),
            reset_balance: localize('Reset balance'),
            transfer: localize('Transfer'),
            withdrawal: localize('Withdrawal'),
        }),
        [localize]
    );

    return { localize, translations };
};

export default useTransactionTranslations;
