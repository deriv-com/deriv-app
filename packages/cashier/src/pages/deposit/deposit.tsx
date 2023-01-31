import React from 'react';
import { Loading } from '@deriv/components';
import { useDepositLocked } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { Real, Virtual } from '../../components/cashier-container';
import { CashierOnboarding, CashierOnboardingSideNote } from '../../components/cashier-onboarding';
import CashierLocked from '../../components/cashier-locked';
import CryptoTransactionsHistory from '../../components/crypto-transactions-history';
import Error from '../../components/error';
import FundsProtection from '../../components/funds-protection';
import USDTSideNote from '../../components/usdt-side-note';
import RecentTransaction from '../../components/recent-transaction';
import CryptoDeposit from './crypto-deposit';
import DepositLocked from './deposit-locked';
import SideNote from '../../components/side-note';
import { useCashierStore } from '../../stores/useCashierStores';

type TDeposit = {
    setSideNotes: (notes: object | null) => void;
};

const Deposit = observer(({ setSideNotes }: TDeposit) => {
    const { client } = useStore();
    const {
        can_change_fiat_currency,
        currency,
        current_currency_type,
        is_eu,
        is_switching,
        is_virtual,
        landing_company_shortcode,
        is_pre_appstore,
    } = client;
    const { iframe, deposit, transaction_history, general_store } = useCashierStore();
    const { clearIframe, iframe_height, iframe_url } = iframe;
    const { container, error, onMountDeposit: onMount } = deposit;
    const {
        crypto_transactions,
        is_crypto_transactions_visible,
        onMount: recentTransactionOnMount,
    } = transaction_history;
    const {
        is_cashier_locked,
        is_cashier_onboarding,
        is_crypto,
        is_deposit,
        is_loading,
        is_system_maintenance,
        setActiveTab,
        setIsDeposit,
        cashier_route_tab_index: tab_index,
    } = general_store;
    const is_deposit_locked = useDepositLocked();

    const is_fiat_currency_banner_visible_for_MF_clients =
        landing_company_shortcode === 'maltainvest' && !is_crypto && !can_change_fiat_currency && !!iframe_height;
    React.useEffect(() => {
        if (!is_crypto_transactions_visible) {
            recentTransactionOnMount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    React.useEffect(() => {
        setActiveTab(container);
        onMount();
        return () => {
            setIsDeposit(false);
            error.setErrorMessage({ code: '', message: '' });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActiveTab, onMount, container, error.setErrorMessage]);
    React.useEffect(() => {
        if (typeof setSideNotes === 'function') {
            if (is_switching || is_deposit) setSideNotes(null);
            if (is_crypto && is_deposit && !is_switching) {
                const side_notes = [
                    ...(crypto_transactions.length ? [<RecentTransaction key={2} />] : []),
                    ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                    ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                ];
                if (side_notes.length > 0) {
                    setSideNotes([<SideNote key={0}>{side_notes}</SideNote>]);
                }
            }
            if (is_fiat_currency_banner_visible_for_MF_clients) {
                setSideNotes([
                    <SideNote key={0}>
                        <CashierOnboardingSideNote is_crypto={false} />
                    </SideNote>,
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, tab_index, crypto_transactions, is_cashier_onboarding, iframe_height]);

    if ((is_switching || (is_loading && !iframe_url)) && !is_crypto_transactions_visible) {
        return <Loading is_fullscreen />;
    }
    if (is_virtual) {
        return <Virtual />;
    }
    if (is_system_maintenance) {
        if (is_cashier_locked || (is_deposit_locked && current_currency_type === 'crypto')) {
            return <CashierLocked />;
        }
    }
    if (error.is_ask_uk_funds_protection) {
        return <FundsProtection />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (is_deposit_locked) {
        return <DepositLocked />;
    }
    if (is_crypto_transactions_visible) {
        return <CryptoTransactionsHistory />;
    }

    if (is_deposit || is_eu) {
        if (error.message) {
            return <Error error={error} />;
        }
        if (is_crypto) {
            return <CryptoDeposit />;
        }

        return (
            <>
                {is_fiat_currency_banner_visible_for_MF_clients && (
                    <SideNote is_mobile>
                        <CashierOnboardingSideNote is_crypto={false} />
                    </SideNote>
                )}
                <Real
                    iframe_height={iframe_height}
                    iframe_url={iframe_url}
                    is_loading={is_loading}
                    clearIframe={clearIframe}
                />
            </>
        );
    }
    return <CashierOnboarding setSideNotes={setSideNotes} />;
});

export default Deposit;
