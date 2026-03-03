/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck [TODO] - Need to fix typescript errors with ResidenceList types
import React from 'react';
import { Field, FieldProps } from 'formik';

import { Autocomplete, Loading, SelectNative, Text } from '@deriv/components';
import { useResidenceList } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import './tax-info-modal.scss';

type TTaxInfoPlaceOfBirthProps = {
    value: string;
    onItemSelection: (value: string) => void;
};

const TaxInfoPlaceOfBirth = ({ value, onItemSelection }: TTaxInfoPlaceOfBirthProps) => {
    const { isDesktop } = useDevice();
    const { data: residence_list, isFetched: residence_list_fetched } = useResidenceList();
    const [display_value, setDisplayValue] = React.useState('');

    // Set initial display value from the list when it loads
    React.useEffect(() => {
        if (residence_list?.length && value) {
            const matched = residence_list.find(item => item.value === value);
            if (matched?.text) {
                setDisplayValue(matched.text);
            }
        }
    }, [residence_list, value]);

    return (
        <div className='tax-info-modal__bottom-margin'>
            <Text weight='bold' className='tax-info-modal__field-label'>
                <Localize i18n_default_text='Place of birth' />
            </Text>
            {!residence_list_fetched && <Loading is_fullscreen={false} />}
            {residence_list?.length > 0 && (
                <Field name='place_of_birth'>
                    {({ field, form: { setFieldValue }, meta }: FieldProps) => (
                        <>
                            {isDesktop ? (
                                <Autocomplete
                                    {...field}
                                    data-lpignore='true'
                                    autoComplete='none'
                                    label={localize('Place of birth')}
                                    list_items={residence_list}
                                    error={meta.touched ? meta.error : undefined}
                                    onItemSelection={({ value: selected_value, text }) => {
                                        setFieldValue('place_of_birth', selected_value, true);
                                        setDisplayValue(text);
                                        onItemSelection(selected_value);
                                    }}
                                    list_portal_id='modal_root'
                                    value={display_value || field.value}
                                    required
                                    onChange={e => {
                                        if (display_value) {
                                            setDisplayValue('');
                                        }
                                        setFieldValue('place_of_birth', '', false);
                                        field.onChange(e);
                                    }}
                                    onBlur={e => {
                                        if (!e.target.value && field.value) {
                                            const matched = residence_list.find(item => item.value === field.value);
                                            setDisplayValue(matched?.text ?? field.value);
                                        }
                                        field.onBlur(e);
                                    }}
                                />
                            ) : (
                                <SelectNative
                                    {...field}
                                    placeholder={localize('Place of birth')}
                                    label={localize('Place of birth')}
                                    list_items={residence_list}
                                    error={meta.touched ? meta.error : undefined}
                                    onChange={e => {
                                        const selected_value = e.target.value;
                                        const matched = residence_list.find(item => item.value === selected_value);
                                        setFieldValue('place_of_birth', selected_value, true);
                                        setDisplayValue(matched?.text ?? selected_value);
                                        onItemSelection(selected_value);
                                    }}
                                    required
                                />
                            )}
                        </>
                    )}
                </Field>
            )}
        </div>
    );
};

export default TaxInfoPlaceOfBirth;
