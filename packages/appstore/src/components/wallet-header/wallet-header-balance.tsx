import React from 'react';
import { Text, StatusBadge } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getStatusBadgeConfig } from '@deriv/account';
import { observer, useStore } from '@deriv/stores';
import { TWalletSvgCurrency, TAccountStatus } from 'Types';

type TWalletHeaderBalance = {
    account_status: TAccountStatus;
    balance: string;
    currency: TWalletSvgCurrency;
};

const WalletHeaderBalance = observer(
    ({ account_status = '', balance = '0.00', currency = 'USD' }: TWalletHeaderBalance) => {
        const {
            traders_hub: { openFailedVerificationModal },
        } = useStore();

        const balance_title_size = 'xxs';
        const balance_amount_size = 'm';

        const balance_title_text = '<0>Wallet balance</0>';
        const balance_amount_text = `<0>${balance} ${currency}</0>`;

        // TODO: just for test use empty object. When BE will be ready it will be fixed
        const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(
            account_status,
            openFailedVerificationModal,
            {
                platform: '',
                category: '',
                type: '',
                jurisdiction: '',
            }
        );

        return (
            <div className='wallet-header__balance-title-amount'>
                {account_status ? (
                    <StatusBadge account_status={account_status} icon={badge_icon} text={badge_text} />
                ) : (
                    <React.Fragment>
                        <Localize
                            i18n_default_text={balance_title_text}
                            components={[<Text key={0} color='less-prominent' size={balance_title_size} />]}
                        />
                        <Localize
                            i18n_default_text={balance_amount_text}
                            components={[<Text key={0} weight='bold' size={balance_amount_size} />]}
                        />
                    </React.Fragment>
                )}
            </div>
        );
    }
);
WalletHeaderBalance.displayName = 'WalletHeaderBalance';
export default WalletHeaderBalance;
