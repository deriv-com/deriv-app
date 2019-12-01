import { Dialog }           from 'deriv-components';
import PropTypes            from 'prop-types';
import React, { Component } from 'react';
import { localize }         from 'deriv-translations';
import { connect }          from 'Stores/connect';

class MT5ServerErrorDialog extends Component {
    render() {
        const should_show_error = this.props.has_mt5_error && !this.props.is_mt5_success_dialog_enabled;
        return (
            <Dialog
                title={localize('Whoops!')}
                confirm_button_text={localize('Ok')}
                onConfirm={this.props.clearMt5Error}
                disableApp={this.props.disableApp}
                enableApp={this.props.enableApp}
                is_loading={false}
                is_closed_on_cancel
                is_visible={should_show_error}
            >
                {localize(this.props.error_message)}
            </Dialog>
        );
    }
}

MT5ServerErrorDialog.propTypes = {
    clearMt5Error                : PropTypes.func,
    disableApp                   : PropTypes.func,
    enableApp                    : PropTypes.func,
    error_message                : PropTypes.string,
    has_mt5_error                : PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
};

export default connect(({ ui, modules }) => ({
    clearMt5Error                : modules.mt5.clearMt5Error,
    disableApp                   : ui.disableApp,
    enableApp                    : ui.enableApp,
    error_message                : modules.mt5.error_message,
    has_mt5_error                : modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
}))(MT5ServerErrorDialog);
