import React, { FC } from 'react';
import { useWalletAccountsList } from '@deriv/api-v2';
import { StandaloneCircleExclamationBoldIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import './WalletsDisabledAccountsBanner.scss';

type TProps = {
    disabledAccounts: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number][];
};

const WalletsDisabledAccountsBanner: FC<TProps> = ({ disabledAccounts }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    let disabledAccountsCurrencies = '';
    const disabledAccountsLength = disabledAccounts.length;
    disabledAccounts.forEach((disabledAccount, index) => {
        if (disabledAccountsLength > 1) {
            if (index === disabledAccountsLength - 1) {
                disabledAccountsCurrencies += ` and ${disabledAccount.currency}`;
            } else {
                disabledAccountsCurrencies += `${disabledAccount.currency}, `;
            }
        } else {
            disabledAccountsCurrencies += disabledAccount.currency;
        }
    });
    return (
        <div className='wallets-disabled-account-banner__container'>
            <InlineMessage
                className='wallets-disabled-account-banner__content'
                icon={
                    <StandaloneCircleExclamationBoldIcon
                        className='wallets-disabled-account-notification__icon'
                        data-testid='dt_wallets_disabled_account_notification_icon'
                        fill='#C47D00'
                        iconSize='sm'
                    />
                }
                iconPosition='top'
                type='filled'
                variant='warning'
            >
                <Text lineHeight='lg' size={isDesktop ? 'sm' : 'md'}>
                    <Localize
                        components={[
                            <button
                                className='wallets-disabled-account-notification__button wallets-link wallets-link__variant--dark'
                                key={0}
                                onClick={() => window.LC_API.open_chat_window()}
                            />,
                        ]}
                        i18n_default_text='Your {{currencies}} {{accountType}} {{verb}} disabled. Contact us via <0>live chat</0> for details.'
                        values={{
                            accountType: disabledAccountsLength > 1 ? localize('Wallets') : localize('Wallet'),
                            currencies: disabledAccountsCurrencies,
                            verb: disabledAccountsLength > 1 ? localize('are') : localize('is'),
                        }}
                    />
                </Text>
            </InlineMessage>
        </div>
    );
};

export default WalletsDisabledAccountsBanner;
