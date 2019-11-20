import React                 from 'react';
import PropTypes             from 'prop-types';
import Icon                  from 'Assets/icon.jsx';
import PositionsDrawerDialog from './positions-drawer-dialog.jsx';
import ContractUpdateForm    from './contract-update-form.jsx';

class TogglePositionsDrawerDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false,
            top       : 0,
            left      : 0,
        };
        this.toggle_ref = React.createRef();
        this.dialog_ref = React.createRef();
    }

    toggleDialog = () => {
        this.setState(state => ({ is_visible: !state.is_visible }), () => {
            if (this.state.is_visible && this.toggle_ref && this.toggle_ref.current
                && this.dialog_ref && this.dialog_ref.current) {
                const iconBound = this.toggle_ref.current.getBoundingClientRect();
                const { ref: portalRef } = this.dialog_ref.current;
                const targetBound = portalRef.current.getBoundingClientRect();
                const bodyBound = document.body.getBoundingClientRect();

                let { top } = iconBound;
                const { left } = iconBound;

                if (iconBound.top + targetBound.height > bodyBound.height) {
                    top -= targetBound.height - iconBound.height;
                }

                this.setState({
                    top,
                    left,
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div
                    ref={this.toggle_ref}
                    className='positions-drawer-dialog-toggle'
                    onClick={this.toggleDialog}
                >
                    <Icon icon='IconSettings' />
                </div>
                <PositionsDrawerDialog
                    ref={this.dialog_ref}
                    is_visible={this.state.is_visible}
                    left={this.state.left}
                    top={this.state.top}
                    toggle_ref={this.toggle_ref}
                    toggleDialog={this.toggleDialog}
                >
                    <ContractUpdateForm
                        contract_id={this.props.contract_id}
                        toggleDialog={this.toggleDialog}
                    />
                </PositionsDrawerDialog>
            </React.Fragment>
        );
    }
}

PropTypes.TogglePositionsDrawerDialog = {
    currency              : PropTypes.string,
    contract_id           : PropTypes.string,
    has_stop_loss         : PropTypes.bool,
    has_take_profit       : PropTypes.bool,
    stop_loss             : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    take_profit           : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate : PropTypes.func,
    validation_errors     : PropTypes.object,
};

export default TogglePositionsDrawerDialog;
