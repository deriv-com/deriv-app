import PropTypes         from 'prop-types';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { Button }        from 'deriv-components';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { localize }      from 'App/i18n';
import { connect }       from 'Stores/connect';

class PositionsDrawerDialog extends React.Component {
    constructor(props) {
        super(props);

        // set stop_loss and take_profit contract update initial values from contract_info, if any
        const {
            limit_order: {
                stop_loss: {
                    order_amount: stop_loss_order_amount,
                } = {},
                take_profit: {
                    order_amount: take_profit_order_amount,
                } = {},
            } = {},
        } = this.props;

        this.state = {
            is_visible : false,
            top        : 0,
            left       : 0,
            stop_loss  : Math.abs(stop_loss_order_amount),
            take_profit: take_profit_order_amount,
        };

        this.ref = React.createRef();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.update_take_profit !== undefined) {
            state.take_profit = props.update_take_profit;
        }
        if (props.update_stop_loss !== undefined) {
            state.stop_loss = Math.abs(props.update_stop_loss);
        }

        state.is_stop_loss_checked   = props.has_update_stop_loss;
        state.is_take_profit_checked = props.has_update_take_profit;

        return state;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.ref && this.ref.current && !this.ref.current.contains(event.target) &&
            !this.props.toggle_ref.current.contains(event.target) && this.props.is_visible) {
            this.props.toggleDialog();
        }
    }

    render() {
        const {
            is_visible,
            left,
            onChange,
            onClick,
            top,
            validation_errors,
        } = this.props;

        const { is_stop_loss_checked, is_take_profit_checked, stop_loss, take_profit } = this.state;

        const is_disabled = !(is_stop_loss_checked || is_take_profit_checked);

        const dialog = (
            <CSSTransition
                in={is_visible}
                classNames={{
                    enter    : 'positions-drawer-dialog--enter',
                    enterDone: 'positions-drawer-dialog--enter-done',
                    exit     : 'positions-drawer-dialog--exit',
                }}
                timeout={150}
                unmountOnExit
            >
                <div
                    ref={this.ref}
                    className='positions-drawer-dialog'
                    style={{
                        top,
                        left: `calc(${left}px + 32px)`,
                    }}
                >
                    <div className='positions-drawer-dialog__input'>
                        <InputWithCheckbox
                            defaultChecked={is_take_profit_checked}
                            value={take_profit}
                            name='update_take_profit'
                            label={localize('Take profit')}
                            onChange={onChange}
                            error_messages={validation_errors.update_take_profit}
                        />
                    </div>
                    <div className='positions-drawer-dialog__input'>
                        <InputWithCheckbox
                            defaultChecked={is_stop_loss_checked}
                            value={stop_loss}
                            name='update_stop_loss'
                            label={localize('Stop loss')}
                            onChange={onChange}
                            error_messages={validation_errors.update_stop_loss}
                        />
                    </div>
                    <div className='positions-drawer-dialog__button'>
                        <Button
                            text={localize('Apply')}
                            onClick={onClick}
                            primary
                            is_disabled={is_disabled}
                        />
                    </div>
                </div>
            </CSSTransition>
        );

        return (
            ReactDOM.createPortal(
                dialog, // use portal to render dialog above ThemedScrollbars container
                document.getElementById('deriv_app')
            )
        );
    }
}

PositionsDrawerDialog.propTypes = {
    contract_info   : PropTypes.object,
    is_visible      : PropTypes.bool,
    left            : PropTypes.number,
    onChange        : PropTypes.func,
    onClick         : PropTypes.func,
    toggle_ref      : PropTypes.object,
    toggleDialog    : PropTypes.func,
    top             : PropTypes.number,
    update_stop_loss: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    update_take_profit: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    validation_errors: PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        onChange              : modules.trade.onChange,
        has_update_stop_loss  : modules.trade.has_update_stop_loss,
        has_update_take_profit: modules.trade.has_update_take_profit,
        update_stop_loss      : modules.trade.update_stop_loss,
        update_take_profit    : modules.trade.update_take_profit,
        validation_errors     : modules.trade.validation_errors,
    })
)(PositionsDrawerDialog);
