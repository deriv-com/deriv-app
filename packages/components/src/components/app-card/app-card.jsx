import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import RealAppCardBackground from './app-card-items/real-app-card-background.jsx';
import AppCardHeader from './app-card-items/app-card-header.jsx';
import AppCardBody from './app-card-items/app-card-body.jsx';
import AppCardActions from './app-card-items/app-card-actions.jsx';
import AppCardFooter from './app-card-items/app-card-footer.jsx';
import { useHover } from '../../hooks';

const AppCard = ({
    amount,
    app_icon,
    app_name,
    broker,
    currency,
    getCardLabels,
    is_swap_free,
    is_virtual,
    linked_wallet,
    login_id,
    onAddRealClick,
    onDepositClick,
    onPlayClick,
    onSettingsClick,
    onTransactionsClick,
    onWithdrawClick,
    server,
    show_footer,
    show_hover_actions,
    variant = 'default',
}) => {
    const [card_ref, is_hovered] = useHover(null, true);
    const getFontColor = () => {
        if (is_virtual) return 'colored-background';
        return 'general';
    };
    const card_labels = getCardLabels();

    return (
        <div
            className={classNames('dc-app-card__wrapper', {
                'dc-app-card__wrapper--virtual': is_virtual,
                'dc-app-card__wrapper--real': !is_virtual,
                'dc-app-card__wrapper--default': variant === 'default',
                'dc-app-card__wrapper--mini': variant === 'mini',
                'dc-app-card__wrapper--micro': variant === 'micro',
                'dc-app-card__wrapper--virtual-swap-free': is_virtual && is_swap_free,
            })}
            ref={isMobile() || !show_hover_actions ? null : card_ref}
        >
            {!is_virtual && <RealAppCardBackground is_swap_free={is_swap_free} variant={variant} />}
            {is_virtual && variant === 'default' && (
                <AppCardHeader card_labels={card_labels} is_swap_free={is_swap_free} onAddRealClick={onAddRealClick} />
            )}
            <AppCardBody
                amount={amount}
                app_icon={app_icon}
                app_name={app_name}
                currency={currency}
                card_labels={card_labels}
                getFontColor={getFontColor}
                is_swap_free={is_swap_free}
                is_virtual={is_virtual}
                linked_wallet={linked_wallet}
                onPlayClick={onPlayClick}
                show_footer={show_footer}
                show_hover_actions={show_hover_actions}
                variant={variant}
            />
            {show_footer && variant !== 'micro' && !is_hovered && (
                <AppCardFooter
                    broker={broker}
                    card_labels={card_labels}
                    getFontColor={getFontColor}
                    login_id={login_id}
                    server={server}
                    variant={variant}
                />
            )}
            {show_hover_actions && variant !== 'micro' && !isMobile() && is_hovered && (
                <AppCardActions
                    card_labels={card_labels}
                    is_virtual={is_virtual}
                    onDepositClick={onDepositClick}
                    onPlayClick={onPlayClick}
                    onSettingsClick={onSettingsClick}
                    onTransactionsClick={onTransactionsClick}
                    onWithdrawClick={onWithdrawClick}
                />
            )}
        </div>
    );
};

AppCard.propTypes = {
    amount: PropTypes.string,
    app_icon: PropTypes.string,
    app_name: PropTypes.string,
    broker: PropTypes.string,
    currency: PropTypes.string,
    getCardLabels: PropTypes.func.isRequired,
    is_swap_free: PropTypes.bool,
    is_virtual: PropTypes.bool,
    linked_wallet: PropTypes.string,
    login_id: PropTypes.string,
    onAddRealClick: PropTypes.func,
    onDepositClick: PropTypes.func,
    onPlayClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    onTransactionsClick: PropTypes.func,
    onWithdrawClick: PropTypes.func,
    server: PropTypes.string,
    show_footer: PropTypes.bool,
    show_hover_actions: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'mini', 'micro']),
};

export default AppCard;
