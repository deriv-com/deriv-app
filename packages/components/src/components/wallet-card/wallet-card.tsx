import React from 'react';
import { localize } from '@deriv/translations';
import Badge from '../badge';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';
import { isMobile } from '@deriv/shared';
import { WalletIcon } from '../wallet-icon';
import './wallet-card.scss';
import classNames from 'classnames';

type TWalletCardProps = {
    // TODO: This type should be updated when the response is ready
    wallet: any;
    size?: 'small' | 'medium' | 'large';
    state?: 'active' | 'add' | 'added' | 'default' | 'disabled' | 'faded';
};

const WalletCard: React.FC<React.PropsWithChildren<TWalletCardProps>> = ({
    wallet,
    size = 'medium',
    state = 'default',
}) => {
    const IconComponent = () => {
        let icon_size = wallet.icon_type === 'app' ? 'medium' : 'large';
        if (size === 'small') icon_size = 'medium';
        if (size === 'medium') icon_size = isMobile() && wallet.icon_type === 'crypto' ? 'medium' : 'large';

        return (
            <React.Fragment>
                {wallet.icon_type !== 'app' && (
                    <WalletIcon
                        type={wallet.icon_type}
                        icon={wallet.icon}
                        size={icon_size}
                        currency={wallet.currency}
                    />
                )}
                {/* TODO: Update this after app-icon created */}
                {wallet.icon_type === 'app' && <div />}
            </React.Fragment>
        );
    };

    return (
        <div className={`wallet-card wallet-card--${size} wallet-card--${state}`}>
            <div
                className={`wallet-card__container wallet-card__container--${state} wallet-card__container--${size} wallet-card__${wallet.currency}-bg`}
            >
                <div className={`wallet-card__shine wallet-card__shine--${size}`} />
                <div
                    className={classNames('wallet-card__container-fade', {
                        [`wallet-card__container-fade--${state}`]: state,
                    })}
                />
                {size === 'small' && <IconComponent />}
                {size !== 'small' && (
                    <div className={`wallet-card__content wallet-card__content--${size}`}>
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
                <div className={`wallet-card__active-icon wallet-card__active-icon--${size}`}>
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
