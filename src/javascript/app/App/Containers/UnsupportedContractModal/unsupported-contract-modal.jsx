import React            from 'react';
import PropTypes        from 'prop-types';
import { localize }     from '_common/localize';
import { urlFor }       from '_common/url';
import FullPageModal    from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize         from 'App/Components/Elements/localize.jsx';
import { connect }      from 'Stores/connect';
import { website_name } from '../../Constants/app-config';

const onClose = (ui) => {
    ui.toggleUnsupportedContractModal(false);
};

const onConfirm = (ui) => {
    window.open(urlFor('user/portfoliows', undefined, undefined, true), '_blank');
    onClose(ui);
};

const UnsupportedContractModal = ({ is_visible, ui }) => (
    <FullPageModal
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue to Binary.com')}
        cancel_button_text={localize('Back to trade page')}
        onConfirm={() => onConfirm(ui)}
        onCancel={() => onClose(ui)}
        is_closed_on_cancel
        is_visible={is_visible}
    >
        <Localize
            str='This trade type is currently not supported on [_1]. Please go to Binary.com for details.'
            replacers={{ '1': website_name }}
        />
    </FullPageModal>
);

UnsupportedContractModal.propTypes = {
    client    : PropTypes.object,
    is_visible: PropTypes.bool,
};

export default connect(
    ({ ui }) => ({
        is_visible: ui.is_unsupported_contract_modal_visible,
        ui,
    }),
)(UnsupportedContractModal);
