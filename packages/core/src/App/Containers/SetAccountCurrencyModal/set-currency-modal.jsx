import React from 'react';
import { Button, Modal } from '@deriv/components';
import { useHasSetCurrency } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import 'Sass/set-currency-modal.scss';

const SetAccountCurrencyModal = observer(() => {
    const { client, ui } = useStore();
    const { is_virtual } = client;
    const {
        is_set_currency_modal_visible: is_visible,
        openRealAccountSignup: setCurrency,
        toggleSetCurrencyModal: toggleModal,
    } = ui;
    const has_set_currency = useHasSetCurrency();

    return (
        <Modal
            id='dt_set_account_currency_modal'
            has_close_icon={false}
            is_open={is_visible}
            small
            toggleModal={toggleModal}
            title={
                !has_set_currency
                    ? localize('No currency assigned to your account')
                    : localize('You have an account that needs action')
            }
        >
            <Modal.Body>
                {localize('Please set a currency for your existing real account before creating another account.')}
            </Modal.Body>
            <Modal.Footer>
                {!is_virtual ? (
                    <>
                        <Button has_effect text={localize('Cancel')} onClick={toggleModal} secondary />
                        <Button
                            has_effect
                            text={localize('Set currency')}
                            onClick={() => {
                                toggleModal();
                                // timeout is to ensure no jumpy animation when modals are overlapping enter/exit transitions
                                setTimeout(() => {
                                    setCurrency('set_currency');
                                }, 250);
                            }}
                            primary
                        />
                    </>
                ) : (
                    <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
                )}
            </Modal.Footer>
        </Modal>
    );
});

export default SetAccountCurrencyModal;
