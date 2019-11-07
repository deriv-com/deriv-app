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
        this.ref = React.createRef();
    }

    toggleDialog = () => {
        this.setState(state => ({ is_visible: !state.is_visible }), () => {
            if (this.state.is_visible && this.ref && this.ref.current) {
                const { top, left } = this.ref.current.getBoundingClientRect();
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
                    ref={this.ref}
                    className='positions-drawer-dialog-toggle'
                    onClick={this.toggleDialog}
                >
                    <Icon icon='IconSettings' />
                </div>
                <PositionsDrawerDialog
                    is_visible={this.state.is_visible}
                    left={this.state.left}
                    top={this.state.top}
                    toggle_ref={this.ref}
                    toggleDialog={this.toggleDialog}
                >
                    <ContractUpdateForm
                        currency={this.props.currency}
                        contract_id={this.props.contract_id}
                        has_stop_loss={this.props.has_stop_loss}
                        has_take_profit={this.props.has_take_profit}
                        stop_loss={this.props.stop_loss}
                        take_profit={this.props.take_profit}
                        onChangeContractUpdate={this.props.onChangeContractUpdate}
                        onClickContractUpdate={this.props.onClickContractUpdate}
                        validation_errors={this.props.validation_errors}
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
