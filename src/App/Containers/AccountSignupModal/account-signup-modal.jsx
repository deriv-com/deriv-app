import React         from 'react';
import PropTypes     from 'prop-types';
import { localize }  from 'App/i18n';
import FullPageModal from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Button        from 'App/Components/Form/button.jsx';
import { connect }   from 'Stores/connect';

// const onClose = (ui) => {
//     ui.toggleUnsupportedContractModal(false);
// };

const AccountSignupModal = ({ is_visible, onSignup }) => {
    console.log('Here too');
    const onSubmitSignup = () => onSignup({ password: 'Test', residence: 'MY' });

    return (
        <FullPageModal
            title={localize('Thanks for verifying your email.')}
            is_visible={is_visible}
        >
            <div>
                <Button onClick={onSubmitSignup}>Start trading</Button>
            </div>
        </FullPageModal>
    );
};

AccountSignupModal.propTypes = {
    is_visible: PropTypes.bool,
    onSignup  : PropTypes.func,
};

export default connect(
    ({ ui, client }) => ({
        is_visible: ui.is_account_signup_modal_visible,
        onSignup  : client.onSignup,
    }),
)(AccountSignupModal);
