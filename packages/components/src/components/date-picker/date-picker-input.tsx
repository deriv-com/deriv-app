import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import Input from '../input';

const DatePickerIcon = ({ icon, ...props }:  React.ComponentProps<typeof Icon>) => (
    <Icon className='dc-datepicker__icon' icon={icon} {...props} />
);

type TDatePickerInputProps = React.ComponentProps<typeof Input> & {
    is_placeholder_visible: boolean;
    is_clearable?: boolean;
    show_leading_icon?: boolean;
    onChangeInput: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onClickClear?: () => void;
};

const DatePickerInput = ({
    className,
    disabled,
    error,
    id,
    is_placeholder_visible,
    name,
    label,
    show_leading_icon,
    placeholder,
    is_clearable,
    onChangeInput,
    onClickClear,
    onClick,
    onBlur,
    readOnly,
    value,
    required,
    ...common_props
}: TDatePickerInputProps) => {
    const [is_clear_btn_visible, setIsClearBtnVisible] = React.useState(false);

    const onMouseEnter = () => {
        if (is_clearable) {
            setIsClearBtnVisible(true);
        }
    };

    const onMouseLeave = () => {
        setIsClearBtnVisible(false);
    };

    const OpenIcon = (
        <DatePickerIcon
            className={classNames({
                'dc-datepicker__icon': typeof onClick === 'function',
            })}
            icon='IcCalendar'
            {...(disabled ? { color: 'disabled' } : { onClick })}
        />
    );

    const trailing_icon =
        is_clearable && is_clear_btn_visible && !disabled ? (
            <DatePickerIcon icon='IcCloseCircle' onClick={onClickClear} color='secondary' />
        ) : (
            OpenIcon
        );

    return (
        <Input
            className={classNames('dc-datepicker__input', className, {
                'dc-datepicker__input--has-leading-icon': show_leading_icon,
            })}
            data-lpignore='true'
            disabled={disabled}
            error={error}
            id={id ? `${id}_input` : undefined}
            autoComplete='off'
            is_autocomplete_disabled='true'
            is_hj_whitelisted='true'
            label={label}
            name={name}
            onChange={onChangeInput}
            onClick={onClick}
            placeholder={placeholder}
            readOnly={readOnly}
            leading_icon={show_leading_icon ? OpenIcon : undefined}
            trailing_icon={show_leading_icon ? undefined : trailing_icon}
            type={readOnly ? 'text' : 'number'}
            value={is_placeholder_visible || !value ? '' : value}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onBlur={onBlur}
            required={required}
            {...common_props}
        />
    );
};

export default DatePickerInput;
