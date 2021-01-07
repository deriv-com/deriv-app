import classNames from 'classnames';
import React from 'react';
import Icon from '../../icon';
import Text from '../../text';
import { useHover } from '../hooks/use-hover';

const Action = ({ icon, is_hovered, is_virtual, label, onClickHandler, wrapper_ref }) => {
    return (
        <div className='dc-app-card__actions-content-wrapper' onClick={onClickHandler} ref={wrapper_ref}>
            <Icon
                icon={icon}
                className={classNames('dc-app-card__actions-icon', {
                    'dc-app-card__actions-icon--hover': is_hovered,
                    'dc-app-card__actions-icon--hover-virtual': is_hovered & is_virtual,
                    'dc-app-card__actions-icon--hover-real': is_hovered & !is_virtual,
                })}
                custom_color={is_virtual ? 'var(--icon-dark-background)' : 'var(--icon-light-background)'}
            />
            {is_hovered && (
                <Text size='xxxxs' color={is_virtual ? 'colored-background' : 'general'}>
                    {label}
                </Text>
            )}
        </div>
    );
};

const AppCardActions = ({
    is_virtual,
    onDepositClick,
    onPlayClick,
    onSettingsClick,
    onTransactionsClick,
    onWithdrawClick,
}) => {
    const [deposit_ref, is_deposit_hovered] = useHover();
    const [withdraw_ref, is_withdraw_hovered] = useHover();
    const [transactions_ref, is_transactions_hovered] = useHover();
    const [settings_ref, is_settings_hovered] = useHover();

    return (
        <div className='dc-app-card__actions-wrapper'>
            <Action
                wrapper_ref={deposit_ref}
                icon='IcAdd'
                is_hovered={is_deposit_hovered}
                is_virtual={is_virtual}
                label='Deposit'
                onClickHandler={onDepositClick}
            />
            {!is_virtual && (
                <Action
                    wrapper_ref={withdraw_ref}
                    icon='IcMinus'
                    is_hovered={is_withdraw_hovered}
                    is_virtual={is_virtual}
                    label='Withdraw'
                    onClickHandler={onWithdrawClick}
                />
            )}
            {!is_virtual && (
                <Action
                    wrapper_ref={transactions_ref}
                    icon='IcTransactions'
                    is_hovered={is_transactions_hovered}
                    is_virtual={is_virtual}
                    label='Transactions'
                    onClickHandler={onTransactionsClick}
                />
            )}
            <Action
                wrapper_ref={settings_ref}
                icon='IcGear'
                is_hovered={is_settings_hovered}
                is_virtual={is_virtual}
                label='Settings'
                onClickHandler={onSettingsClick}
            />
            <div className='dc-app-card__actions-icon--play' onClick={onPlayClick}>
                <Icon icon='IcPlay' custom_color='var(--icon-dark-background)' size={12} />
            </div>
        </div>
    );
};

export default AppCardActions;
