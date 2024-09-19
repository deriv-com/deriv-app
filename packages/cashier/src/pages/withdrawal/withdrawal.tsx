import React from 'react';
import { useHistory } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { SideNoteFAQ } from '../../components/side-notes';
import { DepositCryptoSideNotes } from '../../modules/deposit-crypto/components';
import { useCashierStore } from '../../stores/useCashierStores';
import PageContainer from '../../components/page-container';
import Error from '../../components/error';
import NoBalance from '../../components/no-balance';
import TransactionsCryptoHistory from '../../components/transactions-crypto-history';
import WithdrawalCryptoForm from './withdrawal-crypto-form';
import WithdrawalCryptoReceipt from './withdrawal-crypto-receipt';
import WithdrawalFiat from './withdrawal-fiat';
import WithdrawalLocked from './withdrawal-locked';
import WithdrawalVerificationEmail from './withdrawal-verification-email';

const WithdrawalSideNotes = observer(() => {
    const { client } = useStore();
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;

    return (
        <>
            <DepositCryptoSideNotes />
            {verification_code && <SideNoteFAQ transaction_type='withdraw' />}
        </>
    );
});

const WithdrawalPageContent = observer(() => {
    const { client } = useStore();
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { iframe, withdraw } = useCashierStore();
    const { iframe_url } = iframe;
    const { is_withdraw_confirmed } = withdraw;
    const currency_config = useCurrentCurrencyConfig();

    if (!currency_config) return <Loading is_fullscreen={false} />;

    const is_crypto_provider = currency_config.platform.cashier.includes('crypto');
    const is_fiat_withdrawal = !is_crypto_provider && (verification_code || iframe_url);
    const is_crypto_withdrawal = is_crypto_provider && verification_code && !is_withdraw_confirmed;

    if (is_fiat_withdrawal)
        return (
            <PageContainer hide_breadcrumb right={<SideNoteFAQ transaction_type='withdraw' />}>
                <WithdrawalFiat />
            </PageContainer>
        );

    if (is_crypto_withdrawal)
        return (
            <PageContainer hide_breadcrumb right={<WithdrawalSideNotes />}>
                <WithdrawalCryptoForm />
            </PageContainer>
        );

    if (is_withdraw_confirmed)
        return (
            <PageContainer hide_breadcrumb right={<WithdrawalSideNotes />}>
                <WithdrawalCryptoReceipt />
            </PageContainer>
        );

    return (
        <PageContainer hide_breadcrumb right={is_crypto_provider ? <WithdrawalSideNotes /> : <React.Fragment />}>
            <WithdrawalVerificationEmail />
        </PageContainer>
    );
});

const Withdrawal = observer(() => {
    const { client } = useStore();
    const {
        balance,
        is_switching,
        verification_code: { payment_withdraw: verification_code },
        setVerificationCode,
        account_limits,
    } = client;
    const { withdraw, transaction_history } = useCashierStore();
    const { is_transactions_crypto_visible, setIsTransactionsCryptoVisible } = transaction_history;
    const history = useHistory();
    const search_params = new URLSearchParams(history.location.search);
    const action_param = search_params?.get('action');
    const {
        check10kLimit,
        error: { setErrorMessage },
        willMountWithdraw,
        error,
        is_10k_withdrawal_limit_reached,
        is_withdrawal_locked,
    } = withdraw;

    React.useEffect(() => {
        return () => {
            setErrorMessage({ code: '', message: '' });
        };
    }, [setErrorMessage]);

    React.useEffect(() => {
        check10kLimit();
    }, [check10kLimit, account_limits?.remainder]);

    React.useEffect(() => {
        return () => setVerificationCode('', 'payment_withdraw');
    }, [setVerificationCode]);

    React.useEffect(() => {
        return () => willMountWithdraw(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [willMountWithdraw]);

    React.useEffect(() => {
        if (action_param === 'crypto_transactions_withdraw') {
            setIsTransactionsCryptoVisible(true);
        }
    }, [action_param, setIsTransactionsCryptoVisible]);

    if (is_switching || is_10k_withdrawal_limit_reached === undefined)
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Loading className='cashier__loader' is_fullscreen={false} />
            </PageContainer>
        );

    if (is_withdrawal_locked || is_10k_withdrawal_limit_reached)
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <WithdrawalLocked />
            </PageContainer>
        );

    if (!Number(balance))
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <NoBalance />
            </PageContainer>
        );

    if (error.is_show_full_page && error.message)
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <Error error={error} />
            </PageContainer>
        );

    if (is_transactions_crypto_visible)
        return (
            <PageContainer hide_breadcrumb>
                <TransactionsCryptoHistory />
            </PageContainer>
        );

    return <WithdrawalPageContent />;
});

export default Withdrawal;
