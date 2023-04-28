import React from 'react';
import { Text, StatusBadge } from '@deriv/components';
import { Localize } from '@deriv/translations';
// import * as All from '@deriv/account';
import { getStatusBadgeConfig } from '@deriv/account';
import { TAccountStatus } from './wallet-header';
import { observer, useStore } from '@deriv/stores';
import { FunctionBody, FunctionDeclaration, FunctionLikeDeclaration } from 'typescript';

type TWalletHeaderBalance = {
    account_status: TAccountStatus;
    balance: string;
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

const WalletHeaderBalance = observer(
    ({ account_status = '', balance = '0.00', currency = 'USD' }: TWalletHeaderBalance) => {
        const {
            traders_hub: { openFailedVerificationModal },
        } = useStore();

        // const getStatusBadgeConfig = (
        //     account_status_local: any,
        //     openFailedVerificationModal_local: any,
        //     selected_account_type: any
        // ) => {
        //     switch (account_status_local) {
        //         case 'pending':
        //             return {
        //                 text: (
        //                     <Localize
        //                         i18n_default_text='<0>Pending verification</0>'
        //                         components={[<Text key={0} weight='bold' size='xxxs' color='var(--status-warning)' />]}
        //                     />
        //                 ),
        //                 icon: 'IcAlertWarning',
        //             };
        //         case 'failed':
        //             return {
        //                 text: (
        //                     <Localize
        //                         i18n_default_text='<0>Verification failed.</0> <1>Why?</1>'
        //                         components={[
        //                             <Text key={0} weight='bold' size='xxxs' color='var(--status-danger)' />,
        //                             <Text
        //                                 key={1}
        //                                 className='link-verification-failed'
        //                                 onClick={() => {
        //                                     openFailedVerificationModal_local(selected_account_type);
        //                                 }}
        //                             />,
        //                         ]}
        //                     />
        //                 ),
        //                 icon: 'IcRedWarning',
        //             };
        //         case 'need_verification':
        //             return {
        //                 text: (
        //                     <Localize
        //                         i18n_default_text='<0>Need verification.</0><1>Verify now</1>'
        //                         components={[
        //                             <Text key={0} weight='bold' size='xxxs' color='var(--status-info)' />,
        //                             <Link key={1} className='link-need-verification' to='/account/proof-of-identity' />,
        //                         ]}
        //                     />
        //                 ),
        //                 icon: 'IcAlertInfo',
        //             };
        //         default:
        //             return {
        //                 text: '',
        //                 icon: '',
        //             };
        //     }
        // };

        const balance_title_size = 'xxs';
        const balance_amount_size = 'm';

        const balance_title_text = '<0>Wallet balance</0>';
        const balance_amount_text = `<0>${balance} ${currency}</0>`;

        // TODO: just for test use blank function and empty object. When BE will be ready
        // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-function
        // console.log('prod: ', typeof getStatusBadgeConfig === 'function');

        const fn = getStatusBadgeConfig(account_status, openFailedVerificationModal, {
            platform: '',
            category: '',
            type: '',
            jurisdiction: 'svg',
        });
        const { text: badge_text, icon: badge_icon } = fn;

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
