import React from 'react';
import { getStatusBadgeConfig } from '@deriv/account';
import { Button, Icon, Modal, Money, StatusBadge, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getCurrencyName } from '@deriv/shared';
import CurrencyIcon from './currency';
import { AccountListDetail } from './types';
import classNames from 'classnames';
import { useHasSetCurrency } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

type CurrencySelectionModalProps = {
    is_visible: boolean;
};

const CurrencySelectionModal = observer(({ is_visible }: CurrencySelectionModalProps) => {
    const { client, traders_hub, ui } = useStore();
    const { account_list, accounts, loginid: current_loginid, switchAccount, has_any_real_account } = client;
    const { closeModal, selected_region, openFailedVerificationModal, multipliers_account_status } = traders_hub;
    const { openRealAccountSignup, toggleSetCurrencyModal } = ui;
    const { text: badge_text, icon: badge_icon } = getStatusBadgeConfig(
        multipliers_account_status,
        openFailedVerificationModal,
        'multipliers'
    );

    const hasSetCurrency = useHasSetCurrency();
    let timeout: ReturnType<typeof setTimeout>;

    return (
        <Modal is_open={is_visible} toggleModal={closeModal} width='422px' height='422px'>
            <div className='currency-selection-modal__header'>
                <Text line-height='m' weight='bold'>
                    {localize('Select account')}
                </Text>
                <Icon className='close-icon' icon='IcCross' onClick={() => closeModal()} />
            </div>
            <div className='currency-selection-modal__body'>
                {(account_list as AccountListDetail[])
                    .filter(
                        acc =>
                            !!acc.is_disabled === false &&
                            ((!acc.is_virtual && selected_region === 'Non-EU' && acc.loginid.startsWith('CR')) ||
                                (selected_region === 'EU' && acc.loginid.startsWith('MF')))
                    )
                    .map(({ icon, loginid }) => {
                        const { balance, currency } = accounts[loginid];
                        const is_selected = current_loginid === loginid;
                        return (
                            <div
                                key={loginid}
                                className={classNames('currency-item-card', {
                                    'currency-item-card--active': is_selected,
                                })}
                                onClick={async () => {
                                    if (loginid !== current_loginid) {
                                        await switchAccount(loginid);
                                    }
                                    closeModal();
                                }}
                            >
                                <CurrencyIcon className='currency-item-card__icons' icon={icon} size={32} />
                                <div className='currency-item-card__details'>
                                    <Text size='xs'>{getCurrencyName(currency)}</Text>
                                    <Text color={is_selected ? 'prominent' : 'less-prominent'} size='xxs'>
                                        {loginid}
                                    </Text>
                                </div>
                                <div className='currency-item-card__balance'>
                                    {multipliers_account_status ? (
                                        <StatusBadge
                                            account_status={multipliers_account_status}
                                            icon={badge_icon}
                                            text={badge_text}
                                        />
                                    ) : (
                                        <Text size='xs' color='prominent'>
                                            <Money amount={balance} currency={currency} show_currency />
                                        </Text>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className='currency-selection-modal__bottom-controls'>
                <Button
                    className='block-button'
                    onClick={() => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            if (has_any_real_account && !hasSetCurrency) {
                                toggleSetCurrencyModal();
                            } else openRealAccountSignup('manage');
                        }, 500);
                        closeModal();
                    }}
                    secondary
                    large
                >
                    {localize('Add or manage account')}
                </Button>
            </div>
        </Modal>
    );
});

export default CurrencySelectionModal;
