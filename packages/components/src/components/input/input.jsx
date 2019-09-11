import classNames from 'classnames';
import React      from 'react';
import FieldError from 'Components/field-error';
import                 './input.scss';

const Input = (props, ref) => (
    <div className={ classNames('dc-input', props.className) }>
        <input ref={ ref } { ...props } className='dc-input__field' />
        {
            props.trailing_icon &&
            React.cloneElement(
                props.trailing_icon,
                { className: classNames('dc-input__trailing-icon', props.trailing_icon.props.className) },
            )
        }
        <label className='dc-input__label' htmlFor={ props.id }>
            { props.label || props.placeholder }
        </label>
        { props.error &&
            <FieldError className={props.classNameError} message={props.error} />
        }
    </div>
);

export default React.forwardRef(Input);
