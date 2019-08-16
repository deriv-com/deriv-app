import React                   from 'react';
import { ErrorMessage, Field } from 'formik';
import                              './input.scss';

const Input = (props) => (
    <Field { ...props }>
        {
            ({ field }) => (
                <React.Fragment>
                    <div className='dc-input'>
                        <input { ...field } { ...props } className='dc-input__field' />
                        <span className='dc-input__bar' />
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

export default Input;
