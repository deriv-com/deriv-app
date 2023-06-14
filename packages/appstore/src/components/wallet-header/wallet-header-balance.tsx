import React from 'react';
import { Text, StatusBadge } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getStatusBadgeConfig } from '@deriv/account';
import { useStore, observer } from '@deriv/stores';
import { TAccountStatus, TWalletAccount } from 'Types';
import { formatMoney } from '@deriv/shared';

type TWalletHeaderBalance = {
    account_status: TAccountStatus;
} & Pick<TWalletAccount, 'balance' | 'currency'>;

const WalletHeaderBalance = observer(({ account_status, balance, currency }: TWalletHeaderBalance) => {
    const {
        traders_hub: { openFailedVerificationModal },
    } = useStore();

    const balance_amount = (
        <Text weight='bold' size='m'>
            <Localize
                i18n_default_text='{{balance}} {{currency}}'
                values={{
                    balance: formatMoney(currency, balance, true),
                    currency,
                }}
            />
        </Text>
    );

    // TODO: just for test use empty object. When BE will be ready it will be fixed
    const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(account_status, openFailedVerificationModal, {
        platform: '',
        category: '',
        type: '',
        jurisdiction: '',
    });

    return (
        <div className='wallet-header__balance-title-amount'>
            {account_status ? (
                <StatusBadge account_status={account_status} icon={badge_icon} text={badge_text} />
            ) : (
                <React.Fragment>
                    <Text
                        key={0}
                        color='less-prominent'
                        size='xxs'
                        className='wallet-header__balance-title-amount-title'
                    >
                        {localize('Wallet balance')}
                    </Text>
                    {balance_amount}
                </React.Fragment>
            )}
        </div>
    );
});
export default WalletHeaderBalance;
