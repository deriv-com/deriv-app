import React, { ChangeEvent } from 'react';
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

const QSCheckbox: React.FC<TQSCheckbox> = observer(({ name, label, description, fullwidth = false }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { values, setFieldValue, validateForm } = useFormikContext<TFormData>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFieldValue(name, e.target.checked);
        validateForm();
    };

    return (
        <Field name={name}>
            {({ field }: FieldProps) => {
                return (
                    <div className={classNames('qs__form__field', { 'full-width': fullwidth })}>
                        <div className='qs__input-label'>
                            <Checkbox {...field} label={label} onChange={handleChange} checked={!!values[name]} />
                            <span>
                                <Popover
                                    message={description}
                                    zIndex='9999'
                                    alignment={is_mobile ? 'bottom' : 'right'}
                                    icon='info'
                                />
                            </span>
                        </div>
                    </div>
                );
            }}
        </Field>
    );
});

export default QSCheckbox;
