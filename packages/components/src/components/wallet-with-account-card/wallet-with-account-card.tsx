import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
// import { WalletIcon } from '../wallet-icon';
import Badge from '../badge';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import './wallet-with-account-card.scss';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';

type TWalletWithAccountCardProps = {
    // TODO: This type should be updated when the response is ready
    wallet: {
        balance: string;
        currency: string;
        icon: string;
        icon_type: 'fiat' | 'crypto' | 'app' | 'demo';
        jurisdiction_title: string;
        name: string;
        gradient_class: string;
    };
    size?: 'small' | 'medium' | 'large';
    state?: 'active' | 'add' | 'added' | 'default' | 'disabled' | 'faded';
    app_icon: string;
    onClick?: () => void;
};

type IconComponentProps = {
    size: TWalletWithAccountCardProps['size'];
    icon_type: TWalletWithAccountCardProps['wallet']['icon_type'];
    wallet_icon: TWalletWithAccountCardProps['wallet']['icon'];
    gradient_class: TWalletWithAccountCardProps['wallet']['gradient_class'];
    app_icon: TWalletWithAccountCardProps['app_icon'];
};

const IconComponent = ({ size, icon_type, wallet_icon, gradient_class, app_icon }: IconComponentProps) => {
    let icon_size: React.ComponentProps<typeof AppLinkedWithWalletIcon>['size'] = 'large';
    if (size === 'small') icon_size = 'medium';
    if (size === 'medium') icon_size = isMobile() && icon_type === 'crypto' ? 'medium' : 'large';
    return (
        <AppLinkedWithWalletIcon
            type={icon_type}
            app_icon={app_icon}
            wallet_icon={wallet_icon}
            size={icon_size}
            gradient_class={gradient_class}
        />
    );
};

const WalletWithAccountCard = ({
    wallet,
    size = 'medium',
    state = 'default',
    app_icon,
    onClick,
}: React.PropsWithChildren<TWalletWithAccountCardProps>) => (
    <div className={`wallet-with-account-card wallet-card--${size} wallet-card--${state}`}>
        <div
            className={`wallet-card__container wallet-card__container--${state} wallet-card__container--${size} ${wallet.gradient_class}`}
        >
            {size !== 'small' && <div className='wallet-card__shine' />}
            <div
                className={classNames('wallet-card__container-fade', {
                    [`wallet-card__container-fade--${state}`]: state,
                })}
            />
            {size === 'small' && (
                <IconComponent
                    size={size}
                    icon_type={wallet.icon_type}
                    wallet_icon={wallet.icon}
                    gradient_class={wallet.gradient_class}
                    app_icon={app_icon}
                />
            )}
            {size !== 'small' && (
                <div className={`wallet-card__content wallet-card__content--${size}`}>
                    <div className='wallet-card__top-wrapper'>
                        <IconComponent
                            size={size}
                            icon_type={wallet.icon_type}
                            wallet_icon={wallet.icon}
                            gradient_class={wallet.gradient_class}
                            app_icon={app_icon}
                        />
                        {wallet.jurisdiction_title === 'virtual' ? (
                            <Badge label={localize('Demo')} type='contained' background_color='blue' />
                        ) : (
                            <Badge
                                custom_color='var(--text-prominent)'
                                label={wallet.jurisdiction_title.toUpperCase()}
                                type='bordered'
                            />
                        )}
                    </div>

                    <div className='wallet-card__bottom-wrapper'>
                        {state !== 'add' && state !== 'added' ? (
                            <React.Fragment>
                                <Text color='prominent' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                                    {wallet.name}
                                </Text>
                                <Text color='prominent' weight='bold' size={isMobile() ? 'xxs' : 'xs'}>
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
                                onClick={onClick}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
        {state === 'active' && (
            <div className={`wallet-card__active-icon wallet-card__active-icon--${size}`}>
                <Icon
                    color='brand'
                    data_testid='dt_ic_checkmark_circle'
                    icon='IcCheckmarkCircle'
                    size={size === 'small' ? 16 : 32}
                />
            </div>
        )}
    </div>
);
export default WalletWithAccountCard;
