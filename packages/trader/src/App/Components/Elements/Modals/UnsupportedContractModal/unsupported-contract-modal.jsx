import React            from 'react';
import PropTypes        from 'prop-types';
import { localize }     from 'App/i18n';
import FullPageModal    from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize         from 'App/Components/Elements/localize.jsx';
import { website_name } from 'App/Constants/app-config';

class UnsupportedContractModal extends React.PureComponent {
    render() {
        const { is_visible, onConfirm, onClose } = this.props;
        return (
            <FullPageModal
                title={localize('Whoops!')}
                confirm_button_text={localize('Continue to Binary.com')}
                cancel_button_text={localize('Back to trade page')}
                onConfirm={onConfirm}
                onCancel={onClose}
                is_closed_on_cancel
                is_visible={is_visible}
            >
                <Localize
                    i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to Binary.com for details.'
                    values={{ website_name }}
                />
            </FullPageModal>
        );
    }
}

UnsupportedContractModal.propTypes = {
    is_visible: PropTypes.bool,
    onClose   : PropTypes.func,
    onConfirm : PropTypes.func,
};

export default UnsupportedContractModal;
