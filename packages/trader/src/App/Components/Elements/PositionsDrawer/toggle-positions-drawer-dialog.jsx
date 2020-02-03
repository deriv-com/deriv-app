import { Icon } from '@deriv/components';
import React from 'react';
import PropTypes from 'prop-types';
import PositionsDrawerDialog from './positions-drawer-dialog.jsx';
import ContractUpdateForm from './contract-update-form.jsx';

class TogglePositionsDrawerDialog extends React.PureComponent {
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
        return (
            <React.Fragment>
                <div ref={this.toggle_ref} className='positions-drawer-dialog-toggle' onClick={this.toggleDialog}>
                    <Icon className='positions-drawer-dialog-toggle__icon' icon='IcEdit' size={16} />
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
    currency: PropTypes.string,
    contract_id: PropTypes.string,
    has_stop_loss: PropTypes.bool,
    has_take_profit: PropTypes.bool,
    stop_loss: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    take_profit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate: PropTypes.func,
    validation_errors: PropTypes.object,
};

export default TogglePositionsDrawerDialog;
