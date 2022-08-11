import * as React from 'react';
import { Authorize } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Money } from '@deriv/components';
import { Text } from '@deriv/ui';
import { ArrayElement } from 'Types';
import WalletCard from 'Components/wallet';
import WalletActionButton from 'Components/wallet-action-button';

type WalletAccountProps = {
    account: ArrayElement<Required<Authorize>['account_list']>;
};

const WalletAccount = ({ account }: WalletAccountProps) => {
    return (
        <div className='wallet-account'>
            <div className='wallet-account__background'>
                {account.is_virtual && <Icon className='wallet-account__background-icon' icon='IcAppstoreDemoWallet' />}
            </div>
            <div className='wallet-account__content'>
                <div className='wallet-account__details'>
                    <div className='wallet-account__logo'>
                        <WalletCard wallet_name={account.is_virtual === 1 ? 'demo' : ''} size='sm' />
                    </div>
                    <div className='wallet-account__info'>
                        <Text bold type='subtitle-2'>
                            <Localize
                                i18n_default_text='Demo {{currency}} wallet'
                                values={{ currency: account.currency }}
                            />
                        </Text>
                        <div className='wallet-account__actions'>
                            <WalletActionButton
                                size='small'
                                label='Reports'
                                visiblity='label-and-icon'
                                icon='icAppstoreTransfer'
                            />
                            <WalletActionButton
                                size='small'
                                label='Transaction'
                                visiblity='label-and-icon'
                                icon='icAppstoreTransaction'
                            />
                            <WalletActionButton
                                size='small'
                                label='Reset Balance
                                '
                                visiblity='label-and-icon
                                '
                                icon='icAppstoreResetBalance'
                            />
                        </div>
                    </div>
                </div>
                <div className='wallet-account__balance'>
                    {account.is_virtual && (
                        <Text bold={false} type='small' align='right'>
                            {localize('Virtual balance')}
                        </Text>
                    )}
                    <Text bold type='subtitle-1'>
                        <Money amount={account.wallet?.balance} currency={account.currency} show_currency />
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default WalletAccount;
