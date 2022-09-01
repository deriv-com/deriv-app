import * as React from 'react';
import { Authorize } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Money } from '@deriv/components';
import { Text, Accordion, Modal } from '@deriv/ui';
import { ArrayElement } from 'Types';
import WalletCard from 'Components/wallet';
import WalletActionButton from 'Components/wallet-action-button';
import AppstoreAppCard from 'Components/app-card';
import AppsLauncher from 'Components/app-launcher';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';

type WalletAccountProps = {
    account: ArrayElement<Required<Authorize>['account_list']>;
};

type TButtonColor = 'primary' | 'primary-light' | 'secondary' | 'tertiary' | 'monochrome';
type TModalActionButton = {
    id: number;
    text: string;
    color: TButtonColor;
    onClick: () => void;
};

const WalletAccount = observer(({ account }: WalletAccountProps) => {
    const { wallet_store } = useStores();
    const actionButtons: TModalActionButton[] = [
        {
            id: 1,
            text: 'Back to Trading Hub',
            color: 'secondary',
            onClick: () => {
                //your action
            },
        },
    ];

    return (
        <>
            <Accordion
                expand_section
                elevation_type='xs'
                onToggle={() => {
                    /**do something */
                }}
                type='containerWithBorder'
                className='wallet-account'
            >
                <Icon className='wallet-account__background' icon='IcAppstoreDemoWallet' />
                <Accordion.Title size='medium'>
                    <div className='wallet-account__header'>
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
                                    <WalletActionButton size='small' label='Transaction' icon='icAppstoreTransaction' />
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
                                <a href='#' style={{ color: '#FF444F' }}>
                                    {localize('Learn more')}
                                </a>
                            </Text>
                        </div>
                        <Text bold type='paragraph-1' style={{ marginTop: '2rem', marginBottom: '-1rem' }}>
                            {localize('Deriv MT5')}
                        </Text>
                        <div className='wallet-account__options'>
                            <AppsLauncher
                                app_name='Derived'
                                icon_name='TradingDerived'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description='Trade CFDs on MT5 with synthetic indices that simulate real-world market movements.'
                            />

                            <AppsLauncher
                                app_name='Financial'
                                icon_name='TradingFinancial'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                description='Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                            />
                        </div>

                        <Text bold type='paragraph-1' style={{ marginBottom: '-1.5rem' }}>
                            {localize('Deriv X')}
                        </Text>
                        <AppsLauncher
                            app_name='Deriv X2'
                            icon_name='DerivX'
                            is_app_installed={false}
                            button_className='wallet-account__app-launcher-button'
                            jurisdiction=''
                            description='Trade CFDs on Deriv X with synthetic indices that simulate real-world market movements.'
                        />
                        <div>
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
                        <div className='wallet-account__deriv-apps'>
                            <AppsLauncher
                                className='wallet-account__app-launcher--full-width'
                                app_name='Deriv Apps'
                                icon_name='DerivApps'
                                is_app_installed={false}
                                button_className='wallet-account__app-launcher-button'
                                jurisdiction=''
                                handleClick={wallet_store.installDerivApps}
                                description='Trade CFDs on MT5 with forex, stocks & indices, commodities, and cryptocurrencies.'
                            />
                            <div className='test'>apps</div>
                        </div>
                    </div>
                </Accordion.Content>
            </Accordion>

            <Modal open={wallet_store.should_open_modal} onOpenChange={wallet_store.toggleModal}>
                <Modal.Portal>
                    <Modal.Overlay />
                    <Modal.PageContent
                        title='Trading account added'
                        has_close_button={true}
                        has_title_separator={true}
                        has_footer_separator={false}
                        action_buttons={actionButtons}
                        should_prevent_close_on_click_outside={false}
                        style={{ width: '60rem' }}
                    >
                        <div className='wallet-account__app-card-wrapper'>
                            <AppstoreAppCard
                                account_type='Demo'
                                app_card_details={{
                                    app_icon: 'icDxtradeSynthetic',
                                    app_name: 'Deriv Apps',
                                }}
                                size='large'
                                linked
                            />
                            <Text bold={false} type='paragraph-1' align='right'>
                                {localize('You have added a Demo Deriv Apps account.')}
                            </Text>
                        </div>
                    </Modal.PageContent>
                </Modal.Portal>
            </Modal>
        </>
    );
});

export default WalletAccount;
