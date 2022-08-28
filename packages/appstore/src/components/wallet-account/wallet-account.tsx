import * as React from 'react';
import { Authorize } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Money } from '@deriv/components';
import { Text, Accordion } from '@deriv/ui';
import { ArrayElement } from 'Types';
import WalletCard from 'Components/wallet';
import WalletActionButton from 'Components/wallet-action-button';
import AppsLauncher from 'Components/app-launcher';
import { WS } from '@deriv/shared';

type WalletAccountProps = {
    account: ArrayElement<Required<Authorize>['account_list']>;
};

const WalletAccount = ({ account }: WalletAccountProps) => {
    // const apiCall = async () => {
    //     const response = await WS.authorized.storage.send({
    //         new_account_virtual: 1,
    //         type: "trading"

    //     });

    //     console.log(response)
    // }

    return (
        <div className='simti'>
            <Accordion
                expand_section
                elevation_type='xs'
                onToggle={() => {
                    /**do something */
                }}
                type='containerWithBorder'
                className='wallet-account__accordion'
            >
                <Icon className='wallet-account__background-icon' icon='IcAppstoreDemoWallet' />
                <Accordion.Title size='medium'>
                    <div className='wallet-account'>
                        <div className='wallet-account__background' />
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
                                        <WalletActionButton size='small' label='Reports' icon='icAppstoreTransfer' />
                                        <WalletActionButton
                                            size='small'
                                            label='Transaction'
                                            icon='icAppstoreTransaction'
                                        />
                                        <WalletActionButton
                                            size='small'
                                            label='Reset Balance'
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
                </Accordion.Title>
                <Accordion.Content size='medium'>
                    <div style={{ padding: '2.1rem', overflow: 'hidden' }}>
                        <div className='title'>
                            <Text bold type='subtitle-1'>
                                {localize('CFDs')}
                            </Text>
                            <Text bold={false} type='paragraph-1'>
                                {localize(
                                    'Trade with leverage and tight spreads for better returns on successful trades. '
                                )}
                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Learn more')}
                                </a>
                            </Text>
                        </div>
                        <Text bold type='paragraph-1' style={{ marginTop: '2rem' }}>
                            {localize('Deriv MT5')}
                        </Text>
                        <div className='wallet-account__options'>
                            <AppsLauncher
                                app_name='Derived'
                                icon_name='IcAppstoreTradingAccountsDerived'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description='Trade CFDs on MT5 with synthetic indices that simulate real-world market movements.'
                            />

                            <AppsLauncher
                                app_name='Financial'
                                icon_name='IcAppstoreTradingAccountsFinancial'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description='Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                            />
                        </div>

                        <Text bold type='paragraph-1'>
                            {localize('Deriv X')}
                        </Text>
                        <AppsLauncher
                            app_name='Deriv X2'
                            icon_name='IcAppstoreDx'
                            is_app_installed={false}
                            button_className='wallet-account__app-launcher-button'
                            jurisdiction=''
                            description='Trade CFDs on Deriv X with synthetic indices that simulate real-world market movements.'
                        />
                        <div className='title'>
                            <Text bold type='subtitle-1'>
                                {localize('Options & Multipliers')}
                            </Text>
                            <Text bold={false} type='paragraph-1'>
                                {localize('Earn fixed payouts by predicting price movements with ')}
                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Options')}
                                </a>
                                {localize(', or combine the upside of CFDs with the simplicity of Options with ')}

                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Multipliers')}
                                </a>
                            </Text>
                        </div>
                        <AppsLauncher
                            app_name='Financial'
                            icon_name='IcAppstoreTradingAccountsFinancial'
                            is_app_installed={false}
                            button_className='wallet-account__app-launcher-button'
                            jurisdiction=''
                            description='Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                        />

                        {/* <div>
                            <button onClick={apiCall}>test api call</button>
                        </div> */}
                    </div>
                </Accordion.Content>
            </Accordion>
        </div>
    );
};

export default WalletAccount;
