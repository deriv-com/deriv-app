import classNames from 'classnames';
import React      from 'react';
import FieldError from 'Components/field-error';
import                 './input.scss';

const Input = ({
    className,
    classNameError,
    error,
    leading_icon,
    trailing_icon,
    label,
    placeholder,
    ...props
}, ref) => (
    <div className={ classNames('dc-input', className) }>
        {
            leading_icon &&
            React.cloneElement(
                leading_icon,
                { className: classNames('dc-input__leading-icon', leading_icon.props.className) },
            )
        }
        <input ref={ ref } { ...props } className={classNames('dc-input__field', { 'dc-input__field--placeholder-visible': !label && placeholder })} />
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
    </div>
);

export default React.forwardRef(Input);
