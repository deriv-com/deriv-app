import React from 'react';
import PropTypes from 'prop-types';
import AppCardActionItem from './app-card-action-item.jsx';
import Icon from '../../icon';
import { useHover } from '../../../hooks/use-hover';

const AppCardActions = ({
    card_labels,
    is_virtual,
    onDepositClick,
    onPlayClick,
    onSettingsClick,
    onTransactionsClick,
    onWithdrawClick,
}) => {
    const [deposit_ref, is_deposit_hovered] = useHover(null, true);
    const [withdraw_ref, is_withdraw_hovered] = useHover(null, true);
    const [transactions_ref, is_transactions_hovered] = useHover(null, true);
    const [settings_ref, is_settings_hovered] = useHover(null, true);

    return (
        <div className='dc-app-card-actions__wrapper'>
            <AppCardActionItem
                ref={deposit_ref}
                icon='IcAdd'
                is_hovered={is_deposit_hovered}
                is_virtual={is_virtual}
                label={card_labels.ADD}
                onClickHandler={onDepositClick}
            />
            {!is_virtual && (
                <AppCardActionItem
                    ref={withdraw_ref}
                    icon='IcMinus'
                    is_hovered={is_withdraw_hovered}
                    is_virtual={is_virtual}
                    label={card_labels.WITHDRAW}
                    onClickHandler={onWithdrawClick}
                />
            )}
            {!is_virtual && (
                <AppCardActionItem
                    ref={transactions_ref}
                    icon='IcTransactions'
                    is_hovered={is_transactions_hovered}
                    is_virtual={is_virtual}
                    label={card_labels.TRANSACTIONS}
                    onClickHandler={onTransactionsClick}
                />
            )}
            <AppCardActionItem
                ref={settings_ref}
                icon='IcGear'
                is_hovered={is_settings_hovered}
                is_virtual={is_virtual}
                label={card_labels.SETTINGS}
                onClickHandler={onSettingsClick}
            />
            <div className='dc-app-card-actions__icon--play' onClick={onPlayClick}>
                <Icon icon='IcPlay' custom_color='var(--icon-dark-background)' size={12} />
            </div>
        </div>
    );
};

AppCardActions.propTypes = {
    card_labels: PropTypes.object,
    is_virtual: PropTypes.bool,
    onDepositClick: PropTypes.func,
    onPlayClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    onTransactionsClick: PropTypes.func,
    onWithdrawClick: PropTypes.func,
};

export default AppCardActions;
