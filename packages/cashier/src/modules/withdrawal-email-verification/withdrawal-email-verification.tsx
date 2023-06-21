import React from 'react';
import { MobileWrapper } from '@deriv/components';
import { useWithdrawalEmailVerification } from '@deriv/hooks';
import { localize, Localize } from '@deriv/translations';
import { isCryptocurrency } from '@deriv/shared';
import { observer } from '@deriv/stores';
import RecentTransaction from '../../components/recent-transaction';
import EmailVerificationEmptyState from '../../components/email-verification-empty-state';
import EmptyState from '../../components/empty-state';
import Error from '../../components/error';
import ErrorStore from '../../stores/error-store';

const WithdrawalEmailVerification = observer(() => {
    const { currency, transaction_history, verify } = useWithdrawalEmailVerification();

    React.useEffect(() => {
        transaction_history.onMount();
    }, [transaction_history]);

    if (verify.error) return <Error error={verify.error as ErrorStore} />;

    if (verify.has_been_sent) return <EmailVerificationEmptyState type={'payment_withdraw'} />;

    return (
        <>
            <EmptyState
                icon='IcCashierAuthenticate'
                title={localize('Please help us verify your withdrawal request.')}
                description={
                    <>
                        <Localize i18n_default_text="Hit the button below and we'll send you an email with a link. Click that link to verify your withdrawal request." />
                        <br />
                        <br />
                        <Localize i18n_default_text='This is to protect your account from unauthorised withdrawals.' />
                    </>
                }
                action={{
                    label: localize('Send email'),
                    onClick: verify.send,
                }}
            />
            <MobileWrapper>{isCryptocurrency(currency) && <RecentTransaction />}</MobileWrapper>
        </>
    );
});

export default WithdrawalEmailVerification;
