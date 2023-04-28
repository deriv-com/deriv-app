import React from 'react';
import classNames from 'classnames';
import Icon from '../../icon';
import './icon.scss';

type TWalletIconProps = {
    account_icon?: string;
    className?: string;
    wallet_bg?: string;
    wallet_icon?: string;
};

const WalletIcon = ({ wallet_icon, account_icon, wallet_bg, className }: TWalletIconProps) => {
    const is_solo = !wallet_icon || !account_icon;
    const icon = wallet_icon || account_icon || '';

    if (!wallet_icon && !account_icon) {
        return null;
    }

    return (
        <div
            className={classNames('wallet-icon', {
                className,
                'wallet-icon--solo': is_solo,
                'wallet-icon--merged': !is_solo,
            })}
        >
            {is_solo ? (
                <div className={classNames('wallet-icon__container', wallet_bg)}>
                    <Icon data_testid='dt_wallet_icon_solo' className='wallet-icon__icon' icon={icon} />
                </div>
            ) : (
                <React.Fragment>
                    <Icon data_testid='dt_account_icon_merged' className='wallet-icon__account' icon={account_icon} />

                    <div className={classNames('wallet-icon__wallet', wallet_bg)}>
                        <Icon
                            data_testid='dt_wallet_icon_merged'
                            className='wallet-icon__wallet-icon'
                            icon={wallet_icon}
                        />
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default WalletIcon;
