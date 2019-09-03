import classNames              from 'classnames';
import React                   from 'react';
import { ErrorMessage, Field } from 'formik';
import                              './input.scss';

const Input = (props, ref) => (
    <Field { ...props }>
        {
            ({ field }) => (
                <div className={ classNames('dc-input', props.className) }>
                    {
                        props.leading_icon &&
                        React.cloneElement(
                            props.leading_icon,
                            { className: classNames('dc-input__leading-icon', props.leading_icon.props.className) },
                        )
                    }
                    <input ref={ ref } { ...field } { ...props } className={classNames('dc-input__field', { 'dc-input__field--placeholder-visible': !props.label && props.placeholder })} />
                    {
                        props.trailing_icon &&
                        React.cloneElement(
                            props.trailing_icon,
                            { className: classNames('dc-input__trailing-icon', props.trailing_icon.props.className) },
                        )
                    }
                    {props.label &&
                        <label className='dc-input__label' htmlFor={ field.id }>
                            { props.label }
                        </label>
                    }
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
