import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Checkbox, Popover } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TFormData } from '../types';

type TQSCheckbox = {
    name: string;
    children?: React.ReactNode;
    label: string;
    description?: string;
    fullwidth?: boolean;
    attached?: boolean;
};

const QSCheckbox: React.FC<TQSCheckbox> = observer(
    ({ name, label, description, fullwidth = false, attached = false }) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        const { values, setFieldValue, validateForm } = useFormikContext<TFormData>();

        const handleChange = () => {
            setFieldValue(name, !values?.[name]).finally(() => {
                validateForm();
            });
        };

        return (
            <Field name={name}>
                {({ field }: FieldProps) => {
                    return (
                        <div
                            className={classNames('qs__form__field', {
                                'full-width': fullwidth,
                                'no-border-bottom-radius': attached,
                            })}
                        >
                            <div className='qs__checkbox'>
                                <div className='qs__checkbox__container'>
                                    <Checkbox
                                        {...field}
                                        label={label}
                                        onChange={handleChange}
                                        data-testid='qs-checkbox'
                                    />
                                    <span>
                                        <Popover message={description} zIndex='9999' alignment='top' icon='info' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Field>
        );
    }
);

export default QSCheckbox;
