import React            from 'react';
import PropTypes        from 'prop-types';
import { localize }     from 'App/i18n';
import { Dialog }       from 'deriv-components';
import Localize         from 'App/Components/Elements/localize.jsx';
import { connect }      from 'Stores/connect';
import { website_name } from '../../../../Constants/app-config';

class UnsupportedContractModal extends React.PureComponent {
    render() {
        const { is_visible, onConfirm, onClose, disableApp, enableApp, is_loading} = this.props;
        return (
            <Dialog
                title={localize('Whoops!')}
                confirm_button_text={localize('Continue to Binary.com')}
                cancel_button_text={localize('Back to trade page')}
                onConfirm={onConfirm}
                onCancel={onClose}
                disableApp={disableApp}
                enableApp={enableApp}
                is_loading={is_loading}
                is_closed_on_cancel
                is_visible={is_visible}
            >
                <Localize
                    i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to Binary.com for details.'
                    values={{ website_name }}
                />
            </Dialog>
        );
    }
}

UnsupportedContractModal.propTypes = {
    is_visible: PropTypes.bool,
    onClose   : PropTypes.func,
    onConfirm : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        disableApp: ui.disableApp,
        enableApp : ui.enableApp,
        is_loading: ui.is_loading,
    }),
)(UnsupportedContractModal);
