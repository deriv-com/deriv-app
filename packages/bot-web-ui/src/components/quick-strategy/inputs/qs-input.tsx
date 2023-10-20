import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';

import { Input, Popover } from '@deriv/components';

type TQSInput = {
    name: string;
    type?: string;
    fullwidth?: boolean;
    attached?: boolean;
};

const QSInput: React.FC<TQSInput> = ({ type = 'text', fullwidth = false, attached = false, name }) => {
    const [has_focus, setFocus] = React.useState(false);
    const { setFieldValue, setFieldTouched } = useFormikContext();
    const is_number = type === 'number';

    const handleChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
        e?.preventDefault();
        setFieldTouched(name, true, true);
        setFieldValue(name, value);
    };

    return (
        <Field name={name} key={name} id={name}>
            {({ field, meta }: FieldProps) => {
                const { error, touched } = meta;
                const has_error = error && touched;
                return (
                    <div
                        className={classNames('qs__form__field', {
                            'full-width': fullwidth,
                            'no-top-spacing': attached,
                        })}
                    >
                        <div onMouseEnter={() => setFocus(true)} onMouseLeave={() => setFocus(false)}>
                            <Popover
                                alignment='bottom'
                                message={error}
                                is_open={!!(error && touched && has_focus)}
                                zIndex='9999'
                                classNameBubble='qs__warning-bubble'
                                has_error
                                should_disable_pointer_events
                            >
                                <Input
                                    data_testId='qs-input'
                                    className={classNames('qs__input', { error: has_error })}
                                    type={type}
                                    leading_icon={
                                        is_number && (
                                            <button
                                                data-testid='qs-input-decrease'
                                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                    const value = Number(field.value) - 1;
                                                    handleChange(e, String(value % 1 ? value.toFixed(2) : value));
                                                }}
                                            >
                                                -
                                            </button>
                                        )
                                    }
                                    trailing_icon={
                                        is_number && (
                                            <button
                                                data-testid='qs-input-increase'
                                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                    const value = Number(field.value) + 1;
                                                    handleChange(e, String(value % 1 ? value.toFixed(2) : value));
                                                }}
                                            >
                                                +
                                            </button>
                                        )
                                    }
                                    {...field}
                                />
                            </Popover>
                        </div>
                    </div>
                );
            }}
        </Field>
    );
};

export default QSInput;
