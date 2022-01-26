import classNames from 'classnames';
import React from 'react';
import { isMobile } from '@deriv/shared';
import Icon from '../../icon';
import Money from '../../money';
import Text from '../../text';

type AppCardBodyProps = {
    amount: string;
    app_icon: string;
    app_name: string;
    currency: string;
    card_labels: unknown;
    getFontColor: () => void;
    is_swap_free: boolean;
    is_virtual: boolean;
    linked_wallet: string;
    onPlayClick: () => void;
    show_footer: boolean;
    show_hover_actions: boolean;
    variant: unknown;
};

const AppCardBody = ({
    amount,
    app_icon,
    app_name,
    currency,
    card_labels,
    getFontColor,
    is_swap_free,
    is_virtual,
    linked_wallet,
    onPlayClick,
    show_footer,
    show_hover_actions,
    variant,
}: AppCardBodyProps) => {
    const is_real_swap_free = !is_virtual && is_swap_free && variant === 'default';

    const getAppNameFontSize = () => {
        if (variant === 'default') {
            return isMobile() ? 'xsm' : 'sm';
        }
        return isMobile() ? 'xxs' : 'xs';
    };

    const getBalanceAmountFontSize = () => {
        if (variant === 'default') {
            return isMobile() ? 'xs' : 's';
        }
        return 'xs';
    };

    return (
        <div
            className={classNames('dc-app-card-body__wrapper', {
                'dc-app-card-body__wrapper--no-hover':
                    !show_footer && (isMobile() || !show_hover_actions) && variant !== 'default',
                'dc-app-card-body__wrapper--virtual-default': is_virtual && variant === 'default',
                'dc-app-card-body__wrapper--virtual-mini': is_virtual && variant === 'mini',
                'dc-app-card-body__wrapper--virtual-micro': is_virtual && variant === 'micro',
                'dc-app-card-body__wrapper--real-default': !is_virtual && variant === 'default',
                'dc-app-card-body__wrapper--real-mini': !is_virtual && variant === 'mini',
                'dc-app-card-body__wrapper--real-micro': !is_virtual && variant === 'micro',
            })}
        >
            {is_real_swap_free && (
                <div className={classNames('dc-app-card__badge', 'dc-app-card-body__badge--swap-free')}>
                    <Text color='colored-background' size='xxxxs' weight='bold'>
                        {card_labels.SWAP_FREE}
                    </Text>
                </div>
            )}
            <div className='dc-app-card-body__app-info-wrapper'>
                <Icon
                    icon={app_icon || 'IcDeriv'}
                    className={classNames('dc-app-card-body__app-info-icon', {
                        'dc-app-card-body__app-info-icon--default': variant === 'default',
                        'dc-app-card-body__app-info-icon--mini': variant === 'mini',
                        'dc-app-card-body__app-info-icon--micro': variant === 'micro',
                    })}
                    size={variant === 'default' ? 48 : 18}
                />
                <Text
                    color={getFontColor()}
                    className={classNames('dc-app-card-body__app-info-name', {
                        'dc-app-card-body__app-info-name--default': variant === 'default',
                        'dc-app-card-body__app-info-name--mini': variant === 'mini',
                        'dc-app-card-body__app-info-name--micro': variant === 'micro',
                    })}
                    size={getAppNameFontSize()}
                    weight='bold'
                >
                    {app_name}
                </Text>
            </div>
            <div className='dc-app-card-body__balance-info-wrapper'>
                <div
                    className={classNames('dc-app-card-body__balance-info-content', {
                        'dc-app-card-body__balance-info-content--default': variant === 'default',
                        'dc-app-card-body__balance-info-content--mini': variant === 'mini',
                        'dc-app-card-body__balance-info-content--micro': variant === 'micro',
                    })}
                >
                    <Text
                        color={getFontColor()}
                        size={getBalanceAmountFontSize()}
                        weight='bold'
                        line_height={variant === 'default' ? 'm' : 's'}
                    >
                        <Money amount={amount} currency={currency} show_currency />
                    </Text>
                    <Text
                        color={getFontColor()}
                        size={isMobile() ? 'xxxxs' : 'xxxs'}
                        line_height={variant === 'default' ? 'm' : 's'}
                    >
                        {card_labels.LINKED}: {linked_wallet}
                    </Text>
                </div>
                {isMobile() && variant === 'default' && (
                    <div className='dc-app-card-actions__icon--play' onClick={onPlayClick}>
                        <Icon icon='IcPlay' custom_color='var(--icon-dark-background)' size={12} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppCardBody;
