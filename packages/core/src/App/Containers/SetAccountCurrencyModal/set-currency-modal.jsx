import { Dialog }             from 'deriv-components';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';

const SetAccountCurrencyModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    setCurrency,
    toggleModal,
}) => (
    <Dialog
        cancel_button_text={localize('Cancel')}
        confirm_button_text={localize('Set currency')}
        is_visible={is_visible}
        onCancel={() => toggleModal(false)}
        onConfirm={() => {
            toggleModal(false);
            setCurrency();
        }}
        disableApp={disableApp}
        enableApp={enableApp}
        is_loading={is_loading}
        title={localize('Set account currency')}
    >
        <Localize i18n_default_text='Please set your currency for this account before creating a new Deriv account.' />
    </Dialog>
);

SetAccountCurrencyModal.propTypes = {
    disableApp : PropTypes.func,
    enableApp  : PropTypes.func,
    is_loading : PropTypes.bool,
    is_visible : PropTypes.bool,
    setCurrency: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        disableApp : ui.disableApp,
        enableApp  : ui.enableApp,
        is_loading : ui.is_loading,
        toggleModal: ui.toggleSetCurrencyModal,
        setCurrency: ui.openRealAccountSignup,
        is_visible : ui.is_set_currency_modal_visible,
    }),
)(SetAccountCurrencyModal);
