import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightCashierNoBalanceIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import { THooks } from '../../../../types';

type TWithdrawalNoBalanceProps = {
    activeWallet: THooks.ActiveWalletAccount;
};

const WithdrawalNoBalance: React.FC<TWithdrawalNoBalanceProps> = ({ activeWallet }) => {
    const history = useHistory();
    const { localize } = useTranslations();

    return (
        <ActionScreen
            actionButtons={
                <Button onClick={() => history.push('/wallet/deposit')} size='lg' textSize='md'>
                    <Localize i18n_default_text='Add funds' />
                </Button>
            }
            description={localize("You don't have funds in your {{currency}} Wallet to complete a withdrawal.", {
                currency: activeWallet.currency,
            })}
            descriptionSize='md'
            icon={<DerivLightCashierNoBalanceIcon height='128px' width='128px' />}
            title={
                <Localize
                    i18n_default_text='No funds in {{currency}} Wallet'
                    values={{ currency: activeWallet.currency }}
                />
            }
        />
    );
};

export default WithdrawalNoBalance;
