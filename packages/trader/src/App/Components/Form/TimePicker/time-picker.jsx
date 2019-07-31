import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import Icon              from 'Assets/icon.jsx';
import {
    epochToMoment,
    setTime,
    toMoment }           from 'Utils/Date';
import Dialog            from './dialog.jsx';
import InputField        from '../InputField';

class TimePicker extends React.PureComponent {
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
        const value = typeof arg === 'object' ?
            arg.target.selected_time
            :
            setTime(toMoment(), arg).unix();

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
            end_time,
            is_nativepicker,
            name,
            placeholder,
            selected_time,
            start_time,
            validation_errors,
        } = this.props;

        const max = end_time.format('HH:mm');
        const min = start_time.format('HH:mm');
        const value = epochToMoment(selected_time).format('HH:mm');

        return (
            <div
                ref={this.saveRef}
                className={classNames(prefix_class,
                    { [`${prefix_class}--padding`]: this.props.padding })}
            >
                {
                    is_nativepicker
                        ?
                        <input
                            id={`${prefix_class}-input`}
                            max={max} /** max should be in String */
                            min={min} /** min should be in String */
                            name={name}
                            onChange={this.handleChange}
                            type='time'
                            value={value} /** value should be in String */
                        />
                        : (
                            <React.Fragment>
                                <InputField
                                    className={classNames(`${prefix_class}-input`)}
                                    error_messages={validation_errors}
                                    id={`${prefix_class}-input`}
                                    is_hj_whitelisted
                                    is_read_only
                                    name={name}
                                    onClick={this.toggleDropDown}
                                    placeholder={placeholder}
                                    type='text'
                                    value={`${value} GMT`}
                                />
                                <Icon
                                    className={`${prefix_class}__icon`}
                                    icon='IconClock'
                                />
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
                                        className='from-left'
                                        end_time={end_time}
                                        onChange={this.handleChange}
                                        preClass={prefix_class}
                                        selected_time={value}
                                        start_time={start_time}
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
    end_time       : PropTypes.object, // moment object
    is_clearable   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    name           : PropTypes.string,
    onChange       : PropTypes.func,
    padding        : PropTypes.string,
    placeholder    : PropTypes.string,
    selected_time  : PropTypes.number, // epoch
    start_time     : PropTypes.object, // moment object
};

export default TimePicker;
