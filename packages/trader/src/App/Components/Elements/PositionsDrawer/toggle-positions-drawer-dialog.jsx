import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import PopoverMessageCheckbox from 'Modules/Trading/Components/Elements/popover-message-checkbox.jsx';
import PositionsDrawerDialog from './positions-drawer-dialog.jsx';
import ContractUpdateForm from './contract-update-form.jsx';

class TogglePositionsDrawerDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false,
            top: 0,
            left: 0,
        };
        this.toggle_ref = React.createRef();
        this.dialog_ref = React.createRef();
    }

    toggleDialog = () => {
        if (this.props.is_valid_to_cancel) return;

        this.setState(
            state => ({ is_visible: !state.is_visible }),
            () => {
                if (
                    this.state.is_visible &&
                    this.toggle_ref &&
                    this.toggle_ref.current &&
                    this.dialog_ref &&
                    this.dialog_ref.current
                ) {
                    const icon_bound = this.toggle_ref.current.getBoundingClientRect();
                    const { ref: portalRef } = this.dialog_ref.current;
                    const target_bound = portalRef.current.getBoundingClientRect();
                    const body_bound = document.body.getBoundingClientRect();

                    let { top } = icon_bound;
                    const { right } = icon_bound;

                    if (icon_bound.top + target_bound.height > body_bound.height) {
                        top -= target_bound.height - icon_bound.height;
                    }

                    this.setState({
                        top,
                        left: right - 16,
                    });
                }
            }
        );
    };

    render() {
        const { is_valid_to_cancel, should_show_cancellation_warning, toggleCancellationWarning } = this.props;

        const edit_icon = (
            <Icon
                className='positions-drawer-dialog-toggle__icon'
                icon='IcEdit'
                color={is_valid_to_cancel && 'disabled'}
                size={16}
            />
        );

        return (
            <React.Fragment>
                <div ref={this.toggle_ref} className='positions-drawer-dialog-toggle' onClick={this.toggleDialog}>
                    {is_valid_to_cancel ? (
                        <Popover
                            alignment='right'
                            classNameBubble='trade-container__popover'
                            is_bubble_hover_enabled
                            margin={2}
                            zIndex={2}
                            message={
                                <PopoverMessageCheckbox
                                    defaultChecked={!should_show_cancellation_warning}
                                    message={localize(
                                        'Take profit and/or stop loss are not available while deal cancellation is active.'
                                    )}
                                    name='should_show_cancellation_warning'
                                    onChange={() => toggleCancellationWarning()}
                                />
                            }
                        >
                            <div className='positions-drawer-dialog-toggle__wrapper'>{edit_icon}</div>
                        </Popover>
                    ) : (
                        edit_icon
                    )}
                </div>
                <PositionsDrawerDialog
                    ref={this.dialog_ref}
                    is_visible={this.state.is_visible}
                    left={this.state.left}
                    top={this.state.top}
                    toggle_ref={this.toggle_ref}
                    toggleDialog={this.toggleDialog}
                >
                    <ContractUpdateForm contract_id={this.props.contract_id} toggleDialog={this.toggleDialog} />
                </PositionsDrawerDialog>
            </React.Fragment>
        );
    }
}

PropTypes.TogglePositionsDrawerDialog = {
    is_valid_to_cancel: PropTypes.bool,
    contract_id: PropTypes.string,
};

export default connect(({ ui }) => ({
    toggleCancellationWarning: ui.toggleCancellationWarning,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
}))(TogglePositionsDrawerDialog);
