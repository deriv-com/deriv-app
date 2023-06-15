import React from 'react';
import { MobileWrapper } from '@deriv/components';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { isCryptocurrency } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import EmptyState from '../../../../components/empty-state';
import RecentTransaction from '../../../../components/recent-transaction';

type TWithdrawalEmailVerificationEmptyState = {
    send: VoidFunction;
};

const WithdrawalEmailVerificationEmptyState = observer(({ send }: TWithdrawalEmailVerificationEmptyState) => {
    const { client } = useStore();
    const { transaction_history } = useCashierStore();

    React.useEffect(() => {
        transaction_history.onMount();
    }, [transaction_history]);

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
                    onClick: send,
                }}
            />
            <MobileWrapper>{isCryptocurrency(client.currency) && <RecentTransaction />}</MobileWrapper>
        </>
    );
});

export default WithdrawalEmailVerificationEmptyState;
