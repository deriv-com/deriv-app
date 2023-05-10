import React from 'react';
import './wallet-card.scss';
import { localize } from '@deriv/translations';
import Icon from '../icon';
import Text from '../text';
import Button from '../button';
import classNames from 'classnames';
import Badge from '../badge';
import { GradientBackground } from '../gradient-background';

type WalletCardProps = {
    active?: boolean;
    has_add_button?: boolean;
    balance?: string;
    currency?: string;
    dark?: boolean;
    disabled?: boolean;
    faded?: boolean;
    icon?: JSX.Element;
    jurisdiction: string;
    size?: 'small' | 'medium' | 'large';
    wallet_name?: string;
};

const WalletCard = ({
    active,
    has_add_button,
    balance,
    currency,
    dark,
    disabled,
    faded,
    icon,
    jurisdiction,
    size,
    wallet_name,
}: WalletCardProps) => {
    return (
        <div
            className={classNames('wallet-card', {
                // 'wallet-card--active': active && !disabled,
                'wallet-card--add-wallet': has_add_button,
                'wallet-card--disabled': disabled,
                'wallet-card--dark': dark,
                'wallet-card--faded': faded,
                [`wallet-card--${size}`]: size,
            })}
        >
            <div className='wallet-card__background'>
                <GradientBackground
                    color='var(--general-main-2)'
                    primary='#F44336'
                    secondary='#283991'
                    tertiary='#F44336'
                />
            </div>
            <Icon
                className='wallet-card__active-icon'
                custom_color='var(--text-red)'
                data_testid='ic-checkmark-circle'
                icon='IcCheckmarkCircle'
                size={32}
            />
            <div className={`wallet-card__content wallet-card__content--active`}>
                <div className='wallet-card__top-wrapper'>
                    {icon}
                    <Badge custom_color='var(--text-prominent' label={jurisdiction} type='bordered' />
                </div>
                <div className='wallet-card__bottom-wrapper'>
                    {has_add_button && !active ? (
                        <Button>
                            <Icon icon='IcAddRounded' size={12} className='wallet-card__add-wallet-button-icon' />+ Add
                        </Button>
                    ) : (
                        <React.Fragment>
                            <Text color='prominent' size='xxxs'>
                                USD Wallet
                            </Text>
                            <Text color='prominent' weight='bold' size='xs'>
                                0.00 USD
                            </Text>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
    return (
        <div
            className={classNames('wallet-card', {
                'wallet-card--active': active && !disabled && !add_wallet,
                'wallet-card--add-wallet': add_wallet,
                'wallet-card--disabled': disabled,
                'wallet-card--dark': dark,
                'wallet-card--faded': faded,
                [`wallet-card--${size}`]: size,
            })}
        >
            <div className='wallet-card__background' />
            {active && !disabled && (
                <Icon data_testid='ic-checkmark-circle' icon='IcCheckmarkCircle' className='wallet-card__active-icon' />
            )}
            <div className='wallet-card__content'>
                {size !== 'small' ? (
                    <React.Fragment>
                        <div className='wallet-card__icon-badge'>
                            {icon ? (
                                <div className={classNames('wallet-card__icon')}>
                                    <Icon icon={icon} width={64} height={20} />
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
                        <div className='wallet-card__wallet_name-balance'>
                            {add_wallet && !active ? (
                                <button className='wallet-card__add-wallet-button'>
                                    <Icon
                                        icon='IcAddRounded'
                                        size={12}
                                        className='wallet-card__add-wallet-button-icon'
                                    />
                                    <Text as='span' className='wallet-card__add-wallet-button-text'>
                                        Add
                                    </Text>
                                </button>
                            ) : (
                                <>
                                    <Text
                                        as='div'
                                        line_height='s'
                                        className='wallet-card__wallet_name'
                                    >{`${wallet_name} ${localize('Wallet')}`}</Text>
                                    <Text as='div' line_height='s' weight='bold' className='wallet-card__balance'>
                                        {balance} {currency}
                                    </Text>
                                </>
                            )}
                        </div>
                    </React.Fragment>
                ) : icon ? (
                    <div className={classNames('wallet-card__icon--small')}>
                        <Icon size={24} icon={icon} />
                    </div>
                ) : (
                    <div className={classNames('wallet-card__icon--small', 'wallet-card__icon--placeholder')} />
                )}
            </div>
        </div>
    );
};

export default WalletCard;
