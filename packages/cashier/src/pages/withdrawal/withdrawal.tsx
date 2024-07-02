import React from 'react';
import { Loading } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { PageContainer } from 'Components/page-container';
import TransactionsCryptoHistory from '../../components/transactions-crypto-history';
import Error from '../../components/error';
import NoBalance from '../../components/no-balance';
import { SideNoteFAQ } from '../../components/side-notes';
import { DepositCryptoSideNotes } from '../../modules/deposit-crypto/components';
import { useCashierStore } from '../../stores/useCashierStores';
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

    if (!!currency_config && !currency_config?.is_crypto && (verification_code || iframe_url))
        return (
            <PageContainer hide_breadcrumb right={<SideNoteFAQ transaction_type='withdraw' />}>
                <WithdrawalFiat />
            </PageContainer>
        );

    if (!!currency_config && verification_code && currency_config?.is_crypto && !is_withdraw_confirmed)
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
        <PageContainer hide_breadcrumb right={currency_config?.is_crypto ? <WithdrawalSideNotes /> : undefined}>
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
    const { is_transactions_crypto_visible } = transaction_history;

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

    if (is_switching || is_10k_withdrawal_limit_reached === undefined) return <Loading is_fullscreen={false} />;

    if (is_withdrawal_locked || is_10k_withdrawal_limit_reached)
        return (
            <PageContainer hide_breadcrumb>
                <WithdrawalLocked />
            </PageContainer>
        );

    if (!Number(balance))
        return (
            <PageContainer hide_breadcrumb>
                <NoBalance />
            </PageContainer>
        );

    if (error.is_show_full_page && error.message)
        return (
            <PageContainer hide_breadcrumb>
                <Error error={error} />
            </PageContainer>
        );

    if (is_transactions_crypto_visible) return <TransactionsCryptoHistory />;

    return <WithdrawalPageContent />;
});

export default Withdrawal;
