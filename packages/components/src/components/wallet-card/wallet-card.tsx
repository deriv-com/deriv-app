import React from 'react';
import './wallet-card.scss';
import Icon from '../icon';
import Text from '../text';
import Button from '../button';
import classNames from 'classnames';
import Badge from '../badge';
import { GradientBackground } from '../gradient-background';
import { WalletIcon } from '../wallet-icon';

type WalletCardProps = {
    active?: boolean;
    has_add_button?: boolean;
    balance?: string;
    currency?: string;
    dark?: boolean;
    disabled?: boolean;
    faded?: boolean;
    icon: JSX.Element;
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
                'wallet-card--add-wallet': has_add_button,
                'wallet-card--dark': dark,
                'wallet-card--faded': faded,
                [`wallet-card--${size}`]: size,
                'wallet-card--disabled': disabled,
            })}
        >
            {size === 'small' ? (
                <div className='wallet-card__small-container'>
                    <div
                        className={classNames('wallet-card__small-container-overlay', {
                            'wallet-card__small-container-overlay--active': active && !disabled,
                            'wallet-card__small-container-overlay--hover': !disabled,
                        })}
                    />
                    <WalletIcon icon={icon} primaryColor='#F44336' secondaryColor='#283991' />
                </div>
            ) : (
                <GradientBackground
                    color='var(--general-main-2)'
                    primary='#F44336'
                    secondary='#283991'
                    tertiary='#F44336'
                >
                    <div
                        className={classNames('wallet-card__content', {
                            'wallet-card__content--active': active && !disabled,
                            'wallet-card__content--hover': !disabled,
                        })}
                    >
                        <div className='wallet-card__shine' />
                        <div className='wallet-card__top-wrapper'>
                            {icon}
                            <Badge custom_color='var(--text-prominent' label={jurisdiction} type='bordered' />
                        </div>
                        <div className='wallet-card__bottom-wrapper'>
                            {has_add_button && !active ? (
                                <Button>
                                    <Icon
                                        icon='IcAddRounded'
                                        size={12}
                                        className='wallet-card__add-wallet-button-icon'
                                    />
                                    + Add
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
                </GradientBackground>
            )}
            {active && (
                <Icon
                    className={classNames('wallet-card__active-icon', {
                        [`wallet-card__active-icon--small`]: size === 'small',
                    })}
                    color='brand'
                    data_testid='ic-checkmark-circle'
                    icon='IcCheckmarkCircle'
                    size={size === 'small' ? 16 : 32}
                />
            )}
        </div>
    );
};
export default WalletCard;
