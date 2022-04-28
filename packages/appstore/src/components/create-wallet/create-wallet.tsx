import classNames from 'classnames';
import React from 'react';
import { Icon, Popover, Text, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import WalletIcon from 'Assets/svgs/wallet';
import WalletCard from 'Components/wallet';

type TProps = {
    is_dark_mode_on: boolean;
    should_show_fiat: boolean;
    wallets: { getTitle: () => string; content: string[]; popover_text: () => string }[];
    
};

const CreateWallet = ({ is_dark_mode_on, should_show_fiat, wallets}: TProps) => {

    const [selected_wallet, setSeletedWallet] = React.useState('');

    const onWalletClicked = (wallet: string) => {
        if (!should_show_fiat) {
            setSeletedWallet(wallet);
        }
    };

    const snakeToPascal = (string: string) => {
        return string
            .split('_')
            .map(substr => substr.charAt(0).toUpperCase() + substr.slice(1))
            .join('');
    };

    return (
        <div className='create-wallet'>
            <div className='create-wallet-container'>
                <ThemedScrollbars className='create-wallet-scroll'>
                    <div className='create-wallet-details'>
                        {wallets?.map((wallet, index) => {
                            // TODO: Shouuld replaced with get_account_type result once the BE method get ready
                            return (
                                <div key={`${wallet.getTitle()}${index}`} className='create-wallet-detail'>
                                    <div className='create-wallet-detail-title'>
                                        <Text
                                            align='left'
                                            size='s'
                                            weight='bold'
                                            className='create-wallet-detail-title__text'
                                        >
                                            {wallet.getTitle()}
                                        </Text>
                                        {wallet?.popover_text() !== '' && (
                                            <Popover
                                                alignment='left'
                                                icon='info'
                                                message={localize('***')}
                                                margin={8}
                                                relative_render
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={classNames('create-wallet-list__items', {
                                            'create-wallet-list__items__center': wallet.content?.length < 5,
                                        })}
                                    >
                                        {wallet.content?.map((wallet_name: string, id: number) => {
                                            const name = snakeToPascal(wallet_name || '');
                                            const wallet_logo = `${name}${is_dark_mode_on ? 'Dark' : 'Light'}`;
                                            const is_wallet_selected = selected_wallet === wallet_name;

                                            return (
                                                <div
                                                    key={`${wallet_name}${id}`}
                                                    className={classNames(
                                                        'create-wallet-card-button',
                                                        // { 'wallet-radio-button--disabled': is_disabled },
                                                        { 'create-wallet-card-button__pointer': !should_show_fiat }
                                                    )}
                                                    onClick={() => onWalletClicked(wallet_name)}
                                                >
                                                    {is_wallet_selected && (
                                                        <Icon
                                                            icon='IcAppstoreCheck'
                                                            className='create-wallet-card-icon'
                                                        />
                                                    )}

                                                    <div
                                                        className={classNames(
                                                            'create-wallet-card-button__icon__border',
                                                            {
                                                                'create-wallet-card-button__icon__border--red':
                                                                    is_wallet_selected,
                                                            }
                                                        )}
                                                    >
                                                        {should_show_fiat && (
                                                            <div className='create-wallet-fiat-icon'>
                                                                <WalletIcon icon={wallet_logo} />
                                                            </div>
                                                        )}
                                                        {!should_show_fiat && (
                                                            <WalletCard size='small' wallet_name={wallet_name} />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ThemedScrollbars>
            </div>
        </div>
    );
};

export default CreateWallet;
