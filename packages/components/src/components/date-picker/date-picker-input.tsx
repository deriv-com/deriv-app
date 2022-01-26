import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';
import Input from '../input';

type DatePickerInputProps = {
    className: string;
    error_messages: unknown;
    placeholder: string;
    id: unknown | number | string;
    is_clearable: boolean;
    name: string;
    label: string;
    show_leading_icon: boolean;
    onClick: () => void;
    onClickClear: () => void;
    value: unknown | number | string;
};

const DatePickerIcon = ({ icon, ...props }) => <Icon className='dc-datepicker__icon' icon={icon} {...props} />;

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
}: DatePickerInputProps) => {
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
            leading_icon={show_leading_icon && OpenIcon}
            trailing_icon={show_leading_icon ? undefined : trailing_icon}
            type={readOnly ? 'text' : 'number'}
            value={is_placeholder_visible || !value ? '' : value}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onBlur={onBlur}
            required={required}
        />
    );
};

export default DatePickerInput;
