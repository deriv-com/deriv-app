import React from 'react';
import { localize } from '@deriv/translations';
import Badge from '../badge';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import './wallet-card.scss';
import { isMobile } from '@deriv/shared';

type TWalletCardProps = {
    balance?: string;
    currency?: string;
    icon: string;
    jurisdiction_title: string;
    name?: string;
    size?: 'small' | 'normal' | 'large';
    state?: 'active' | 'add' | 'added' | 'default' | 'disabled' | 'faded';
    type?: 'fiat' | 'payment' | 'app';
};

const sizes = {
    fiat: {
        small: 24,
        normal: 32,
        large: 32,
    },
    payment: {
        small: {
            width: 48,
            height: 30,
        },
        normal: {
            width: isMobile() ? 48 : 64,
            height: isMobile() ? 30 : 40,
        },
        large: {
            width: 64,
            height: 40,
        },
    },
    app: {
        single: {
            small: 24,
            normal: 24,
            large: 24,
        },
        linked: {
            small: 'normal',
            normal: 'normal',
            large: 'normal',
        },
    },
};

const WalletCard: React.FC<React.PropsWithChildren<TWalletCardProps>> = ({
    balance = '10,0000', // just for testing
    currency = 'usd', // just for testing
    icon,
    jurisdiction_title = 'svg', // just for testing
    name,
    size = 'normal',
    state = 'default',
    type,
}) => {
    const IconComponent = () => {
        return (
            <React.Fragment>
                {type === 'fiat' && <Icon icon={icon} size={sizes.fiat[size]} />}
                {type === 'payment' && (
                    <Icon icon={icon} width={sizes.payment[size].width} height={sizes.payment[size].height} />
                )}
                {type === 'app' && <Icon icon={icon} size={sizes.fiat[size]} />}
            </React.Fragment>
        );
    };

    return (
        <div className={`wallet-card wallet-card--${size} wallet-card--${state}`}>
            <div className={`wallet-card__container wallet-card__${currency}-bg`}>
                {size === 'small' && <IconComponent />}
                {size !== 'small' && (
                    <div className='wallet-card__content'>
                        <div className='wallet-card__shine' />

                        <div className='wallet-card__top-wrapper'>
                            <IconComponent />
                            <Badge custom_color='var(--text-prominent)' label={jurisdiction_title} type='bordered' />
                        </div>

                        <div className='wallet-card__bottom-wrapper'>
                            {state !== 'add' && state !== 'added' ? (
                                <React.Fragment>
                                    <Text className='wallet-card__bottom-wrapper-wallet-name' color='prominent'>
                                        {name} {localize('Wallet')}
                                    </Text>
                                    <Text
                                        className='wallet-card__bottom-wrapper-balance'
                                        color='prominent'
                                        weight='bold'
                                    >
                                        {balance} {currency}
                                    </Text>
                                </React.Fragment>
                            ) : (
                                <Button
                                    className={`wallet-card__wallet-button wallet-card__wallet-button--${state}`}
                                    classNameSpan='wallet-card__wallet-button-text'
                                    icon={
                                        <Icon
                                            className='wallet-card__wallet-button-icon'
                                            custom_color='$color-black-1'
                                            icon={state === 'added' ? 'IcCheckmarkBold' : 'IcAddBold'}
                                            size={12}
                                        />
                                    }
                                    text={state === 'added' ? localize('Added') : localize('Add')}
                                    is_disabled={state === 'added'}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
            {state === 'active' && (
                <div className='wallet-card__active-icon'>
                    <Icon
                        color='brand'
                        data_testid='ic-checkmark-circle'
                        icon='IcCheckmarkCircle'
                        size={size === 'small' ? 16 : 32}
                    />
                </div>
            )}
        </div>
    );
};
export default WalletCard;
