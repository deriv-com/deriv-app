/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck [TODO] - Need to fix typescript errors with ResidenceList types
import React from 'react';
import { Field, FieldProps } from 'formik';

import { Autocomplete, Checkbox, Input, SelectNative, Text } from '@deriv/components';
import { useResidenceList, useTinValidations } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import { ValidationConstants } from '@deriv-com/utils';
import { useDevice } from '@deriv-com/ui';

import NoTinJustification from './no-tin-justification';

import './tax-info-modal.scss';

type TTaxInfoDetailsProps = {
    tax_residence_value: string;
    tax_identification_number: string;
    has_tax_details: boolean | null;
    no_tin_justification_key: string;
    no_tin_other_reason: string;
    tax_identification_confirm: boolean;
    onTaxResidenceChange: (value: string) => void;
    onHasTaxDetailsChange: (value: boolean) => void;
    onNoTinJustificationSelect: (key: string) => void;
    onNoTinOtherReasonChange: (value: string) => void;
    onTaxIdConfirmChange: (value: boolean) => void;
    onTinChange: (value: string) => void;
    onTinValidationError: (error: string) => void;
};

const TaxInfoDetails = ({
    tax_residence_value,
    tax_identification_number,
    has_tax_details,
    no_tin_justification_key,
    no_tin_other_reason,
    tax_identification_confirm,
    onTaxResidenceChange,
    onHasTaxDetailsChange,
    onNoTinJustificationSelect,
    onNoTinOtherReasonChange,
    onTaxIdConfirmChange,
    onTinChange,
    onTinValidationError,
}: TTaxInfoDetailsProps) => {
    const { isDesktop } = useDevice();
    const { data: residence_list } = useResidenceList();
    const { tin_validation_config, mutate } = useTinValidations();
    const [tax_residence_display, setTaxResidenceDisplay] = React.useState('');
    const [tin_error, setTinError] = React.useState('');

    const validateTin = React.useCallback(
        (value: string) => {
            if (!value) {
                setTinError('');
                onTinValidationError('');
                return;
            }

            // 1. Max length check
            if (value.length > 25) {
                const err = localize("Tax identification number can't be longer than 25 characters.");
                setTinError(err);
                onTinValidationError(err);
                return;
            }

            // 2. Allowed characters
            const { taxIdentificationNumber } = ValidationConstants.patterns;
            if (!taxIdentificationNumber.test(value)) {
                const err = localize('Only letters, numbers, space, hyphen, period, and forward slash are allowed.');
                setTinError(err);
                onTinValidationError(err);
                return;
            }

            // 3. Format validation (from API: tin_format)
            if (
                tin_validation_config?.tin_format?.length &&
                !tin_validation_config.tin_format.some((tax_regex: string) => new RegExp(tax_regex).test(value))
            ) {
                const err = localize('Tax identification number is not properly formatted.');
                setTinError(err);
                onTinValidationError(err);
                return;
            }

            // 4. Invalid patterns (from API: invalid_patterns)
            if (
                tin_validation_config?.invalid_patterns?.length &&
                tin_validation_config.invalid_patterns.some((invalid_pattern: string) =>
                    new RegExp(invalid_pattern).test(value)
                )
            ) {
                const err = localize('Tax identification number is not properly formatted.');
                setTinError(err);
                onTinValidationError(err);
                return;
            }

            setTinError('');
            onTinValidationError('');
        },
        [tin_validation_config, onTinValidationError]
    );

    // On mount: if tax_residence is pre-populated from BE, fetch the validation config immediately
    React.useEffect(() => {
        if (tax_residence_value) {
            mutate(tax_residence_value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-validate TIN when the validation config updates (after tax residence changes or initial load)
    React.useEffect(() => {
        if (has_tax_details === true && tax_identification_number) {
            validateTin(tax_identification_number);
        }
    }, [tin_validation_config]);

    React.useEffect(() => {
        if (residence_list?.length && tax_residence_value) {
            const matched = residence_list.find(item => item.value === tax_residence_value);
            if (matched?.text) {
                setTaxResidenceDisplay(matched.text);
            }
        }
    }, [residence_list, tax_residence_value]);

    const handleTaxResidenceSelect = (value: string, text: string) => {
        setTaxResidenceDisplay(text);
        onTaxResidenceChange(value);
        if (value) {
            mutate(value);
        }
    };

    return (
        <div>
            {/* Country of Tax Residence */}
            <div className='tax-info-modal__bottom-margin'>
                <Field name='tax_residence'>
                    {({ field, form: { setFieldValue }, meta }: FieldProps) => (
                        <div className='tax-info-modal__bottom-margin'>
                            {isDesktop ? (
                                <Autocomplete
                                    {...field}
                                    data-lpignore='true'
                                    autoComplete='off'
                                    label={localize('Country of tax residence')}
                                    error={meta.touched ? meta.error : undefined}
                                    list_items={residence_list}
                                    onItemSelection={({ value: selected_value, text }) => {
                                        const val = selected_value ?? '';
                                        const txt = text ?? '';
                                        setFieldValue('tax_residence', val, true);
                                        handleTaxResidenceSelect(val, txt);
                                    }}
                                    data-testid='tax_residence'
                                    value={tax_residence_display || field.value}
                                    onChange={e => {
                                        if (tax_residence_display) {
                                            setTaxResidenceDisplay('');
                                        }
                                        setFieldValue('tax_residence', '', false);
                                        field.onChange(e);
                                    }}
                                />
                            ) : (
                                <SelectNative
                                    {...field}
                                    placeholder={localize('Select...')}
                                    name={field.name}
                                    label={localize('Country of tax residence')}
                                    list_items={residence_list}
                                    value={tax_residence_display || field.value}
                                    use_text
                                    error={meta.touched ? meta.error : ''}
                                    onChange={e => {
                                        const selected_item = residence_list?.find(
                                            item => item.text === e.target.value
                                        );
                                        const val = selected_item?.value ?? '';
                                        const txt = selected_item?.text ?? '';
                                        setTaxResidenceDisplay(txt);
                                        setFieldValue('tax_residence', val, false);
                                        handleTaxResidenceSelect(val, txt);
                                    }}
                                    data_testid='tax_residence_mobile'
                                />
                            )}
                        </div>
                    )}
                </Field>
            </div>

            {/* TIN options - radio-like buttons */}
            <div className='tax-info-modal__options-list'>
                <div
                    className={`tax-info-modal__option-item${has_tax_details === true ? ' tax-info-modal__option-item--selected' : ''}`}
                    onClick={() => onHasTaxDetailsChange(true)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onHasTaxDetailsChange(true);
                        }
                    }}
                >
                    <Text size='s'>
                        <Localize i18n_default_text='I have a tax identification number' />
                    </Text>
                </div>

                <div
                    className={`tax-info-modal__option-item${has_tax_details === false ? ' tax-info-modal__option-item--selected' : ''}`}
                    onClick={() => onHasTaxDetailsChange(false)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onHasTaxDetailsChange(false);
                        }
                    }}
                >
                    <Text size='s'>
                        <Localize i18n_default_text="I don't have a tax identification number" />
                    </Text>
                </div>

                {/* TIN input - shown below both options when "I have a tax identification number" is selected */}
                {has_tax_details === true && (
                    <div className='tax-info-modal__bottom-margin tax-info-modal__top-margin'>
                        <hr className='tax-info-modal__divider' />
                        <Input
                            name='tax_identification_number'
                            type='text'
                            label={localize('Tax identification number')}
                            placeholder={localize('Enter your tax identification number')}
                            value={tax_identification_number}
                            error={tin_error}
                            maxLength={25}
                            onChange={e => {
                                const val = e.target.value;
                                onTinChange(val);
                                validateTin(val);
                            }}
                            onBlur={() => {
                                validateTin(tax_identification_number);
                            }}
                        />
                        <div style={{ marginTop: '1.2rem' }}>
                            <Checkbox
                                name='tax_identification_confirm'
                                label={localize('I confirm that my tax information is accurate and complete.')}
                                value={tax_identification_confirm}
                                onChange={() => onTaxIdConfirmChange(!tax_identification_confirm)}
                            />
                        </div>
                    </div>
                )}

                {/* No TIN justification - shown below both options when "I don't have TIN" is selected */}
                {has_tax_details === false && (
                    <NoTinJustification
                        selected_key={no_tin_justification_key}
                        other_reason={no_tin_other_reason}
                        onSelect={onNoTinJustificationSelect}
                        onOtherReasonChange={onNoTinOtherReasonChange}
                    />
                )}
            </div>
        </div>
    );
};

export default TaxInfoDetails;
