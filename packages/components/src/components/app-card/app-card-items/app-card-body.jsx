import classNames from 'classnames';
import React from 'react';
import Icon from '../../icon';
import Money from '../../money';
import Text from '../../text';
import { isMobile } from '@deriv/shared';

const AppCardBody = ({
    amount,
    app_icon,
    app_name,
    currency,
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
            className={classNames('dc-app-card__body-wrapper', {
                'dc-app-card__body-wrapper--no-hover':
                    !show_footer && (isMobile() || !show_hover_actions) && variant !== 'default',
                [`dc-app-card__body-wrapper--virtual-${variant}`]: is_virtual,
                [`dc-app-card__body-wrapper--real-${variant}`]: !is_virtual,
            })}
        >
            {!is_virtual && is_swap_free && variant === 'default' && (
                <div className={classNames('dc-app-card__badge', 'dc-app-card__body-badge--swap-free')}>
                    <Text color='colored-background' size='xxxxs' weight='bold'>
                        Swap Free
                    </Text>
                </div>
            )}
            <div className='dc-app-card__body-app-info-content'>
                <Icon
                    icon={app_icon || 'IcDeriv'}
                    className={`dc-app-card__body-app-info-content--icon
                        dc-app-card__body-app-info-content--icon-${variant}`}
                    size={variant === 'default' ? 48 : 18}
                />
                <Text
                    color={is_virtual ? 'colored-background' : 'general'}
                    className={`dc-app-card__body-app-info-content--name dc-app-card__body-app-info-content--name-${variant}`}
                    size={variant === 'default' ? (isMobile() ? 'xsm' : 'sm') : isMobile() ? 'xxs' : 'xs'}
                    weight='bold'
                >
                    {app_name}
                </Text>
            </div>
            <div className='dc-app-card__body-balance-info-wrapper'>
                <div
                    className={`dc-app-card__body-balance-info-content dc-app-card__body-balance-info-content-${variant}`}
                >
                    <Text
                        color={is_virtual ? 'colored-background' : 'general'}
                        size={variant === 'default' ? (isMobile() ? 'xs' : 's') : 'xs'}
                        weight='bold'
                        line_height={variant === 'default' ? 'm' : 's'}
                    >
                        <Money amount={amount} currency={currency} show_currency />
                    </Text>
                    <Text
                        color={is_virtual ? 'colored-background' : 'general'}
                        size={isMobile() ? 'xxxxs' : 'xxxs'}
                        line_height={variant === 'default' ? 'm' : 's'}
                    >
                        Linked: {linked_wallet}
                    </Text>
                </div>
                {isMobile() && variant === 'default' && (
                    <div className='dc-app-card__actions-icon--play' onClick={onPlayClick}>
                        <Icon icon='IcPlay' custom_color='var(--icon-dark-background)' size={12} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppCardBody;
