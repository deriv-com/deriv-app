import React from 'react';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';

export const getFormFields = (
    account_settings: GetSettings,
    residence_list: ResidenceList,
    required_fields: string[]
) => {
    const isFieldDisabled = (field: string) =>
        account_settings.immutable_fields && account_settings.immutable_fields.includes(field);
    const isFieldRequired = (field: string) => required_fields.includes(field);
    return {
        place_of_birth: {
            label: (
                <Localize
                    i18n_default_text='Place of birth{{required}}'
                    values={{ required: isFieldRequired('place_of_birth') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value: account_settings.place_of_birth
                ? residence_list.find(item => item.value === account_settings.place_of_birth)?.text
                : '',
            disabled: isFieldDisabled('place_of_birth'),
            is_requried: isFieldRequired('place_of_birth'),
            list_items: residence_list,
            rules: [['req', <Localize key='place_of_birth' i18n_default_text='Place of birth is required.' />]],
        },
        tax_residence: {
            label: (
                <Localize
                    i18n_default_text='Tax residence{{required}}'
                    values={{ required: isFieldRequired('tax_residence') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value: account_settings.tax_residence ?? '',
            disabled: isFieldDisabled('tax_residence'),
            is_requried: isFieldRequired('tax_residence'),
            list_items: residence_list,
            rules: [['req', <Localize key='tax_residence' i18n_default_text='Tax residence is required.' />]],
        },
        tax_identification_number: {
            label: (
                <Localize
                    i18n_default_text='Tax Identification number{{required}}'
                    values={{ required: isFieldRequired('place_of_birth') ? '*' : '' }}
                />
            ),
            type: 'text',
            initial_value: account_settings.tax_identification_number ?? '',
            disabled: isFieldDisabled('tax_identification_number'),
            is_requried: isFieldRequired('tax_identification_number'),
            rules: [
                ['req', <Localize key='TIN' i18n_default_text='Tax Identification Number is required.' />],
                [
                    'length',
                    <Localize
                        key='TIN'
                        i18n_default_text="Tax Identification Number can't be longer than 25 characters."
                    />,
                    { min: 0, max: 25 },
                ],
                [
                    'regular',
                    <Localize
                        key='TIN'
                        i18n_default_text='Letters, numbers, spaces, periods, hyphens and forward slashes only.'
                    />,
                    {
                        regex: /^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/,
                    },
                ],
                [
                    (value: string, options: Record<string, unknown>, { tax_residence }: { tax_residence: string }) => {
                        return !!tax_residence;
                    },
                    <Localize key='TIN' i18n_default_text='Please fill in Tax residence.' />,
                ],
                [
                    (value: string, options: Record<string, unknown>, { tax_residence }: { tax_residence: string }) => {
                        const from_list = residence_list.filter(res => res.text === tax_residence && res.tin_format);
                        const tin_format = from_list[0]?.tin_format;
                        return tin_format ? tin_format.some(tax_regex => new RegExp(tax_regex).test(value)) : true;
                    },
                    <Localize key='TIN' i18n_default_text='Tax Identification Number is invalid.' />,
                ],
            ],
        },
        account_opening_reason: {
            label: (
                <Localize
                    i18n_default_text='Intended use of account{{required}}'
                    values={{ required: isFieldRequired('account_opening_reason') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value: account_settings.account_opening_reason ?? '',
            disabled: isFieldDisabled('account_opening_reason'),
            is_requried: isFieldRequired('account_opening_reason'),
            list_items: [
                {
                    text: localize('Hedging'),
                    value: 'Hedging',
                },
                {
                    text: localize('Income Earning'),
                    value: 'Income Earning',
                },
                {
                    text: localize('Speculative'),
                    value: 'Speculative',
                },
            ],
            rules: [
                [
                    'req',
                    <Localize key='account_opening_reason' i18n_default_text='Intended use of account is required.' />,
                ],
            ],
        },
    };
};

const generateValidationFunction = (fields: Record<string, any>, required_fields: string[]) => {
    return (values: Record<string, any>) => {
        const errors = {};
        Object.keys(fields).forEach(field => {
            const field_rules = fields[field].rules;
            const field_value = values[field];
            const error = field_rules.reduce((error, rule) => {
                const [rule_name, message] = rule;
                if (error) {
                    return error;
                }
                switch (rule_name) {
                    case 'req':
                        if (!field_value && required_fields.includes(field)) {
                            return message;
                        }
                        return undefined;
                    default:
                        return undefined;
                }
            }, undefined);
            if (error) {
                errors[field] = error;
            }
        });
        return errors;
    };
};

const generateInitialValues = (fields: Record<string, any>) => {
    const initial_values: any = {};
    Object.keys(fields).forEach(field => {
        initial_values[field] = fields[field].initial_value;
    });
    return initial_values;
};

const getField = (fields: Record<string, any>, field_name: string, withInputTypes: boolean) => {
    const { label, placeholder, is_required, disabled, type, options } = fields[field_name];

    return {
        name: field_name,
        label,
        required: is_required,
        disabled,
        ...(withInputTypes ? { type } : {}),
        ...(placeholder ? { placeholder } : {}),
        ...(options ? { options } : {}),
    };
};

export const getInputs = ({
    account_settings,
    residence_list,
    required_fields,
    withInputTypes = false,
}: {
    account_settings: GetSettings;
    residence_list: ResidenceList;
    required_fields: string[];
    withInputTypes?: boolean;
}) => {
    const fields = getFormFields(account_settings, residence_list, required_fields);
    const inputs: any = {};
    Object.keys(fields).forEach(field => {
        inputs[field] = getField(fields, field, withInputTypes);
    });
    return {
        fields: inputs,
        validate: generateValidationFunction(fields, required_fields),
        initialValues: generateInitialValues(fields),
    };
};
