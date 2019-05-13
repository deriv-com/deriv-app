import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from '_common/localize';
import { urlFor }    from '_common/url';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize      from 'App/Components/Elements/localize.jsx';
import { connect }   from 'Stores/connect';

const onConfirm = async (client) => {
    await client.switchAccount(client.virtual_account_loginid);
};

const onCancel = () => {
    window.open(urlFor('trading', undefined, undefined, true));
};

const DenialOfServiceModal = ({ client, is_visible }) => (
    <FullPageModal
        title={localize('Whoops!')}
        confirm_button_text={localize('Continue with Virtual Account')}
        cancel_button_text={localize('Back to main website')}
        onConfirm={() => onConfirm(client)}
        onCancel={onCancel}
        is_closed_on_cancel={false}
        is_visible={is_visible}
    >
        <Localize str='You cannot use your real money account with BinaryNex at this time.' />
    </FullPageModal>
);

DenialOfServiceModal.propTypes = {
    client    : PropTypes.object,
    is_visible: PropTypes.bool,
};

const denial_of_service = connect(
    ({ client }) => ({
        is_visible: !client.is_client_allowed_to_visit,
        client,
    }),
)(DenialOfServiceModal);
export default denial_of_service;
