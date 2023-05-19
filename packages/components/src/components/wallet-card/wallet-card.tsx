import React from 'react';
import { localize } from '@deriv/translations';
import Badge from '../badge';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import { isMobile } from '@deriv/shared';
import { WalletIcon } from '../wallet-icon';
import './wallet-card.scss';

type TSizes = {
    // TODO: This type need to be updated
    [key: string]: any;
};

type TWalletCardProps = {
    // TODO: This type should be updated when the response is ready
    wallet: any;
    size?: 'small' | 'normal' | 'large';
    state?: 'active' | 'add' | 'added' | 'default' | 'disabled' | 'faded';
};

const sizes: TSizes = {
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
    wallet,
    size = 'normal',
    state = 'default',
}) => {
    const IconComponent = () => {
        const is_app_single = wallet.type === 'app' && !wallet.wallet_icon;
        const is_app_linked = wallet.type === 'app' && wallet.wallet_icon;
        const type_sizes = sizes[wallet.type as keyof TSizes];

        return (
            <React.Fragment>
                {wallet.type === 'fiat' && (
                    <Icon icon={wallet.icon} size={type_sizes[size as keyof typeof type_sizes]} />
                )}
                {wallet.type === 'payment' && (
                    <Icon icon={wallet.icon} width={type_sizes[size].width} height={type_sizes[size].height} />
                )}
                {wallet.type === 'app' && (
                    <React.Fragment>
                        {is_app_single && <Icon icon={wallet.icon} size={type_sizes.single[size]} />}
                        {is_app_linked && (
                            <WalletIcon
                                app_icon={wallet.icon}
                                wallet_icon={wallet.wallet_icon}
                                size={sizes.app.linked[size]}
                                currency={wallet.currency}
                                type={wallet.type}
                            />
                        )}
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    };

    return (
        <div className={`wallet-card wallet-card--${size} wallet-card--${state}`}>
            <div className={`wallet-card__container wallet-card__${wallet.currency}-bg`}>
                {size === 'small' && <IconComponent />}
                {size !== 'small' && (
                    <div className='wallet-card__content'>
                        <div className='wallet-card__shine' />

                        <div className='wallet-card__top-wrapper'>
                            <IconComponent />
                            <Badge
                                custom_color='var(--text-prominent)'
                                label={wallet.jurisdiction_title}
                                type='bordered'
                            />
                        </div>

                        <div className='wallet-card__bottom-wrapper'>
                            {state !== 'add' && state !== 'added' ? (
                                <React.Fragment>
                                    <Text className='wallet-card__bottom-wrapper-wallet-name' color='prominent'>
                                        {wallet.name} {localize('Wallet')}
                                    </Text>
                                    <Text
                                        className='wallet-card__bottom-wrapper-balance'
                                        color='prominent'
                                        weight='bold'
                                    >
                                        {wallet.balance} {wallet.currency}
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
