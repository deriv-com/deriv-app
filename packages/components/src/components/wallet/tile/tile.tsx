import React from 'react';
import classNames from 'classnames';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { localize } from '@deriv/translations';
import './tile.scss';

type TAccount = {
    loginid: string;
    label?: string;
    currency?: string;
    balance?: string;
    wallet_icon?: string;
    icon?: string;
    jurisdiction?: string;
};

type TWalletTileProps = {
    account: TAccount;
    className?: string;
    has_hover?: boolean;
    icon: JSX.Element;
    is_active?: boolean;
    is_mobile?: boolean;
    onClick?: () => void;
};

const WalletTile = ({ account, icon, className, has_hover, is_active, is_mobile, onClick }: TWalletTileProps) => {
    if (is_mobile) {
        return (
            <div
                className={classNames(`wallet-tile wallet-tile--mobile ${className}`, {
                    'wallet-tile--hover': has_hover,
                    'wallet-tile--active': is_active,
                })}
                data-testid={`dt_wallet_title_${account.currency?.toLowerCase()}`}
                onClick={() => onClick?.()}
            >
                <div className='wallet-tile__header'>
                    <div className='wallet-tile__icon'>{icon}</div>
                    <span className='wallet-tile__jurisdiction'>{account.jurisdiction}</span>
                </div>

                <div className='wallet-tile__title'>
                    <span className='wallet-tile__label'>{account.label}</span>
                </div>

                <p className='wallet-tile__balance'>
                    {localize('Balance')}: {account.balance} {getCurrencyDisplayCode(account.currency)}
                </p>
            </div>
        );
    }

    return (
        <div
            className={classNames(`wallet-tile ${className}`, {
                'wallet-tile--hover': has_hover,
                'wallet-tile--active': is_active,
            })}
            onClick={() => onClick?.()}
            data-testid={`dt_wallet_title_${account.currency?.toLowerCase()}`}
        >
            <div className='wallet-tile__icon'>{icon}</div>

            <div className='wallet-tile__content'>
                <div>
                    <div className='wallet-tile__title'>
                        <span className='wallet-tile__label'>{account.label}</span>
                    </div>

                    <div>
                        <p className='wallet-tile__balance'>
                            {localize('Balance')}: {account.balance} {getCurrencyDisplayCode(account.currency)}
                        </p>
                    </div>
                </div>

                <span className='wallet-tile__jurisdiction'>{account.jurisdiction}</span>
            </div>
        </div>
    );
};

export default WalletTile;
