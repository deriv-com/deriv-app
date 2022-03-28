import React from 'react';
import { Icon, Text, ThemedScrollbars } from '@deriv/components';
import { Localize } from '@deriv/translations';
import CreateWalletDetails from './create-wallet-details';
import Providers from './create-wallet-provider';

type TProps = {
    is_dark_mode_on: boolean;
    setShouldShowFiat: any;
    should_show_fiat: boolean;
};

const CreateWallet = ({ is_dark_mode_on, setShouldShowFiat, should_show_fiat }: TProps) => {
    const wallets = should_show_fiat ? Providers.fiat_wallets : Providers.wallets;
    const header_title = should_show_fiat
        ? Providers.fiat_wallets_header_info.getTitle()
        : Providers.wallets_header_info.getTitle();
    const header_content = should_show_fiat
        ? Providers.fiat_wallets_header_info.getContent()
        : Providers.wallets_header_info.getContent();

    return (
        <div className='create-wallet'>
            <div className='create-wallet-container'>
                <div className='create-wallet-title'>
                    {should_show_fiat && (
                        <Icon
                            icon='IcArrowLeft'
                            className='create-wallet-back'
                            onClick={() => setShouldShowFiat(false)}
                        />
                    )}
                    <div>
                        <Text align='left' size='m' as='h2' weight='bold'>
                            <Localize i18n_default_text={header_title} />
                        </Text>
                        <Text align='left' size='s' as='p' line_height='xxl'>
                            <Localize i18n_default_text={header_content} />
                        </Text>
                    </div>
                </div>
                <ThemedScrollbars className='create-wallet-scroll'>
                    <div className='create-wallet-details'>
                        {wallets?.map((wallet, index) => {
                            // TODO: Shouuld replaced with get_account_type result once the BE method get ready
                            return (
                                <CreateWalletDetails
                                    key={index.toString()}
                                    content={wallet.content}
                                    is_dark_mode_on={is_dark_mode_on}
                                    should_show_fiat={should_show_fiat}
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

export default CreateWallet;
