import React from 'react';
import { useHistory } from 'react-router-dom';
import { DerivLightCashierNoBalanceIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { WalletsActionScreen } from '../../../../components';
import { THooks } from '../../../../types';

type TWithdrawalNoBalanceProps = {
    activeWallet: THooks.ActiveWalletAccount;
};

const WithdrawalNoBalance: React.FC<TWithdrawalNoBalanceProps> = ({ activeWallet }) => {
    const history = useHistory();

    return (
        <WalletsActionScreen
            description={
                <Localize
                    i18n_default_text="You don't have funds in your {{currency}} Wallet to complete a withdrawal."
                    values={{ currency: activeWallet.currency }}
                />
            }
            descriptionSize='md'
            icon={<DerivLightCashierNoBalanceIcon height='128px' width='128px' />}
            renderButtons={() => (
                <Button onClick={() => history.push('/wallet/deposit')} size='lg' textSize='md'>
                    <Localize i18n_default_text='Add funds' />
                </Button>
            )}
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
