import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from 'App/i18n';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize      from 'App/Components/Elements/localize.jsx';

const DenialOfServiceModal = ({ is_visible, onCancel, onConfirm }) => (
    <FullPageModal
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue with Virtual Account')}
        cancel_button_text={localize('Back to main website')}
        onConfirm={onConfirm}
        onCancel={onCancel}
        is_closed_on_cancel={false}
        is_visible={is_visible}
    >
        <Localize i18n_default_text='You cannot use your real money account with Deriv at this time.' />
    </FullPageModal>
);

DenialOfServiceModal.propTypes = {
    is_visible: PropTypes.bool,
    onCancel  : PropTypes.func,
    onConfirm : PropTypes.func,
};

export default DenialOfServiceModal;
