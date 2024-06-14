import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Popover, Text, ToggleSwitch } from '@deriv/components';
import { TFormData } from '../types';
import { localize } from '@deriv/translations';

type TQSToggleSwitch = {
    name: string;
    label: string;
    description?: string;
    attached?: boolean;
    isEnabledToggleSwitch: boolean;
    setIsEnabledToggleSwitch: () => void;
};

const QSToggleSwitch: React.FC<TQSToggleSwitch> = ({
    name,
    label,
    description,
    attached = false,
    isEnabledToggleSwitch,
    setIsEnabledToggleSwitch,
}) => {
    const { values, setFieldValue } = useFormikContext<TFormData>();

    const handleChange = async () => {
        setIsEnabledToggleSwitch();
        await setFieldValue(name, !values?.[name], true);
        await setFieldValue('max_stake', values?.max_stake, true);
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
                                <label className='dc-checkbox'>
                                    <Text size='xs' className='dc-checkbox__label'>
                                        {label}
                                    </Text>
                                    <Text size='xxs'>{localize('(optional)')}</Text>
                                </label>
                                <span>
                                    <Popover
                                        classNameTargetIcon='qs__checkbox__info'
                                        message={description}
                                        zIndex='9999'
                                        alignment='top'
                                        icon='info'
                                    />
                                </span>
                                <ToggleSwitch
                                    id='dt_mobile_drawer_theme_toggler'
                                    handleToggle={handleChange}
                                    is_enabled={isEnabledToggleSwitch}
                                    data-testid='qs-toggle-switch'
                                />
                            </div>
                        </div>
                    </div>
                );
            }}
        </Field>
    );
};

export default QSToggleSwitch;
