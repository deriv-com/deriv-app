import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import Badge from '../badge';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import { GradientBackground } from '../gradient-background';
import { WalletIcon } from '../wallet-icon';
import './wallet-card.scss';

type TWalletCardProps = {
    balance?: string;
    currency?: string;
    icon: JSX.Element;
    badge_text: string;
    size?: 'small' | 'medium' | 'large';
    wallet_name?: string;
    wallet_state?: 'active' | 'add' | 'added' | 'default' | 'disabled' | 'faded';
};

const WalletCard: React.FC<React.PropsWithChildren<TWalletCardProps>> = ({
    balance,
    currency,
    icon,
    badge_text,
    size,
    wallet_name,
    wallet_state = 'default',
}) => (
    <div
        className={classNames('wallet-card', {
            [`wallet-card--${size}`]: size,
            [`wallet-card--${wallet_state}`]: wallet_state,
        })}
    >
        {size === 'small' ? (
            <div className='wallet-card__small-container'>
                <div
                    className={classNames('wallet-card__small-container-overlay', {
                        [`wallet-card__small-container-overlay--${wallet_state}`]: wallet_state,
                    })}
                />
                <WalletIcon icon={icon} primaryColor='#F44336' secondaryColor='#283991' />
            </div>
        ) : (
            <GradientBackground color='var(--general-main-2)' primary='#F44336' secondary='#283991' tertiary='#F44336'>
                <div
                    className={classNames('wallet-card__content', {
                        [`wallet-card__content--${size}`]: size,
                        [`wallet-card__content--${wallet_state}`]: wallet_state,
                    })}
                >
                    <div className='wallet-card__shine' />
                    <div className='wallet-card__top-wrapper'>
                        {icon}
                        <Badge custom_color='var(--text-prominent' label={badge_text} type='bordered' />
                    </div>
                    <div className='wallet-card__bottom-wrapper'>
                        {wallet_state !== 'add' && wallet_state !== 'added' ? (
                            <React.Fragment>
                                <Text className='wallet-card__bottom-wrapper-wallet-name' color='prominent'>
                                    {wallet_name} {localize('Wallet')}
                                </Text>
                                <Text className='wallet-card__bottom-wrapper-balance' color='prominent' weight='bold'>
                                    {balance} {currency}
                                </Text>
                            </React.Fragment>
                        ) : (
                            <Button
                                className={classNames('wallet-card__wallet-button', {
                                    [`wallet-card__wallet-button--${wallet_state}`]: wallet_state,
                                })}
                                classNameSpan='wallet-card__wallet-button-text'
                                icon={
                                    <Icon
                                        className='wallet-card__wallet-button-icon'
                                        custom_color='$color-black-1'
                                        icon={wallet_state === 'added' ? 'IcCheckmarkBold' : 'IcAddBold'}
                                        size={12}
                                    />
                                }
                                text={wallet_state === 'added' ? ' Added' : 'Add'}
                            />
                        )}
                    </div>
                </div>
            </GradientBackground>
        )}
        {wallet_state === 'active' && (
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
export default WalletCard;
