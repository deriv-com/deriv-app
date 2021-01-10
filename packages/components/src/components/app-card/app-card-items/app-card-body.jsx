import classNames from 'classnames';
import React from 'react';
import { isMobile } from '@deriv/shared';
import Icon from '../../icon';
import Money from '../../money';
import Text from '../../text';

const AppCardBody = ({
    amount,
    app_icon,
    app_name,
    currency,
    getCardLabels,
    getFontColor,
    is_swap_free,
    is_virtual,
    linked_wallet,
    onPlayClick,
    show_footer,
    show_hover_actions,
    variant,
}) => {
    return (
        <div
            className={classNames('dc-app-card-body__wrapper', {
                'dc-app-card-body__wrapper--no-hover':
                    !show_footer && (isMobile() || !show_hover_actions) && variant !== 'default',
                [`dc-app-card-body__wrapper--virtual-${variant}`]: is_virtual,
                [`dc-app-card-body__wrapper--real-${variant}`]: !is_virtual,
            })}
        >
            {!is_virtual && is_swap_free && variant === 'default' && (
                <div className={classNames('dc-app-card__badge', 'dc-app-card-body__badge--swap-free')}>
                    <Text color='colored-background' size='xxxxs' weight='bold'>
                        {getCardLabels().SWAP_FREE}
                    </Text>
                </div>
            )}
            <div className='dc-app-card-body__app-info-wrapper'>
                <Icon
                    icon={app_icon || 'IcDeriv'}
                    className={`dc-app-card-body__app-info-icon
                        dc-app-card-body__app-info-icon--${variant}`}
                    size={variant === 'default' ? 48 : 18}
                />
                <Text
                    color={getFontColor()}
                    className={`dc-app-card-body__app-info-name dc-app-card-body__app-info-name--${variant}`}
                    size={variant === 'default' ? (isMobile() ? 'xsm' : 'sm') : isMobile() ? 'xxs' : 'xs'}
                    weight='bold'
                >
                    {app_name}
                </Text>
            </div>
            <div className='dc-app-card-body__balance-info-wrapper'>
                <div
                    className={`dc-app-card-body__balance-info-content dc-app-card-body__balance-info-content--${variant}`}
                >
                    <Text
                        color={getFontColor()}
                        size={variant === 'default' ? (isMobile() ? 'xs' : 's') : 'xs'}
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
                        {getCardLabels().LINKED}: {linked_wallet}
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
