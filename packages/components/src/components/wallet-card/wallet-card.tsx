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
    badgeText: string;
    size?: 'small' | 'medium' | 'large';
    wallet_name?: string;
    wallet_state?: 'active' | 'add' | 'default' | 'disabled' | 'faded';
};

const WalletCard: React.FC<React.PropsWithChildren<TWalletCardProps>> = ({
    balance,
    currency,
    icon,
    badgeText,
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
                        [`wallet-card__content--${wallet_state}`]: wallet_state,
                    })}
                >
                    <div className='wallet-card__shine' />
                    <div className='wallet-card__top-wrapper'>
                        {icon}
                        <Badge custom_color='var(--text-prominent' label={badgeText} type='bordered' />
                    </div>
                    <div className='wallet-card__bottom-wrapper'>
                        {wallet_state === 'add' ? (
                            <Button
                                className='wallet-card__add-wallet-button'
                                classNameSpan='wallet-card__add-wallet-button-text'
                                icon={
                                    <Icon
                                        className='wallet-card__add-wallet-button-icon'
                                        custom_color='$color-black-1'
                                        icon='IcAddBold'
                                        size={12}
                                    />
                                }
                                text='Add'
                            />
                        ) : (
                            <React.Fragment>
                                <Text color='prominent' size='xxxs'>
                                    {wallet_name} {localize('Wallet')}
                                </Text>
                                <Text color='prominent' weight='bold' size='xs'>
                                    {balance} {currency}
                                </Text>
                            </React.Fragment>
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
