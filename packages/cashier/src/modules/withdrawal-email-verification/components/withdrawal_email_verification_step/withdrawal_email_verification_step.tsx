import React from 'react';
import { useVerifyEmail } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import EmptyState from '../../../../components/empty-state';
import { useCashierStore } from '../../../../stores/useCashierStores';

const WithdrawalEmailVerificationStep = observer(() => {
    const { send } = useVerifyEmail('payment_withdraw');
    const { client } = useStore();
    const { transaction_history } = useCashierStore();

    return (
        <EmptyState
            icon='IcCashierAuthenticate'
            title='Please help us verify your withdrawal request.'
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
                onClick: send,
            }}
        />
    );
});

export default WithdrawalEmailVerificationStep;
