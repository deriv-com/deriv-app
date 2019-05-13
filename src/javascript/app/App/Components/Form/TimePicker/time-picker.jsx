import classNames        from 'classnames';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import {
    Icon,
    IconClock }          from 'Assets/Common';
import Dialog            from './dialog.jsx';
import InputField        from '../InputField';

class TimePicker extends React.Component {
    state = { is_open: false };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleDropDown = () => {
        this.setState((state) => ({ is_open: !state.is_open }));
    };

    handleChange = (arg) => {
        // To handle nativepicker;
        const value = typeof arg === 'object' ? arg.target.selected_time : arg;

        if (value !== this.props.selected_time) {
            this.props.onChange({ target: { name: this.props.name, value } });
        }
    };

    saveRef = (node) => {
        if (!node) return;
        if (node.nodeName === 'INPUT') {
            this.target_element = node;
            return;
        }
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)) {
            if (this.state.is_open) {
                this.setState({ is_open: false });
            }
        }
    };

    render() {
        const prefix_class = 'time-picker';
        const {
            selected_time,
            name,
            is_nativepicker,
            placeholder,
            end_time,
            start_time,
            validation_errors,
        } = this.props;
        return (
            <div
                ref={this.saveRef}
                className={classNames(prefix_class,
                    { [`${prefix_class}--padding`]: this.props.padding })}
            >
                {
                    is_nativepicker
                        ? <input
                            type='time'
                            id={`${prefix_class}-input`}
                            value={selected_time}
                            onChange={this.handleChange}
                            name={name}
                            min={start_time}
                            max={end_time}
                        />
                        : (
                            <React.Fragment>
                                <InputField
                                    error_messages={validation_errors}
                                    type='text'
                                    is_read_only
                                    id={`${prefix_class}-input`}
                                    className={classNames(`${prefix_class}-input`)}
                                    value={`${selected_time} GMT`}
                                    onClick={this.toggleDropDown}
                                    name={name}
                                    placeholder={placeholder}
                                />
                                <Icon icon={IconClock} className={`${prefix_class}__icon`} />
                                <CSSTransition
                                    in={ this.state.is_open }
                                    classNames={{
                                        enter    : 'time-picker__dialog--enter',
                                        enterDone: 'time-picker__dialog--enter-done',
                                        exit     : 'time-picker__dialog--exit',
                                    }}
                                    timeout={100}
                                    unmountOnExit
                                >
                                    <Dialog
                                        end_time={end_time}
                                        start_time={start_time}
                                        className={'from-left'}
                                        onChange={this.handleChange}
                                        preClass={prefix_class}
                                        selected_time={selected_time}
                                    />
                                </CSSTransition>
                            </React.Fragment>
                        )
                }
            </div>
        );
    }
}

TimePicker.propTypes = {
    end_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
    is_clearable   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    name           : PropTypes.string,
    onChange       : PropTypes.func,
    padding        : PropTypes.string,
    placeholder    : PropTypes.string,
    selected_time  : PropTypes.string,
    start_time     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
};

export default observer(TimePicker);
