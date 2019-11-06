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
        this.state = {
            is_visible: false,
            top       : 0,
            left      : 0,
        };
        this.ref = React.createRef();
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
            has_update_stop_loss,
            has_update_take_profit,
            update_take_profit,
            update_stop_loss,
            validation_errors,
        } = this.props;

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
                            value={update_take_profit}
                            name='update_take_profit'
                            label={localize('Take profit')}
                            onChange={onChange}
                            error_messages={validation_errors.update_take_profit}
                        />
                    </div>
                    <div className='positions-drawer-dialog__input'>
                        <InputWithCheckbox
                            value={update_stop_loss}
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
                            is_disabled={!((has_update_stop_loss && update_stop_loss > 0)
                                || (has_update_take_profit && update_take_profit > 0))
                            }
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
