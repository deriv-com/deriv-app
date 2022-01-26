import React from 'react';
import AppCardActionItem from './app-card-action-item.jsx';
import Icon from '../../icon';
import { useHover } from '../../../hooks/use-hover';

type AppCardActionsProps = {
    card_labels: unknown;
    is_virtual: boolean;
    onDepositClick: () => void;
    onPlayClick: () => void;
    onSettingsClick: () => void;
    onTransactionsClick: () => void;
    onWithdrawClick: () => void;
};

const AppCardActions = ({
    card_labels,
    is_virtual,
    onDepositClick,
    onPlayClick,
    onSettingsClick,
    onTransactionsClick,
    onWithdrawClick,
}: AppCardActionsProps) => {
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

export default AppCardActions;
