import { Button, Modal } from 'deriv-components';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from 'deriv-translations';
import { connect }       from 'Stores/connect';

const SetAccountCurrencyModal = ({
    is_visible,
    setCurrency,
    toggleModal,
}) => (
    <Modal
        id='dt_set_account_currency_modal'
        is_open={is_visible}
        small
        toggleModal={()=> toggleModal(false)}
        title={localize('You have an account that needs action')}
    >
        <Modal.Body>
            {localize('Please set a currency for your existing real account before creating another account.')}
        </Modal.Body >
        <Modal.Footer>
            <Button
                has_effect
                text={localize('Cancel')}
                onClick={() => toggleModal(false)}
                secondary
            />
            <Button
                has_effect
                text={localize('Set currency')}
                onClick={() => {
                    toggleModal(false);
                    setCurrency();
                }}
                primary
            />
        </Modal.Footer>
    </Modal>
);

SetAccountCurrencyModal.propTypes = {
    is_visible : PropTypes.bool,
    setCurrency: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        toggleModal: ui.toggleSetCurrencyModal,
        setCurrency: ui.openRealAccountSignup,
        is_visible : ui.is_set_currency_modal_visible,
    }),
)(SetAccountCurrencyModal);
