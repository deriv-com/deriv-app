import React                   from 'react';
import { ErrorMessage, Field } from 'formik';
import                              './input.scss';

const Input = (props) => {
    // const TrailingIcon = props.trailing_icon;

    return (
        <Field { ...props }>
            {
                ({ field }) => (
                    <React.Fragment>
                        <div className='dc-input'>
                            <input { ...field } { ...props } className='dc-input__field' />
                            { props.trailing_icon &&
                                React.cloneElement(
                                    props.trailing_icon,
                                    { className: 'dc-input__trailing-icon' },
                                )
                            }
                            {/* { TrailingIcon && <TrailingIcon className='dc-input__trailing-icon' /> } */}
                            <label className='dc-input__label' htmlFor={ field.id }>{ props.label || props.placeholder }</label>
                        </div>
                        <ErrorMessage name={ field.name }>
                            {
                                (msg) => (
                                    <p className='dc-input__error'>
                                        { msg }
                                    </p>
                                )
                            }
                        </ErrorMessage>
                    </React.Fragment>
                )
            }
        </Field>
    );
};

export default Input;
