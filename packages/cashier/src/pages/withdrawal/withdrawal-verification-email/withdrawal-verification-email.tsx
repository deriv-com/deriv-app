import React from 'react';
import { observer } from 'mobx-react-lite';
import { MobileWrapper } from '@deriv/components';
import { useVerifyEmail } from '@deriv/hooks';
import { localize, Localize } from '@deriv/translations';
import { isCryptocurrency } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import RecentTransaction from 'Components/recent-transaction';
import EmailVerificationEmptyState from 'Components/email-verification-empty-state';
import EmptyState from 'Components/empty-state';
import Error from 'Components/error';

const WithdrawalVerificationEmail = () => {
    const verify = useVerifyEmail('payment_withdraw');
    const { client, modules } = useStore();
    const { transaction_history } = modules.cashier;

    React.useEffect(() => {
        transaction_history.onMount();
    }, [transaction_history]);

    if (verify.error) return <Error error={verify.error} />;

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
            <MobileWrapper>{isCryptocurrency(client.currency) && <RecentTransaction />}</MobileWrapper>
        </>
    );
};

export default observer(WithdrawalVerificationEmail);
