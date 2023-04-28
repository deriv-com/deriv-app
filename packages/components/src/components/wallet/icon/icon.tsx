import React from 'react';
import classNames from 'classnames';
import { WalletSmall } from '../small';
import './icon.scss';

type TWalletIconProps = {
    account_icon?: string;
    className?: string;
    wallet_bg?: string;
    wallet_icon?: string;
    account_size?: string;
    wallet_size?: string;
};

const WalletIcon = ({
    wallet_icon,
    account_icon,
    wallet_bg,
    className,
    account_size = '1.6rem',
    wallet_size = '1rem',
}: TWalletIconProps) => {
    const is_solo = !wallet_icon || !account_icon;
    const icon = wallet_icon || account_icon || '';

    if (!wallet_icon && !account_icon) {
        return null;
    }

    return (
        <div className={classNames('wallet-icon', { className, 'wallet-icon--merged': !is_solo })}>
            {is_solo ? (
                <WalletSmall bg={wallet_bg} icon={icon} />
            ) : (
                <React.Fragment>
                    <WalletSmall
                        icon={account_icon}
                        data_testid='dt_account_icon_merged'
                        className='wallet-icon__account'
                        size={account_size}
                    />

                    <WalletSmall
                        icon={wallet_icon}
                        data_testid='dt_wallet_icon_merged'
                        className='wallet-icon__wallet'
                        bg={wallet_bg}
                        size={wallet_size}
                    />
                </React.Fragment>
            )}
        </div>
    );
};

export default WalletIcon;
