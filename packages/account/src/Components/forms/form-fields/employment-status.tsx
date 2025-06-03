import React from 'react';
import clsx from 'clsx';
import { Field, FieldProps } from 'formik';

import { Dropdown, SelectNative } from '@deriv/components';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

import { getEmploymentStatusList } from '../../../Constants/financial-information-list';

type TEmploymentStatusFieldProps = {
    required: boolean;
    is_disabled: boolean;
    fieldFocused?: boolean;
    version?: string;
    is_feature_flag_disabled?: boolean;
};

const EmploymentStatusField = ({
    required,
    is_feature_flag_disabled,
    is_disabled,
    fieldFocused,
    version,
}: TEmploymentStatusFieldProps) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <Field name='employment_status'>
            {({ field, form: { setFieldValue, setFieldTouched, handleBlur, handleChange }, meta }: FieldProps) => (
                <div className='employment-status-field'>
                    {isDesktop ? (
                        <Dropdown
                            {...field}
                            placeholder={required ? localize('Employment status*') : localize('Employment status')}
                            is_align_text_left
                            name={field.name}
                            list={getEmploymentStatusList(version, is_feature_flag_disabled)}
                            value={field.value}
                            onChange={(e: { target: { name: string; value: string } }) => {
                                setFieldValue('tin_skipped', 0, true);
                                setFieldValue(field.name, e.target?.value, true);
                                handleChange(e);
                            }}
                            handleBlur={handleBlur}
                            error={meta.touched ? meta.error : undefined}
                            disabled={is_disabled}
                            className={clsx('dropdown-field', { 'focus-field': fieldFocused })}
                        />
                    ) : (
                        <SelectNative
                            {...field}
                            placeholder={localize('Please select')}
                            name={field.name}
                            label={required ? localize('Employment status*') : localize('Employment status')}
                            list_items={getEmploymentStatusList(version, is_feature_flag_disabled)}
                            value={field.value}
                            error={meta.touched ? meta.error : undefined}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setFieldValue('tin_skipped', 0, true);
                                setFieldTouched('employment_status', true);
                                handleChange(e);
                            }}
                            disabled={is_disabled}
                            className={clsx({ 'focus-field': fieldFocused })}
                        />
                    )}
                </div>
            )}
        </Field>
    );
};

export default EmploymentStatusField;
