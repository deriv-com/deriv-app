/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors in Autocomplete & SelectNative components

import { useDevice } from '@deriv-com/ui';
import { SelectNative, Dropdown } from '@deriv/components';
import { useTranslations } from '@deriv-com/translations';
import { Field, FieldProps } from 'formik';
import React from 'react';

type TAccountOpeningReasonFieldProps = {
    required: boolean;
    account_opening_reason_list: { text: string; value: string }[];
    setFieldValue: (field: string, value: string, should_validate?: boolean) => void;
    disabled: boolean;
};

const AccountOpeningReasonField = ({
    required,
    account_opening_reason_list,
    setFieldValue,
    disabled,
}: TAccountOpeningReasonFieldProps) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    return (
        <React.Fragment>
            <Field name='account_opening_reason' id='account-opening-reason'>
                {({ field, meta }: FieldProps) => (
                    <div className='account-form__fieldset'>
                        {isDesktop ? (
                            <Dropdown
                                placeholder={
                                    required ? localize('Account opening reason*') : localize('Account opening reason')
                                }
                                name={field.name}
                                disabled={disabled}
                                is_align_text_left
                                list={account_opening_reason_list}
                                {...field}
                                error={meta.touched && meta.error}
                                required
                            />
                        ) : (
                            <SelectNative
                                placeholder={localize('Please select')}
                                name={field.name}
                                label={
                                    required ? localize('Account opening reason*') : localize('Account opening reason')
                                }
                                list_items={account_opening_reason_list}
                                error={meta.touched && meta.error}
                                onChange={e => {
                                    field.onChange(e);
                                    setFieldValue('account_opening_reason', e.target.value, true);
                                }}
                                {...field}
                                required
                                data_testid='account_opening_reason_mobile'
                                disabled={disabled}
                            />
                        )}
                    </div>
                )}
            </Field>
        </React.Fragment>
    );
};

export default AccountOpeningReasonField;
