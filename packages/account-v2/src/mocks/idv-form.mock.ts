import { useResidenceList } from '@deriv/api-v2';

export const mockDocumentList = [
    {
        id: 'aadhaar',
        text: 'Aadhaar Card',
        additional: {
            display_name: 'PAN Card',
            format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
            example_format: 'ABCDE1234F',
        },
        value: '^[0-9]{12}$',
        example_format: '123456789012',
    },
    {
        id: 'drivers_license',
        text: 'Drivers License',
        value: '^[a-zA-Z0-9]{10,17}$',
        example_format: 'AB1234567890123',
    },
    {
        id: 'epic',
        text: 'Voter ID',
        value: '^[a-zA-Z]{3}[0-9]{7}$',
        example_format: 'ABC1234567',
    },
    {
        id: 'pan',
        text: 'PAN Card',
        value: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
        example_format: 'ABCDE1234F',
    },
    {
        id: 'passport',
        text: 'Passport',
        additional: {
            display_name: 'File Number',
            format: '^.{15}$',
            example_format: 'AB1234567890123',
        },
        value: '^.{8}$',
        example_format: 'A1234567',
    },
];

export const selectedCountry: Exclude<
    NonNullable<NonNullable<ReturnType<typeof useResidenceList>['data'][0]['identity']>['services']>['idv'],
    undefined
> = {
    documents_supported: {
        aadhaar: {
            additional: {
                display_name: 'PAN Card',
                format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
            },
            display_name: 'Aadhaar Card',
            format: '^[0-9]{12}$',
        },
        drivers_license: {
            display_name: 'Drivers License',
            format: '^[a-zA-Z0-9]{10,17}$',
        },
        epic: {
            display_name: 'Voter ID',
            format: '^[a-zA-Z]{3}[0-9]{7}$',
        },
        pan: {
            display_name: 'PAN Card',
            format: '^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$',
        },
        passport: {
            additional: {
                display_name: 'File Number',
                format: '^.{15}$',
            },
            display_name: 'Passport',
            format: '^.{8}$',
        },
    },
    has_visual_sample: 0,
    is_country_supported: 1,
};
