import classNames from 'classnames';
import React      from 'react';
import FieldError from 'Components/field-error';

const Input = ({
    className,
    classNameError,
    disabled,
    error,
    hint,
    leading_icon,
    trailing_icon,
    label,
    ...props
}, ref) => (
    <div
        className={ classNames('dc-input', className, {
            'dc-input__disabled': disabled,
            'dc-input--error'   : error,
        })}
    >
        {
            leading_icon &&
            React.cloneElement(
                leading_icon,
                { className: classNames('dc-input__leading-icon', leading_icon.props.className) },
            )
        }
        {props.type === 'textarea'
            ? <textarea ref={ ref } { ...props } className={classNames('dc-input__field', { 'dc-input__field--placeholder-visible': !label && props.placeholder })} disabled={disabled} />
            : <input ref={ ref } { ...props } className={classNames('dc-input__field', { 'dc-input__field--placeholder-visible': !label && props.placeholder })} disabled={disabled} />
        }
        {
            trailing_icon &&
            React.cloneElement(
                trailing_icon,
                { className: classNames('dc-input__trailing-icon', trailing_icon.props.className) },
            )
        }
        { label &&
            <label className='dc-input__label' htmlFor={props.id}>
                {label}
            </label>
        }
        { error &&
            <FieldError className={classNameError} message={error} />
        }
        {
            !error && hint &&
            <p className='dc-input__hint'>
                {hint}
            </p>
        }
    </div>
);

export default React.forwardRef(Input);
