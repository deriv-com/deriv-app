import { personal_details_config } from 'Configs/personal-details-config';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getErrorMessages: jest.fn().mockReturnValue({
        name: jest.fn(),
        password: jest.fn(),
    }),
    generateValidationFunction: jest.fn(),
    getDefaultFields: jest.fn(),
    toMoment: jest.fn(),
    validLength: jest.fn(),
}));
describe('personal-details-config', () => {
    const mock_props = {
        residence_list: [
            {
                services: {
                    idv: {
                        documents_supported: {},
                        has_visual_sample: 0,
                        is_country_supported: 0,
                    },
                    onfido: {
                        documents_supported: {
                            passport: {
                                display_name: 'Passport',
                            },
                        },
                        is_country_supported: 0,
                    },
                },
                phone_idd: '93',
                text: 'Afghanistan',
                value: 'af',
                tin_format: [],
                disabled: '1',
            },
            {
                services: {
                    idv: {
                        documents_supported: {},
                        has_visual_sample: 0,
                        is_country_supported: 0,
                    },
                    onfido: {
                        documents_supported: {
                            driving_licence: {
                                display_name: 'Driving Licence',
                            },
                            national_identity_card: {
                                display_name: 'National Identity Card',
                            },
                            passport: {
                                display_name: 'Passport',
                            },
                            residence_permit: {
                                display_name: 'Residence Permit',
                            },
                        },
                        is_country_supported: 1,
                    },
                    phone_idd: '93',
                    text: 'Indonesia',
                    value: 'af',
                    tin_format: [],
                    disabled: '1',
                },
            },
        ],
        account_settings: {
            tax_residence: 'af',
            residence: 'Indonesia',
        },
        is_appstore: false,
        real_account_signup_target: 'maltainvest',
        account_status: { cashier_validation: ['system_maintenance'] },
    };

    it('should return account tax residence as default value if it is already set', () => {
        const personal_details = personal_details_config(mock_props);
        expect(personal_details[0].tax_residence.default_value).toEqual('Afghanistan');
    });

    it('should return residence as the default value for MF clients, If the account tax residence is not set', () => {
        const new_props = {
            ...mock_props,
            account_settings: {
                ...mock_props.account_settings,
                tax_residence: '',
            },
        };
        const personal_details = personal_details_config(new_props);
        expect(personal_details[0].tax_residence.default_value).toEqual(new_props.account_settings.residence);
    });

    it('should not set default value for CR clients, If the account tax residence is not set', () => {
        const new_props = {
            ...mock_props,
            real_account_signup_target: 'svg',
            account_settings: {
                ...mock_props.account_settings,
                tax_residence: '',
            },
        };
        const personal_details = personal_details_config(new_props);
        expect(personal_details[0].tax_residence.default_value).toEqual('');
    });
});
