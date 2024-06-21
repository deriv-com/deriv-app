import clsx from 'clsx';
import { Field, FieldProps } from 'formik';
import { DesktopWrapper, Dropdown, MobileWrapper, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getEmploymentStatusList } from '../../../Constants/financial-information-list';

type TEmploymentStatusFieldProps = {
    required: boolean;
    is_disabled: boolean;
};

const EmploymentStatusField = ({ required, is_disabled }: TEmploymentStatusFieldProps) => (
    <Field name='employment_status'>
        {({ field, form: { setFieldValue, setFieldTouched, handleBlur, handleChange }, meta }: FieldProps) => (
            <div className={clsx('account-form__fieldset', 'emp-status')}>
                <DesktopWrapper>
                    <Dropdown
                        placeholder={required ? localize('Employment status*') : localize('Employment status')}
                        is_align_text_left
                        name={field.name}
                        list={getEmploymentStatusList()}
                        value={field.value}
                        onChange={e => {
                            setFieldValue(field.name, e.target?.value, true);
                            handleChange(e);
                        }}
                        handleBlur={handleBlur}
                        error={meta.touched ? meta.error : undefined}
                        disabled={is_disabled}
                    />
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        placeholder={localize('Please select')}
                        name={field.name}
                        label={required ? localize('Employment status*') : localize('Employment status')}
                        list_items={getEmploymentStatusList()}
                        value={field.value}
                        error={meta.touched ? meta.error : undefined}
                        onChange={e => {
                            setFieldTouched('employment_status', true);
                            handleChange(e);
                        }}
                        disabled={is_disabled}
                    />
                </MobileWrapper>
            </div>
        )}
    </Field>
);

export default EmploymentStatusField;
