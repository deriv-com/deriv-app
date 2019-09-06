import classNames              from 'classnames';
import React                   from 'react';
import { ErrorMessage, Field } from 'formik';

const Input = (props, ref) => (
    <Field { ...props }>
        {
            ({ field }) => (
                <div className={ classNames('dc-input', props.className) }>
                    <input ref={ ref } { ...field } { ...props } className='dc-input__field' />
                    {
                        props.trailing_icon &&
                        React.cloneElement(
                            props.trailing_icon,
                            { className: classNames('dc-input__trailing-icon', props.trailing_icon.props.className) },
                        )
                    }
                    <label className='dc-input__label' htmlFor={ field.id }>
                        { props.label || props.placeholder }
                    </label>
                    <ErrorMessage name={ field.name }>
                        {
                            (msg) => (
                                <p className='dc-input__error'>
                                    { msg }
                                </p>
                            )
                        }
                    </ErrorMessage>
                </div>
            )
        }
    </Field>
);

export default React.forwardRef(Input);
