import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Field from '../field';
import Text from '../text/text.jsx';

const InputWrapper = ({ children, has_footer }) =>
    has_footer ? <div className='dc-input__wrapper'>{children}</div> : children;

const Input = React.forwardRef(
    (
        {
            className,
            classNameError,
            classNameWarn,
            disabled,
            error,
            has_character_counter,
            hint,
            is_relative_hint,
            initial_character_count,
            label,
            leading_icon,
            max_characters,
            trailing_icon,
            warn,
            input_id,
            ...props
        },
        ref
    ) => {
        const [counter, setCounter] = React.useState(0);

        React.useEffect(() => {
            if (typeof initial_character_count === 'number') {
                setCounter(initial_character_count);
            }
        }, [initial_character_count]);

        const changeHandler = e => {
            let input_value = e.target.value;
            if (max_characters && input_value.length >= max_characters) {
                input_value = input_value.slice(0, max_characters);
            }
            setCounter(input_value.length);
            e.target.value = input_value;
            props.onChange(e);
        };

        const has_footer = has_character_counter || (hint && is_relative_hint);

        return (
            <InputWrapper has_footer={has_footer}>
                <div
                    className={classNames('dc-input', className, {
                        'dc-input--disabled': disabled,
                        'dc-input--error': error,
                    })}
                >
                    {leading_icon &&
                        React.cloneElement(leading_icon, {
                            className: classNames('dc-input__leading-icon', leading_icon.props.className),
                        })}
                    {props.type === 'textarea' ? (
                        <textarea
                            ref={ref}
                            {...props}
                            className={classNames('dc-input__field dc-input__textarea', {
                                'dc-input__field--placeholder-visible': !label && props.placeholder,
                            })}
                            onChange={changeHandler}
                            disabled={disabled}
                            id={input_id}
                        />
                    ) : (
                        <input
                            ref={ref}
                            {...props}
                            className={classNames('dc-input__field', {
                                'dc-input__field--placeholder-visible': !label && props.placeholder,
                            })}
                            onFocus={props.onFocus}
                            onBlur={props.onBlur}
                            disabled={disabled}
                            data-lpignore={props.type === 'password' ? undefined : true}
                            id={input_id}
                        />
                    )}
                    {trailing_icon &&
                        React.cloneElement(trailing_icon, {
                            className: classNames('dc-input__trailing-icon', trailing_icon.props.className),
                        })}
                    {label && (
                        <label className='dc-input__label' htmlFor={props.id}>
                            {label}
                        </label>
                    )}
                    {!has_footer && (
                        <React.Fragment>
                            {error && <Field className={classNameError} message={error} type='error' />}
                            {warn && <Field className={classNameWarn} message={warn} type='warn' />}
                            {!error && hint && !is_relative_hint && (
                                <div className='dc-input__hint'>
                                    <Text as='p' color='less-prominent' size='xxs'>
                                        {hint}
                                    </Text>
                                </div>
                            )}
                        </React.Fragment>
                    )}
                </div>
                {has_footer && (
                    // Added like below for backward compatibility.
                    // TODO: refactor existing usages to use "relative" hints
                    // i.e. get rid of absolute hints, errors, counters.
                    <div className='dc-input__footer'>
                        {error && <Field className={classNameError} message={error} type='error' />}
                        {warn && <Field className={classNameWarn} message={warn} type='warn' />}
                        {!error && hint && (
                            <div className='dc-input__hint dc-input__hint--relative'>
                                <Text color='less-prominent' line-height='m' size='xxs'>
                                    {hint}
                                </Text>
                            </div>
                        )}
                        {has_character_counter && (
                            <div className='dc-input__counter'>
                                <Text color='less-prominent' line-height='m' size='xxs'>
                                    {counter}
                                    {max_characters ? `/${max_characters}` : ''}
                                </Text>
                            </div>
                        )}
                    </div>
                )}
            </InputWrapper>
        );
    }
);

Input.displayName = 'Input';
Input.propTypes = {
    className: PropTypes.string,
    classNameError: PropTypes.string,
    classNameWarn: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    has_character_counter: PropTypes.bool,
    hint: PropTypes.oneOfType([PropTypes.any, PropTypes.node]),
    is_relative_hint: PropTypes.bool,
    initial_character_count: PropTypes.number,
    label: PropTypes.any,
    leading_icon: PropTypes.any,
    max_characters: PropTypes.number,
    trailing_icon: PropTypes.any,
    warn: PropTypes.string,
    input_id: PropTypes.string,
};

export default Input;
