import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, InputField } from '@deriv/components';
import Dialog from './dialog.jsx';
import { observer, useStore } from '@deriv/stores';

const class_prefix = 'time-picker';

const TimePicker = observer(
    ({
        end_times,
        is_nativepicker,
        name,
        onChange,
        padding,
        placeholder,
        selected_time,
        start_times,
        validation_errors,
    }) => {
        const { ui } = useStore();
        const { current_focus, setCurrentFocus } = ui;
        const [is_open, setIsOpen] = React.useState(false);
        const [wrapper_ref, setWrapperRef] = React.useState(null);

        React.useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        });

        const toggleDropDown = () => {
            setIsOpen(!is_open);
        };

        const handleChange = arg => {
            // To handle nativepicker;
            const value = typeof arg === 'object' ? arg.target.selected_time : arg;

            if (value !== selected_time) {
                onChange({ target: { name, value } });
            }
        };

        const saveRef = node => {
            if (!node) return;
            setWrapperRef(node);
        };

        const handleClickOutside = event => {
            if (!wrapper_ref?.contains(event.target) && is_open) {
                setIsOpen(false);
            }
        };

        return (
            <div ref={saveRef} className={classNames(class_prefix, { [`${class_prefix}--padding`]: padding })}>
                {is_nativepicker ? (
                    <input
                        type='time'
                        id={`dt_${name}_input`}
                        value={selected_time}
                        onChange={handleChange}
                        name={name}
                        min={start_times[0]}
                        max={end_times[end_times.length - 1]}
                    />
                ) : (
                    <React.Fragment>
                        <InputField
                            error_messages={validation_errors}
                            type='text'
                            is_hj_whitelisted
                            is_read_only
                            id={`dt_${name}_input`}
                            className={classNames(`${class_prefix}-input`)}
                            current_focus={current_focus}
                            value={`${selected_time} GMT`}
                            onClick={toggleDropDown}
                            name={name}
                            placeholder={placeholder}
                            setCurrentFocus={setCurrentFocus}
                        />
                        <Icon icon='IcClockOutline' className={`${class_prefix}__icon`} />
                        <CSSTransition
                            in={is_open}
                            classNames={{
                                enter: 'time-picker__dialog--enter',
                                enterDone: 'time-picker__dialog--enter-done',
                                exit: 'time-picker__dialog--exit',
                            }}
                            timeout={100}
                            unmountOnExit
                        >
                            <Dialog
                                end_times={end_times}
                                start_times={start_times}
                                className={'from-left'}
                                onChange={handleChange}
                                preClass={class_prefix}
                                selected_time={selected_time}
                            />
                        </CSSTransition>
                    </React.Fragment>
                )}
            </div>
        );
    }
);

TimePicker.propTypes = {
    end_times: PropTypes.array,
    is_clearable: PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    padding: PropTypes.string,
    placeholder: PropTypes.string,
    selected_time: PropTypes.string,
    start_times: PropTypes.array,
    validation_errors: PropTypes.array,
};

export default TimePicker;
