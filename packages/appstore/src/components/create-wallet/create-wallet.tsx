import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, ThemedScrollbars } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import CreateWalletDetails from './create-wallet-details';
import Providers from './create-wallet-provider';

const CreateWallet = () => {
    const { ui } = useStores();
    const { is_dark_mode_on } = ui;

    return (
        <div className='create-wallet'>
            <div className='create-wallet-container'>
                <div className='create-wallet-title'>
                    <Text align='left' size='m' as='h2' weight='bold'>
                        <Localize i18n_default_text='Create a wallet' />
                    </Text>
                    <Text align='left' size='s' as='p' line_height='xxl'>
                        <Localize i18n_default_text='Choose a payment method for your wallet.' />
                    </Text>
                </div>
                <ThemedScrollbars className='create-wallet-scroll'>
                    <div className='create-wallet-details'>
                        {Providers.wallets?.map((wallet, index) => {
                            // TODO: Shouuld replaced with get_account_type result once the BE method get ready
                            return (
                                <CreateWalletDetails
                                    key={index.toString()}
                                    content={wallet.content}
                                    is_dark_mode_on={is_dark_mode_on}
                                    title={wallet.getTitle()}
                                />
                            );
                        })}
                    </div>
                </ThemedScrollbars>
            </div>
        </div>
    );
};

export default observer(CreateWallet);
