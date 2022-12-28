import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, Modal, Money, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getCurrencyName } from '@deriv/shared';
import CurrencyIcon from 'Assets/svgs/currency';
import { useStores } from 'Stores/index';
import { AccountListDetail } from 'Types';
import classNames from 'classnames';

type CurrencySelectionModalProps = {
    is_visible: boolean;
};

const CurrencySelectionModal = ({ is_visible }: CurrencySelectionModalProps) => {
    const { client, traders_hub, ui } = useStores();
    const { accounts, account_list, loginid: current_loginid, switchAccount } = client;
    const { closeModal } = traders_hub;

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
                    .filter(acc => !acc.is_virtual)
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
                                    <Text size='xs' color='prominent'>
                                        <Money amount={balance} currency={currency} show_currency />
                                    </Text>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className='currency-selection-modal__bottom-controls'>
                <Button
                    className='block-button'
                    onClick={() => {
                        setTimeout(() => ui.openRealAccountSignup('manage'), 500);
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
};

export default observer(CurrencySelectionModal);
