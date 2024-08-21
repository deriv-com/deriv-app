import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
//TODO: replace with quill-icons
import IcResetDemoBalance from '../../../../public/images/ic-demo-reset-balance.svg';
import IcResetDemoBalanceDone from '../../../../public/images/ic-demo-reset-balance-done.svg';

const ResetBalance = () => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');

    const resetBalance = () => {
        mutate();
    };
    return (
        <ActionScreen
            actionButtons={
                <Button
                    borderWidth='sm'
                    onClick={isResetBalanceSuccess ? () => history.push('/wallet/account-transfer') : resetBalance}
                    size='lg'
                    textSize='md'
                >
                    {isResetBalanceSuccess ? localize('Transfer funds') : localize('Reset balance')}
                </Button>
            }
            description={
                isResetBalanceSuccess
                    ? localize('Your balance has been reset to 10,000.00 USD.')
                    : localize('Reset your virtual balance to 10,000.00 USD.')
            }
            icon={isResetBalanceSuccess ? <IcResetDemoBalanceDone /> : <IcResetDemoBalance />}
            title={isResetBalanceSuccess ? localize('Success') : localize('Reset balance')}
        />
    );
};

export default ResetBalance;
