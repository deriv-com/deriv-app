import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Checkbox, Popover } from '@deriv/components';
import { rudderStackSendQsParameterChangeEvent } from '../analytics/rudderstack-quick-strategy';
import { TFormData } from '../types';

type TQSCheckbox = {
    name: string;
    children?: React.ReactNode;
    label: string;
    description?: string;
    attached?: boolean;
};

const QSCheckbox: React.FC<TQSCheckbox> = ({ name, label, description, attached = false }) => {
    const { values, setFieldValue, validateForm } = useFormikContext<TFormData>();

    const handleChange = () => {
        rudderStackSendQsParameterChangeEvent({
            parameter_type: name,
            parameter_value: !values?.[name],
            parameter_field_type: 'checkbox',
        });
        setFieldValue(name, !values?.[name]).finally(() => {
            validateForm();
        });
    };

    return (
        <Field name={name}>
            {({ field }: FieldProps) => {
                return (
                    <div
                        className={classNames('qs__form__field qs__form__field__input', {
                            'no-border-bottom-radius': attached,
                        })}
                    >
                        <div className='qs__checkbox'>
                            <div className='qs__checkbox__container'>
                                <Checkbox {...field} label={label} onChange={handleChange} data-testid='qs-checkbox' />
                                <span>
                                    <Popover
                                        classNameTargetIcon='qs__checkbox__info'
                                        message={description}
                                        zIndex='9999'
                                        alignment='top'
                                        icon='info'
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }}
        </Field>
    );
};

export default QSCheckbox;
