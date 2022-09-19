import React from 'react';
import { useStores } from 'Stores';
import { Tabs } from '@deriv/ui';
import { Icon, Tab } from '@deriv/components';
import { CASHIER_OPTIONS } from './provider';
import AppWalletModal from '../../app-wallet-modal';
import { Withdrawal } from '@deriv/cashier';

const CashierContainer = () => {
    const {
        client: { balance, currency },
        ui: { is_dark_mode_on },
    } = useStores();
    const wallet_name = 'USD';

    return (
        <React.Fragment>
            <AppWalletModal>
                <AppWalletModal.Trigger>
                    <div>Cashier</div>
                </AppWalletModal.Trigger>
                <AppWalletModal.Body
                    balance={balance}
                    currency={currency}
                    dark={false}
                    // message='Transfer is temporarily unavailable.'
                    // message_type='warning'
                    wallet_name={wallet_name}
                >
                    <div className='cashier-container-tabs-background'>
                        <Icon icon='IcAppstoreCashierDemoHeader' size={'100%'} />
                    </div>
                    <div className='cashier-container-tabs'>
                        <Tabs contained>
                            {CASHIER_OPTIONS.map((option, key) => {
                                return (
                                    <Tab
                                        key={key}
                                        label={option.title}
                                        icon={is_dark_mode_on ? option.dark_icon : option.light_icon}
                                        width_of_tab='144px'
                                    >
                                        <div className='cashier-container-tabs-container'>
                                            <>
                                                xxxx
                                                <Withdrawal />
                                            </>
                                        </div>
                                    </Tab>
                                );
                            })}
                        </Tabs>
                    </div>
                </AppWalletModal.Body>
            </AppWalletModal>
        </React.Fragment>
    );
};

export default CashierContainer;
