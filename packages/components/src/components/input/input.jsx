import classNames from 'classnames';
import React      from 'react';
import FieldError from 'Components/field-error';
import                 './input.scss';

const Input = (props, ref) => (
    <div className={ classNames('dc-input', props.className) }>
        {
            props.leading_icon &&
            React.cloneElement(
                props.leading_icon,
                { className: classNames('dc-input__leading-icon', props.leading_icon.props.className) },
            )
        }
        <input ref={ ref } { ...props } className={classNames('dc-input__field', { 'dc-input__field--placeholder-visible': !props.label && props.placeholder })} />
        {
            props.trailing_icon &&
            React.cloneElement(
                props.trailing_icon,
                { className: classNames('dc-input__trailing-icon', props.trailing_icon.props.className) },
            )
        }
        {props.label &&
            <label className='dc-input__label' htmlFor={props.id}>
                {props.label}
            </label>
        }
        { props.error_message &&
            <FieldError className={props.classNameError} message={props.error_message} />
        }
    </div>
);

export default React.forwardRef(Input);
