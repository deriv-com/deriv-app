import React from 'react';
import './wallet-card.scss';
import { localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import classNames from 'classnames';

type WalletCardProps = {
    active?: boolean;
    add_wallet?: boolean;
    balance?: string;
    currency?: string;
    dark?: boolean;
    disabled?: boolean;
    faded?: boolean;
    icon?: string;
    jurisdiction?: string;
    size?: 'small' | 'medium' | 'large';
    title?: string;
};

const WalletCard = ({
    active,
    add_wallet,
    balance,
    currency,
    dark,
    disabled,
    faded,
    icon,
    jurisdiction,
    size,
    title,
}: WalletCardProps) => {
    return (
        <div
            className={classNames('wallet-card', {
                'wallet-card--active': active && !disabled && !add_wallet,
                'wallet-card--add-wallet': add_wallet,
                'wallet-card--disabled': disabled,
                'wallet-card--faded': faded,
                [`wallet-card--${size}`]: size,
            })}
        >
            <div className='wallet-card__background' />
            {active && !disabled && !add_wallet && (
                <Icon
                    data_testid='ic-checkmark-circle'
                    icon='IcCheckmarkCircle'
                    style={{ '--fill-color1': 'var(--brand-red-coral)', '--fill-color3': 'white' }}
                    size={32}
                    className={classNames('wallet-card__active-icon', 'dc-icon--red')}
                />
            )}
            <div className='wallet-card__content'>
                <div className='wallet-card__icon-badge'>
                    {icon ? (
                        <div className={classNames('wallet-card__icon')}>
                            <Icon icon={icon} />
                        </div>
                    ) : (
                        <div className={classNames('wallet-card__icon', 'wallet-card__icon--placeholder')} />
                    )}
                    {jurisdiction && (
                        <Text as='div' line_height='s' className='wallet-card__jurisdiction-badge'>
                            {jurisdiction.toUpperCase()}
                        </Text>
                    )}
                </div>
                <div className='wallet-card__active' />
                <div className='wallet-card__title-balance'>
                    {add_wallet ? (
                        <button className='wallet-card__add-wallet-button'>
                            <Icon icon='IcAddRounded' size={12} className='wallet-card__add-wallet-button-icon' />
                            <Text as='span' className='wallet-card__add-wallet-button-text'>
                                Add
                            </Text>
                        </button>
                    ) : (
                        <>
                            <Text as='div' line_height='s' className='wallet-card__title'>{`${title} ${localize(
                                'Wallet'
                            )}`}</Text>
                            <Text as='div' line_height='s' weight='bold' className='wallet-card__balance'>
                                {balance} {currency}
                            </Text>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
