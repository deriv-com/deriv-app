import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import WalletCard from 'Components/wallet';

type TProps = {
    is_dark_mode_on: boolean;
    is_disabled: boolean;
    should_show_fiat: boolean;
    wallet_name: any;
};

const WalletRadioButton = ({ is_dark_mode_on, is_disabled, should_show_fiat, wallet_name }: TProps) => {
    const [is_wallet_selected, setIsWalletSelected] = React.useState(false);

    const onWalletClicked = () => {
        setIsWalletSelected(!is_wallet_selected);
    };

    return (
        <div
            className={classNames('wallet-radio-button', { 'wallet-radio-button--disabled': is_disabled })}
            onClick={onWalletClicked}
        >
            {is_wallet_selected && <Icon icon='IcAppstoreCheck' className='wallet-radio-icon' />}
            {should_show_fiat && (
                <Icon
                    className={classNames('wallet-radio-button__icon__border', {
                        'wallet-radio-button__icon__border--red': is_wallet_selected,
                    })}
                    icon={is_dark_mode_on ? wallet_name.dark : wallet_name.light}
                    width={64}
                    height={40}
                />
            )}
            {!should_show_fiat && (
                <div
                    className={classNames('wallet-radio-button__icon__border', {
                        'wallet-radio-button__icon__border--red': is_wallet_selected,
                    })}
                >
                    <WalletCard size='small' wallet_name={wallet_name} />
                </div>
            )}
        </div>
    );
};

export default WalletRadioButton;
