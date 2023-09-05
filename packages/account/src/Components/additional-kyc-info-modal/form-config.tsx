import React from 'react';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { TOptions, generateValidationFunction } from '@deriv/shared';
import { Dropdown, SelectNative } from '@deriv/components';

type TListItems =
    | React.ComponentProps<typeof Dropdown>['list']
    | React.ComponentProps<typeof SelectNative>['list_items'];

export type TFields = 'place_of_birth' | 'tax_residence' | 'tax_identification_number' | 'account_opening_reason';

type TInputConfig = {
    label: React.ReactNode | string;
    type?: string;
    initial_value: string | number | boolean | null;
    disabled: boolean;
    required: boolean;
    placeholder?: string;
    list_items?: TListItems;
    rules?: Array<(TOptions | unknown)[]>;
};

type TGetField = Omit<TInputConfig, 'initial_value'> & { name: string };

export type TFormFieldsConfig = {
    [key in TFields]: TInputConfig;
};

export const getFormFieldsConfig = (
    account_settings: GetSettings,
    residence_list: ResidenceList,
    required_fields: TFields[]
): TFormFieldsConfig => {
    const isFieldDisabled = (field: string) =>
        Boolean(account_settings.immutable_fields && account_settings.immutable_fields.includes(field));
    const isFieldRequired = (field: TFields) => required_fields.includes(field);
    const config: TFormFieldsConfig = {
        place_of_birth: {
            label: (
                <Localize
                    i18n_default_text='Place of birth{{required}}'
                    values={{ required: isFieldRequired('place_of_birth') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value:
                (account_settings.place_of_birth &&
                    residence_list.find(item => item.value === account_settings.place_of_birth)?.text) ??
                '',
            disabled: isFieldDisabled('place_of_birth'),
            required: isFieldRequired('place_of_birth'),
            list_items: residence_list as TListItems,
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
            initial_value:
                (account_settings.tax_residence &&
                    residence_list.find(item => item.value === account_settings.tax_residence)?.text) ??
                '',
            disabled: isFieldDisabled('tax_residence'),
            required: isFieldRequired('tax_residence'),
            list_items: residence_list as TListItems,
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
            required: isFieldRequired('tax_identification_number'),
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
                    <Localize key='TIN' i18n_default_text='Please fill in tax residence.' />,
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
            required: isFieldRequired('account_opening_reason'),
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
    return config;
};

const generateInitialValues = (fields: TFormFieldsConfig) => {
    const initial_values: Record<string, unknown> = {};
    Object.keys(fields).forEach(field => {
        initial_values[field] = fields[field as TFields].initial_value;
    });
    return initial_values;
};

const getField = (fields: TFormFieldsConfig, name: TFields, with_input_types: boolean): TGetField => {
    const { label, placeholder, required, disabled, type, list_items } = fields[name];

    return {
        name,
        label,
        required,
        disabled,
        ...(with_input_types ? { type } : {}),
        ...(placeholder ? { placeholder } : {}),
        ...(list_items ? { list_items } : {}),
    };
};

export const getFormConfig = ({
    account_settings,
    residence_list,
    required_fields,
    with_input_types = false,
}: {
    account_settings: GetSettings;
    residence_list: ResidenceList;
    required_fields: TFields[];
    with_input_types?: boolean;
}) => {
    const fields_config = getFormFieldsConfig(account_settings, residence_list, required_fields);
    const inputs: Record<TFields | string, TGetField> = {} as Record<TFields, TGetField>;
    Object.keys(fields_config).forEach(field => {
        inputs[field as TFields] = getField(fields_config, field as TFields, with_input_types);
    });
    return {
        fields: inputs,
        validate: generateValidationFunction('', fields_config as any),
        initialValues: generateInitialValues(fields_config),
    };
};
