import React                   from 'react';
import { ErrorMessage, Field } from 'formik';
import                              './input.scss';

const Input = (props) => (
    <Field { ...props }>
        {
            ({ field }) => (
                <div className='dc-input'>
                    <input { ...field } { ...props } className='dc-input__field' />
                    <span className='dc-input__bar' />
                    <label className='dc-input__label' htmlFor={ field.id }>{ props.label || props.placeholder }</label>
                    <ErrorMessage name={ field.name }>
                        {
                            (msg) => (
                                <span className='dc-input__error'>
                                    { msg }
                                </span>
                            )
                        }
                    </ErrorMessage>
                </div>
            )
        }
    </Field>
);

export default Input;
