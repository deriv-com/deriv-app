import * as React from 'react';
import { Authorize } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Money } from '@deriv/components';
import { Text, Accordion, Button } from '@deriv/ui';
import { ArrayElement } from 'Types';
import WalletCard from 'Components/wallet';
import WalletActionButton from 'Components/wallet-action-button';
import AppsLauncher from 'Components/app-launcher';
import { observer } from 'mobx-react-lite';

type WalletAccountProps = {
    account: ArrayElement<Required<Authorize>['account_list']>;
};

const WalletAccount = ({ account }: WalletAccountProps) => {
    const isAccountVirtual = account.is_virtual === 1;

    return (
        <Accordion
            expand_section={false}
            elevation_type='xs'
            onToggle={() => {
                // TODO: add some actions if needed; otherwise we need to make this optional
            }}
            type='containerWithBorder'
            className='wallet-account'
        >
            <Icon className='wallet-account__background' icon='IcAppstoreDemoWallet' />
            <Accordion.Title size='medium'>
                <div className='wallet-account__header'>
                    <div className='wallet-account__details'>
                        <div className='wallet-account__logo'>
                            <WalletCard wallet_name={isAccountVirtual ? 'demo' : ''} size='small' />
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
                                    label={localize('Transfer')}
                                    icon='icAppstoreTransfer'
                                />
                                <WalletActionButton
                                    size='small'
                                    label={localize('Transaction')}
                                    icon='icAppstoreTransaction'
                                />
                                <WalletActionButton
                                    size='small'
                                    label={localize('Reset Balance')}
                                    icon='icAppstoreResetBalance'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='wallet-account__balance'>
                        {isAccountVirtual && (
                            <Text bold={false} type='small' align='right'>
                                {localize('Virtual balance')}
                            </Text>
                        )}
                        <Text bold type='subtitle-1'>
                            <Money amount={account.wallet?.balance} currency={account.currency} show_currency />
                        </Text>
                    </div>
                </div>
            </Accordion.Title>
            <Accordion.Content size='medium'>
                <div className='wallet-account__content'>
                    <div>
                        <Text bold type='subtitle-1'>
                            {localize('CFDs')}
                        </Text>
                        <Text bold={false} type='paragraph-1'>
                            {localize(
                                'Trade with leverage and tight spreads for better returns on successful trades. '
                            )}
                            <a href='#' className='link-text'>
                                {localize('Learn more')}
                            </a>
                        </Text>
                    </div>

                    <div className='wallet-account__apps-wrapper'>
                        <div className='wallet-account__apps-title'>
                            <Text bold type='paragraph-1'>
                                {localize('Deriv MT5')}
                            </Text>
                            <Button className='wallet-account__apps-title--link' size='small' color='tertiary'>
                                {localize('Compare accounts')}
                            </Button>
                        </div>
                        <div className='wallet-account__apps '>
                            <AppsLauncher
                                app_name={localize('Derived')}
                                icon_name='TradingDerived'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description={localize(
                                    'Trade CFDs on MT5 with synthetic indices that simulate real-world market movements.'
                                )}
                            />

                            <AppsLauncher
                                app_name={localize('Financial')}
                                icon_name='TradingFinancial'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description={localize(
                                    'Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                                )}
                            />
                        </div>
                    </div>

                    <div className='wallet-account__apps-wrapper'>
                        <div className='wallet-account__apps-title no-mt'>
                            <Text bold type='paragraph-1'>
                                {localize('Deriv X')}
                            </Text>
                        </div>
                        <div className='wallet-account__apps'>
                            <AppsLauncher
                                app_name={localize('Deriv X2')}
                                icon_name='DerivX'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description={localize(
                                    'Trade CFDs on Deriv X with synthetic indices that simulate real-world market movements.'
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <Text bold type='subtitle-1'>
                            {localize('Options & Multipliers')}
                        </Text>
                        <Text bold={false} type='paragraph-1'>
                            {localize('Earn fixed payouts by predicting price movements with ')}
                            <a href='#' className='link-text'>
                                {localize('Options')}
                            </a>
                            {localize(', or combine the upside of CFDs with the simplicity of Options with ')}

                            <a href='#' className='link-text'>
                                {localize('Multipliers')}
                            </a>
                        </Text>
                    </div>
                    <div className='wallet-account__deriv-apps'>
                        <AppsLauncher
                            className='wallet-account__app-launcher--full-width'
                            app_name={localize('Deriv Apps')}
                            icon_name='DerivApps'
                            is_app_installed={false}
                            button_className='wallet-account__app-launcher-button'
                            jurisdiction=''
                            description={localize(
                                'Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                            )}
                        />
                        <div className='test'>apps</div>
                    </div>
                </div>
            </Accordion.Content>
        </Accordion>
    );
};

export default observer(WalletAccount);
