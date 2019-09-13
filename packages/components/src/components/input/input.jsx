import classNames from 'classnames';
import React      from 'react';
import FieldError from 'Components/field-error';
import                 './input.scss';

const Input = ({ className, classNameError, error, trailing_icon, label, ...props }, ref) => (
    <div className={ classNames('dc-input', className) }>
        <input ref={ ref } { ...props } className='dc-input__field' />
        {
            trailing_icon &&
            React.cloneElement(
                trailing_icon,
                { className: classNames('dc-input__trailing-icon', trailing_icon.props.className) },
            )
        }
        <label className='dc-input__label' htmlFor={ props.id }>
            { label || props.placeholder }
        </label>
        { props.error &&
            <FieldError className={classNameError} message={error} />
        }
    </div>
);

export default React.forwardRef(Input);
