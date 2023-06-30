import classNames from 'classnames';
import React from 'react';
import Field from '../field';
import Text from '../text/text';

export type TInputProps = {
    autoComplete?: string;
    bottom_label?: string;
    className?: string;
    classNameError?: string;
    classNameHint?: string;
    classNameWarn?: string;
    data_testId?: string;
    disabled?: boolean;
    error?: string;
    field_className?: string;
    has_character_counter?: boolean;
    hint?: React.ReactNode;
    id?: string;
    initial_character_count?: number;
    input_id?: string;
    is_relative_hint?: boolean;
    label_className?: string;
    label?: React.ReactNode;
    leading_icon?: React.ReactElement;
    max_characters?: number;
    maxLength?: number;
    name?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onPaste?: React.ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyUp?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onKeyDown?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onInput?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    placeholder?: string;
    required?: boolean;
    trailing_icon?: React.ReactElement | null;
    type?: string;
    value?: string | number;
    warn?: string;
    readOnly?: boolean;
    is_autocomplete_disabled?: string;
    is_hj_whitelisted?: string;
};

type TInputWrapper = {
    has_footer: boolean;
};

const InputWrapper = ({ children, has_footer }: React.PropsWithChildren<TInputWrapper>) =>
    has_footer ? <div className='dc-input__wrapper'>{children}</div> : <React.Fragment>{children}</React.Fragment>;

const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, TInputProps>(
    (
        {
            bottom_label,
            className,
            classNameError,
            classNameHint,
            classNameWarn,
            disabled = false,
            error,
            field_className,
            has_character_counter,
            hint,
            initial_character_count,
            input_id,
            is_relative_hint,
            label_className,
            label,
            leading_icon,
            max_characters,
            trailing_icon,
            warn,
            data_testId,
            maxLength,
            ...props
        },
        ref?
    ) => {
        const [counter, setCounter] = React.useState(0);

        React.useEffect(() => {
            if (initial_character_count || initial_character_count === 0) {
                setCounter(initial_character_count);
            }
        }, [initial_character_count]);

        const changeHandler: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = e => {
            let input_value = e.target.value;
            if (max_characters && input_value.length >= max_characters) {
                input_value = input_value.slice(0, max_characters);
            }
            setCounter(input_value.length);
            e.target.value = input_value;
            props.onChange?.(e);
        };

        const has_footer = !!has_character_counter || (!!hint && !!is_relative_hint);

        return (
            <InputWrapper has_footer={has_footer}>
                <div
                    className={classNames('dc-input', className, {
                        'dc-input--disabled': disabled,
                        'dc-input--error': error,
                        'dc-input--hint': hint,
                        'dc-input--bottom-label-active': bottom_label,
                    })}
                >
                    <div
                        className={classNames('dc-input__container', {
                            'dc-input__container--disabled': disabled,
                            'dc-input__container--error': error,
                        })}
                    >
                        {leading_icon &&
                            React.cloneElement(leading_icon, {
                                className: classNames('dc-input__leading-icon', leading_icon.props.className),
                            })}
                        {props.type === 'textarea' ? (
                            <textarea
                                ref={ref}
                                data-testid={data_testId}
                                {...props}
                                className={classNames('dc-input__field dc-input__textarea', {
                                    'dc-input__field--placeholder-visible': !label && props.placeholder,
                                })}
                                onChange={changeHandler}
                                disabled={disabled}
                                id={input_id}
                                maxLength={maxLength}
                            />
                        ) : (
                            <input
                                ref={ref}
                                data-testid={data_testId}
                                {...props}
                                className={classNames('dc-input__field', field_className, {
                                    'dc-input__field--placeholder-visible': !label && props.placeholder,
                                })}
                                onFocus={props.onFocus}
                                onBlur={props.onBlur}
                                onChange={props.onChange}
                                onPaste={props.onPaste}
                                disabled={disabled}
                                data-lpignore={props.type === 'password' ? undefined : true}
                                id={input_id}
                                aria-label={label as string}
                                maxLength={maxLength}
                            />
                        )}
                        {trailing_icon &&
                            React.cloneElement(trailing_icon, {
                                className: classNames('dc-input__trailing-icon', trailing_icon.props.className),
                            })}
                        {label && (
                            <label className={classNames('dc-input__label', label_className)} htmlFor={props.id}>
                                {label}
                            </label>
                        )}
                    </div>
                    <div>
                        {!has_footer && (
                            <React.Fragment>
                                {error && <Field className={classNameError} message={error} type='error' />}
                                {warn && <Field className={classNameWarn} message={warn} type='warn' />}
                                {!error && hint && !is_relative_hint && (
                                    <div className='dc-input__hint'>
                                        <Text as='p' color='less-prominent' size='xxs' className={classNameHint}>
                                            {hint}
                                        </Text>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
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
                {bottom_label && !error && (
                    <div className='dc-input__bottom-label'>
                        <Text size='xs' color='less-prominent'>
                            {bottom_label}
                        </Text>
                    </div>
                )}
            </InputWrapper>
        );
    }
);

Input.displayName = 'Input';

export default Input;
