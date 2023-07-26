import { useEffect } from 'react';
import { routes } from '@deriv/shared';
import { useCashierStore } from 'Stores/useCashierStores';
import { RouterChildContext, useHistory } from 'react-router';

/** @deprecated This is a temporary solution to handle routing in cashier. */
const useUnsafeCashierRouteHandler = () => {
    const history: RouterChildContext['router']['history'] = useHistory();
    const { transaction_history, general_store } = useCashierStore();
    const { setIsCryptoTransactionsVisible } = transaction_history;
    const { setIsCashierOnboarding, setIsDeposit } = general_store;

    useEffect(() => {
        const destination_hash = history.location.hash;
        const is_current_route_deposit = history.location.pathname === routes.cashier_deposit;
        const is_hash_deposit = destination_hash === '#deposit';
        const is_hash_crypto_transactions_visible = destination_hash === '#crypto_transactions';
        const is_hash_cashier_onboarding =
            destination_hash === '#cashier_onboarding' || (!is_hash_deposit && !is_hash_crypto_transactions_visible);

        if (is_current_route_deposit) {
            setIsCashierOnboarding(is_hash_cashier_onboarding);
            setIsDeposit(is_hash_deposit);
            setIsCryptoTransactionsVisible(is_hash_crypto_transactions_visible);

            history.replace({ pathname: history.location.pathname, hash: '' });
        }
    }, [history, setIsCashierOnboarding, setIsCryptoTransactionsVisible, setIsDeposit]);
};

export default useUnsafeCashierRouteHandler;
