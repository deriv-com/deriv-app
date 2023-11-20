import { useEffect } from 'react';
import { routes } from '@deriv/shared';
import { useCashierStore } from 'Stores/useCashierStores';
import { RouterChildContext, useHistory } from 'react-router';

/** @deprecated This is a temporary solution to handle routing in cashier. */
const useUnsafeCashierRouteHandler = () => {
    const history: RouterChildContext['router']['history'] = useHistory();
    const { transaction_history, general_store } = useCashierStore();
    const { setIsTransactionsCryptoVisible } = transaction_history;
    const { setIsCashierOnboarding, setIsDeposit } = general_store;

    useEffect(() => {
        const destination_hash = history.location.hash;
        const is_current_route_deposit = history.location.pathname === routes.cashier_deposit;
        const is_hash_deposit = destination_hash === '#deposit';
        const is_hash_transactions_crypto_visible = destination_hash === '#transactions_crypto';
        const is_hash_cashier_onboarding =
            destination_hash === '#cashier_onboarding' || (!is_hash_deposit && !is_hash_transactions_crypto_visible);

        if (is_current_route_deposit) {
            setIsCashierOnboarding(is_hash_cashier_onboarding);
            setIsDeposit(is_hash_deposit);
            setIsTransactionsCryptoVisible(is_hash_transactions_crypto_visible);

            history.replace({ pathname: history.location.pathname, hash: '' });
        } else {
            setIsCashierOnboarding(false);
            setIsDeposit(false);
            setIsTransactionsCryptoVisible(false);
        }
    }, [history, setIsCashierOnboarding, setIsTransactionsCryptoVisible, setIsDeposit]);
};

export default useUnsafeCashierRouteHandler;
