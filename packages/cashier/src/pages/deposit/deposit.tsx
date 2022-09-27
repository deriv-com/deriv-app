import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import { TRootStore, TClientStore } from 'Types';
import { Real, Virtual } from 'Components/cashier-container';
import { CashierOnboarding, CashierOnboardingSideNote } from 'Components/cashier-onboarding';
import CashierLocked from 'Components/cashier-locked';
import CryptoTransactionsHistory from 'Components/crypto-transactions-history';
import Error from 'Components/error';
import FundsProtection from 'Components/funds-protection';
import USDTSideNote from 'Components/usdt-side-note';
import RecentTransaction from 'Components/recent-transaction';
import CryptoDeposit from './crypto-deposit';
import DepositLocked from './deposit-locked';
import SideNote from 'Components/side-note';

type TDeposit = {
    can_change_fiat_currency: TClientStore['can_change_fiat_currency'];
    container: string;
    crypto_transactions: Array<object>;
    currency: TClientStore['currency'];
    current_currency_type: TClientStore['current_currency_type'];
    clearIframe: () => void;
    error: {
        is_ask_uk_funds_protection?: boolean;
        message?: string;
    };
    iframe_height: number | string;
    iframe_url: string;
    is_cashier_locked: boolean;
    is_cashier_onboarding: boolean;
    is_crypto_transactions_visible: boolean;
    is_crypto: boolean;
    is_deposit_locked: boolean;
    is_deposit: boolean;
    is_eu: TClientStore['is_eu'];
    is_loading: boolean;
    is_switching: TClientStore['is_switching'];
    is_system_maintenance: boolean;
    is_virtual: TClientStore['is_virtual'];
    landing_company_shortcode: TClientStore['landing_company_shortcode'];
    onMount: () => void;
    recentTransactionOnMount: () => void;
    setActiveTab: (container: string) => void;
    setErrorMessage: (error: string) => void;
    setIsDeposit: (isDeposit: boolean) => void;
    setSideNotes: (notes: object | null) => void;
    standpoint: TClientStore['standpoint'];
    tab_index: number;
};

const Deposit = ({
    can_change_fiat_currency,
    crypto_transactions,
    container,
    currency,
    current_currency_type,
    error,
    is_cashier_locked,
    is_cashier_onboarding,
    is_crypto,
    is_crypto_transactions_visible,
    is_deposit,
    is_deposit_locked,
    is_eu,
    iframe_height,
    iframe_url,
    clearIframe,
    is_loading,
    is_switching,
    is_system_maintenance,
    is_virtual,
    landing_company_shortcode,
    onMount,
    recentTransactionOnMount,
    setActiveTab,
    setErrorMessage,
    setIsDeposit,
    setSideNotes,
    tab_index,
}: TDeposit) => {
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
            setErrorMessage('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActiveTab, onMount, container, setErrorMessage]);
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
};

export default connect(({ client, modules }: TRootStore) => ({
    can_change_fiat_currency: client.can_change_fiat_currency,
    clearIframe: modules.cashier.iframe.clearIframe,
    container: modules.cashier.deposit.container,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    error: modules.cashier.deposit.error,
    iframe_height: modules.cashier.iframe.iframe_height,
    iframe_url: modules.cashier.iframe.iframe_url,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_cashier_onboarding: modules.cashier.general_store.is_cashier_onboarding,
    is_crypto_transactions_visible: modules.cashier.transaction_history.is_crypto_transactions_visible,
    is_crypto: modules.cashier.general_store.is_crypto,
    is_deposit_locked: modules.cashier.deposit.is_deposit_locked,
    is_deposit: modules.cashier.general_store.is_deposit,
    is_eu: client.is_eu,
    is_loading: modules.cashier.general_store.is_loading,
    is_switching: client.is_switching,
    is_system_maintenance: modules.cashier.general_store.is_system_maintenance,
    is_virtual: client.is_virtual,
    landing_company_shortcode: client.landing_company_shortcode,
    onMount: modules.cashier.deposit.onMountDeposit,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    setErrorMessage: modules.cashier.deposit.error.setErrorMessage,
    setIsDeposit: modules.cashier.general_store.setIsDeposit,
    standpoint: client.standpoint,
    tab_index: modules.cashier.general_store.cashier_route_tab_index,
}))(Deposit);
