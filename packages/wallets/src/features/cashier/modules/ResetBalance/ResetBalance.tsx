import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useMutation } from '@deriv/api-v2';
import { DerivLightDemoResetBalanceIcon, DerivLightDemoResetBalanceSuccessfulIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import { WalletLoader } from '../../../../components';
import useAllBalanceSubscription from '../../../../hooks/useAllBalanceSubscription';

const ResetBalance = () => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { isLoading: isResetBalanceLoading, isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const { data: activeWallet } = useActiveWalletAccount();

    const resetBalance = () => {
        mutate();
    };

    const navigateToTransfer = () => history.push('/wallet/account-transfer');
    const isResetBalanceAvailable = balanceData && balanceData?.[activeWallet?.loginid ?? '']?.balance < 10000;

    if (isBalanceLoading) {
        return <WalletLoader />;
    }

    if (isResetBalanceSuccess) {
        return (
            <ActionScreen
                actionButtons={
                    <Button borderWidth='sm' onClick={navigateToTransfer} size='lg' textSize='md'>
                        <Localize i18n_default_text='Transfer funds' />
                    </Button>
                }
                description={localize('Your balance has been reset to 10,000.00 USD.')}
                icon={<DerivLightDemoResetBalanceSuccessfulIcon height={128} />}
                title={localize('Success')}
            />
        );
    }

    if (isResetBalanceAvailable || isResetBalanceLoading) {
        return (
            <ActionScreen
                actionButtons={
                    <Button borderWidth='sm' onClick={resetBalance} size='lg' textSize='md'>
                        <Localize i18n_default_text='Reset balance' />
                    </Button>
                }
                description={localize('Reset your virtual balance to 10,000.00 USD.')}
                icon={<DerivLightDemoResetBalanceIcon height={128} />}
                title={localize('Reset balance')}
            />
        );
    }

    return (
        <ActionScreen
            description={localize('You can reset your balance when it is below USD 10,000.00')}
            icon={<DerivLightDemoResetBalanceIcon height={128} />}
            title={localize('Reset balance unavailable')}
        />
    );
};

export default ResetBalance;
