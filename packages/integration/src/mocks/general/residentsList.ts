import { Context } from '../../utils/mocks/mocks';

export default function mockResidentsList(context: Context) {
    if ('residence_list' in context.request) {
        context.response = {
            echo_req: {
                req_id: context.req_id,
                residence_list: 1,
            },
            msg_type: 'residence_list',
            req_id: context.req_id,
            residence_list: [
                {
                    identity: {
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
                    },
                    phone_idd: '93',
                    text: 'Afghanistan',
                    value: 'af',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '35818',
                    text: 'Aland Islands',
                    value: 'ax',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '355',
                    text: 'Albania',
                    tin_format: ['^[A-Ta-t0-9]\\d{8}[A-Wa-w]$'],
                    value: 'al',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '213',
                    text: 'Algeria',
                    value: 'dz',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '684',
                    text: 'American Samoa',
                    value: 'as',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '376',
                    text: 'Andorra',
                    tin_format: ['^[FfEeAaLlCcDdGgOoPpUu]\\d{6}[a-zA-Z]$'],
                    value: 'ad',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '244',
                    text: 'Angola',
                    value: 'ao',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1264',
                    text: 'Anguilla',
                    value: 'ai',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '672',
                    selected: 'selected',
                    text: 'Antarctica',
                    value: 'aq',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1268',
                    text: 'Antigua and Barbuda',
                    tin_format: ['^\\d{6}$'],
                    value: 'ag',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    dni: {
                                        display_name: 'Documento Nacional de Identidad',
                                        format: '^\\d{7,8}$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                        },
                    },
                    phone_idd: '54',
                    text: 'Argentina',
                    tin_format: ['^(20|23|24|25|26|27|30|33)\\d{9}$'],
                    value: 'ar',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '374',
                    text: 'Armenia',
                    value: 'am',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '297',
                    text: 'Aruba',
                    tin_format: ['^\\d{8}$'],
                    value: 'aw',
                },
                {
                    identity: {
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
                                    immigration_status_document: {
                                        display_name: 'Immigration Status Document',
                                    },
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
                                    },
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '61',
                    text: 'Australia',
                    value: 'au',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    asylum_registration_card: {
                                        display_name: 'Asylum Registration Card',
                                    },
                                    driving_licence: {
                                        display_name: 'Driving Licence',
                                    },
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '43',
                    text: 'Austria',
                    tin_format: ['^\\d{9}$'],
                    value: 'at',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '994',
                    text: 'Azerbaijan',
                    tin_format: ['^\\d{10}$'],
                    value: 'az',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1242',
                    text: 'Bahamas',
                    value: 'bs',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '973',
                    text: 'Bahrain',
                    value: 'bh',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '880',
                    text: 'Bangladesh',
                    value: 'bd',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1246',
                    text: 'Barbados',
                    value: 'bb',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '375',
                    text: 'Belarus',
                    value: 'by',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '32',
                    text: 'Belgium',
                    value: 'be',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '501',
                    text: 'Belize',
                    tin_format: ['^\\d{6}(10|13|66)$'],
                    value: 'bz',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '229',
                    text: 'Benin',
                    value: 'bj',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1441',
                    text: 'Bermuda',
                    value: 'bm',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '975',
                    text: 'Bhutan',
                    value: 'bt',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '591',
                    text: 'Bolivia',
                    value: 'bo',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '387',
                    text: 'Bosnia and Herzegovina',
                    value: 'ba',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '267',
                    text: 'Botswana',
                    value: 'bw',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    text: 'Bouvet Island',
                    value: 'bv',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    cpf: {
                                        display_name: 'CPF',
                                        format: '^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                        },
                    },
                    phone_idd: '55',
                    text: 'Brazil',
                    tin_format: ['^(\\d{11}|\\d{14})$'],
                    value: 'br',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '246',
                    text: 'British Indian Ocean Territory',
                    value: 'io',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1284',
                    text: 'British Virgin Islands',
                    value: 'vg',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '673',
                    text: 'Brunei',
                    value: 'bn',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                        },
                    },
                    phone_idd: '359',
                    text: 'Bulgaria',
                    tin_format: ['^\\d{10}$'],
                    value: 'bg',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '226',
                    text: 'Burkina Faso',
                    value: 'bf',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '257',
                    text: 'Burundi',
                    value: 'bi',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '855',
                    text: 'Cambodia',
                    value: 'kh',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '237',
                    text: 'Cameroon',
                    value: 'cm',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1',
                    text: 'Canada',
                    value: 'ca',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '238',
                    text: 'Cape Verde',
                    value: 'cv',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '599',
                    text: 'Caribbean Netherlands',
                    value: 'bq',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1345',
                    text: 'Cayman Islands',
                    value: 'ky',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '236',
                    text: 'Central African Republic',
                    value: 'cf',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '235',
                    text: 'Chad',
                    value: 'td',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    national_id: {
                                        display_name: 'National ID Number',
                                        format: '^\\d{8}[A-Za-z0-9]$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '56',
                    text: 'Chile',
                    tin_format: ['^\\d{7,8}[0-9Kk]$'],
                    value: 'cl',
                },
                {
                    identity: {
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
                                    immigration_status_document: {
                                        display_name: 'Immigration Status Document',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '86',
                    text: 'China',
                    tin_format: [
                        '^\\d{17}[Xx\\d]$',
                        '^[CcWwHhMmTt]\\d{16}[xX\\d]$',
                        '^[Jj]\\d{14}$',
                        '^(\\d{15}|\\d{18})$',
                        '^\\d{8}\\w{10}$',
                    ],
                    value: 'cn',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '618',
                    text: 'Christmas Island',
                    value: 'cx',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '6189162',
                    text: 'Cocos (Keeling) Islands',
                    value: 'cc',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '57',
                    text: 'Colombia',
                    tin_format: ['^\\d{8,10}$'],
                    value: 'co',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '269',
                    text: 'Comoros',
                    value: 'km',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '242',
                    text: 'Congo - Brazzaville',
                    value: 'cg',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '243',
                    text: 'Congo - Kinshasa',
                    value: 'cd',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '682',
                    text: 'Cook Islands',
                    tin_format: ['^\\d{5}$'],
                    value: 'ck',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '506',
                    text: 'Costa Rica',
                    tin_format: ['^\\d{9,12}$'],
                    value: 'cr',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '225',
                    text: "Cote d'Ivoire",
                    value: 'ci',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                        },
                    },
                    phone_idd: '385',
                    text: 'Croatia',
                    tin_format: ['^\\d{11}$'],
                    value: 'hr',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '53',
                    text: 'Cuba',
                    value: 'cu',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '5999',
                    text: 'Curacao',
                    value: 'cw',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                        },
                    },
                    phone_idd: '357',
                    text: 'Cyprus',
                    tin_format: ['^\\d{8}[A-Za-z]$'],
                    value: 'cy',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '420',
                    text: 'Czech Republic',
                    tin_format: ['^\\d{9,10}$'],
                    value: 'cz',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '45',
                    text: 'Denmark',
                    tin_format: ['^\\d{10}$'],
                    value: 'dk',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '253',
                    text: 'Djibouti',
                    value: 'dj',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1767',
                    text: 'Dominica',
                    tin_format: ['^[1-9]\\d{5}$'],
                    value: 'dm',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1809',
                    text: 'Dominican Republic',
                    value: 'do',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '593',
                    text: 'Ecuador',
                    tin_format: ['^\\d{10}001$', '^\\d{2}6\\d{6}0001$'],
                    value: 'ec',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '20',
                    text: 'Egypt',
                    value: 'eg',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '503',
                    text: 'El Salvador',
                    value: 'sv',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '240',
                    text: 'Equatorial Guinea',
                    value: 'gq',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '291',
                    text: 'Eritrea',
                    value: 'er',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '372',
                    text: 'Estonia',
                    tin_format: ['^\\d{11}$'],
                    value: 'ee',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
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
                        },
                    },
                    phone_idd: '251',
                    text: 'Ethiopia',
                    value: 'et',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '500',
                    text: 'Falkland Islands',
                    value: 'fk',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '298',
                    text: 'Faroe Islands',
                    tin_format: ['^\\d{9}$'],
                    value: 'fo',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '679',
                    text: 'Fiji',
                    value: 'fj',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '358',
                    text: 'Finland',
                    tin_format: ['^\\d{6}[-+A]\\d{3}\\w$'],
                    value: 'fi',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    asylum_registration_card: {
                                        display_name: 'Asylum Registration Card',
                                    },
                                    driving_licence: {
                                        display_name: 'Driving Licence',
                                    },
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '33',
                    text: 'France',
                    tin_format: ['^\\d{13}$'],
                    value: 'fr',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '594',
                    text: 'French Guiana',
                    value: 'gf',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '689',
                    text: 'French Polynesia',
                    value: 'pf',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    text: 'French Southern Territories',
                    value: 'tf',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '241',
                    text: 'Gabon',
                    value: 'ga',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '220',
                    text: 'Gambia',
                    value: 'gm',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '995',
                    text: 'Georgia',
                    value: 'ge',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '49',
                    text: 'Germany',
                    tin_format: ['^\\d{11}$'],
                    value: 'de',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    drivers_license: {
                                        display_name: 'Drivers License',
                                        format: '^((\\d{8}[a-zA-Z]{1}\\d{1})|([a-zA-Z]{1}\\d{7})|([a-zA-Z]{3}\\-\\d{8}\\-\\d{5}))$',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                        format: '^(?i)G[a-zA-Z0-9]{7,9}$',
                                    },
                                    ssnit: {
                                        display_name: 'Social Security and National Insurance Trust (SSNIT)',
                                        format: '^[a-zA-Z]{1}[0-9]{12,14}$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '233',
                    text: 'Ghana',
                    tin_format: ['^(GHA)-[0-9]{8,9}-[0-9]{1}$', '^(GRA|P00|C00|G00|Q00|V00)[A-Za-z0-9]{8}$'],
                    value: 'gh',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '350',
                    text: 'Gibraltar',
                    tin_format: ['^\\d{6}$'],
                    value: 'gi',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '30',
                    text: 'Greece',
                    tin_format: ['^\\d{9}$'],
                    value: 'gr',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '299',
                    text: 'Greenland',
                    tin_format: ['^\\d{10}$'],
                    value: 'gl',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1473',
                    text: 'Grenada',
                    tin_format: ['^\\d{8}$'],
                    value: 'gd',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '590',
                    text: 'Guadeloupe',
                    value: 'gp',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '671',
                    text: 'Guam',
                    value: 'gu',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '502',
                    text: 'Guatemala',
                    value: 'gt',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '441481',
                    text: 'Guernsey',
                    value: 'gg',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '224',
                    text: 'Guinea',
                    value: 'gn',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '245',
                    text: 'Guinea-Bissau',
                    value: 'gw',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '592',
                    text: 'Guyana',
                    value: 'gy',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '509',
                    text: 'Haiti',
                    value: 'ht',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    text: 'Heard & McDonald Islands',
                    value: 'hm',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '504',
                    text: 'Honduras',
                    value: 'hn',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '852',
                    text: 'Hong Kong SAR China',
                    value: 'hk',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '36',
                    text: 'Hungary',
                    tin_format: ['^\\d{10}$'],
                    value: 'hu',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '354',
                    text: 'Iceland',
                    tin_format: ['^\\d{10}$'],
                    value: 'is',
                },
                {
                    identity: {
                        services: {
                            idv: {
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                    voter_id: {
                                        display_name: 'Voter Id',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '91',
                    text: 'India',
                    tin_format: ['^[a-zA-Z]{5}\\d{4}[a-zA-Z]$'],
                    value: 'in',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    nik: {
                                        display_name: 'Nomor Induk Kependudukan',
                                        format: '^\\d{16}$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                        },
                    },
                    phone_idd: '62',
                    text: 'Indonesia',
                    tin_format: ['^\\d{15}$'],
                    value: 'id',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                    },
                    phone_idd: '98',
                    text: 'Iran',
                    value: 'ir',
                },
                {
                    identity: {
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
                    },
                    phone_idd: '964',
                    text: 'Iraq',
                    value: 'iq',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '353',
                    text: 'Ireland',
                    tin_format: ['^\\d{7}[A-Za-z]{1,2}$'],
                    value: 'ie',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '44',
                    text: 'Isle of Man',
                    value: 'im',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '972',
                    text: 'Israel',
                    value: 'il',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '39',
                    text: 'Italy',
                    tin_format: [
                        '^[A-Za-z]{6}\\d{2}[A-Za-z]\\d{2}[A-Za-z]\\d{3}[A-Za-z]$',
                        '^[A-Za-z]{6}\\d{2}[A-Za-z]\\d{2}[A-Za-z0-9]{4}[A-Za-z]$',
                    ],
                    value: 'it',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    voter_id: {
                                        display_name: 'Voter Id',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1876',
                    text: 'Jamaica',
                    value: 'jm',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '81',
                    text: 'Japan',
                    value: 'jp',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '441534',
                    text: 'Jersey',
                    value: 'je',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '962',
                    text: 'Jordan',
                    value: 'jo',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '7',
                    text: 'Kazakhstan',
                    tin_format: ['^\\d{12}$'],
                    value: 'kz',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    alien_card: {
                                        display_name: 'Alien Card',
                                        format: '^[0-9]{6,9}$',
                                    },
                                    national_id: {
                                        display_name: 'National ID Number',
                                        format: '^[0-9]{1,9}$',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                        format: '^[A-Z0-9]{7,9}$',
                                    },
                                },
                                has_visual_sample: 1,
                                is_country_supported: 1,
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '254',
                    text: 'Kenya',
                    value: 'ke',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '686',
                    text: 'Kiribati',
                    value: 'ki',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '965',
                    text: 'Kuwait',
                    tin_format: ['^\\d{12}$'],
                    value: 'kw',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '996',
                    text: 'Kyrgyzstan',
                    value: 'kg',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '856',
                    text: 'Laos',
                    value: 'la',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '371',
                    text: 'Latvia',
                    tin_format: ['^\\d{11}$', '^32\\d{9}$'],
                    value: 'lv',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '961',
                    text: 'Lebanon',
                    tin_format: ['^\\d+$'],
                    value: 'lb',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '266',
                    text: 'Lesotho',
                    value: 'ls',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '231',
                    text: 'Liberia',
                    value: 'lr',
                },
                {
                    identity: {
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
                    },
                    phone_idd: '218',
                    text: 'Libya',
                    value: 'ly',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '417',
                    text: 'Liechtenstein',
                    tin_format: ['^\\d{1,12}$'],
                    value: 'li',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '370',
                    text: 'Lithuania',
                    tin_format: ['^\\d{11}$'],
                    value: 'lt',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '352',
                    text: 'Luxembourg',
                    tin_format: ['^\\d{13}$'],
                    value: 'lu',
                },
                {
                    identity: {
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
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '853',
                    text: 'Macau SAR China',
                    tin_format: ['^\\d+$'],
                    value: 'mo',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '389',
                    text: 'Macedonia',
                    value: 'mk',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '261',
                    text: 'Madagascar',
                    value: 'mg',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '265',
                    text: 'Malawi',
                    value: 'mw',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '60',
                    text: 'Malaysia',
                    value: 'my',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '960',
                    text: 'Maldives',
                    value: 'mv',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '223',
                    text: 'Mali',
                    value: 'ml',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '356',
                    text: 'Malta',
                    value: 'mt',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '692',
                    text: 'Marshall Islands',
                    tin_format: ['^\\d{7,8}$'],
                    value: 'mh',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '596',
                    text: 'Martinique',
                    value: 'mq',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '222',
                    text: 'Mauritania',
                    value: 'mr',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '230',
                    text: 'Mauritius',
                    tin_format: ['^[17823]\\d{7}$'],
                    value: 'mu',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '262269',
                    text: 'Mayotte',
                    value: 'yt',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    curp: {
                                        display_name: 'Clave Única de Registro de Población',
                                        format: '^[a-zA-Z]{4}[0-9]{6}[MmHh]{1}[a-zA-Z]{5}[a-zA-Z0-9]{2}$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                                    voter_id: {
                                        display_name: 'Voter Id',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '52',
                    text: 'Mexico',
                    tin_format: ['^[a-zA-Z]{3,4}\\d{6}\\w{3}$'],
                    value: 'mx',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '691',
                    text: 'Micronesia',
                    value: 'fm',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '373',
                    text: 'Moldova',
                    value: 'md',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '377',
                    text: 'Monaco',
                    value: 'mc',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '976',
                    text: 'Mongolia',
                    value: 'mn',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '382',
                    text: 'Montenegro',
                    value: 'me',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1664',
                    text: 'Montserrat',
                    value: 'ms',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '212',
                    text: 'Morocco',
                    value: 'ma',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '258',
                    text: 'Mozambique',
                    value: 'mz',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '95',
                    text: 'Myanmar (Burma)',
                    value: 'mm',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '264',
                    text: 'Namibia',
                    value: 'na',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '674',
                    text: 'Nauru',
                    tin_format: ['^\\d{9}$'],
                    value: 'nr',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '977',
                    text: 'Nepal',
                    value: 'np',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    asylum_registration_card: {
                                        display_name: 'Asylum Registration Card',
                                    },
                                    driving_licence: {
                                        display_name: 'Driving Licence',
                                    },
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '31',
                    text: 'Netherlands',
                    tin_format: ['^\\d{9}$'],
                    value: 'nl',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '687',
                    text: 'New Caledonia',
                    value: 'nc',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '64',
                    text: 'New Zealand',
                    tin_format: ['^\\d{8,9}$'],
                    value: 'nz',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '505',
                    text: 'Nicaragua',
                    value: 'ni',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '227',
                    text: 'Niger',
                    value: 'ne',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    drivers_license: {
                                        display_name: 'Drivers License',
                                        format: '^[a-zA-Z]{3}([ -]{1})?[A-Z0-9]{6,12}$',
                                    },
                                    nin_slip: {
                                        display_name: 'National ID Number Slip',
                                        format: '^[0-9]{11}$',
                                    },
                                },
                                has_visual_sample: 1,
                                is_country_supported: 1,
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
                                    voter_id: {
                                        display_name: 'Voter Id',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '234',
                    text: 'Nigeria',
                    tin_format: ['^\\d{10}$', '^\\d{8}$', '^[A-Za-z]\\d{4,8}$', '^\\d{11}$', '^\\d{12}$'],
                    value: 'ng',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '683',
                    text: 'Niue',
                    value: 'nu',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '6723',
                    text: 'Norfolk Island',
                    value: 'nf',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                    },
                    phone_idd: '850',
                    text: 'North Korea',
                    value: 'kp',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1670',
                    text: 'Northern Mariana Islands',
                    value: 'mp',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    asylum_registration_card: {
                                        display_name: 'Asylum Registration Card',
                                    },
                                    driving_licence: {
                                        display_name: 'Driving Licence',
                                    },
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '47',
                    text: 'Norway',
                    value: 'no',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '968',
                    text: 'Oman',
                    value: 'om',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '92',
                    text: 'Pakistan',
                    tin_format: ['^\\d{13}$', '^\\d{7}$'],
                    value: 'pk',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '680',
                    text: 'Palau',
                    value: 'pw',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '970',
                    text: 'Palestinian Territories',
                    value: 'ps',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '507',
                    text: 'Panama',
                    tin_format: ['^[a-zA-Z0-9]\\d{7}$'],
                    value: 'pa',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '675',
                    text: 'Papua New Guinea',
                    value: 'pg',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '595',
                    text: 'Paraguay',
                    value: 'py',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    national_id: {
                                        display_name: 'National ID Number',
                                        format: '^\\d{8}$',
                                    },
                                },
                                has_visual_sample: 0,
                                is_country_supported: 1,
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
                        },
                    },
                    phone_idd: '51',
                    text: 'Peru',
                    value: 'pe',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
                                    },
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                    voter_id: {
                                        display_name: 'Voter Id',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '63',
                    text: 'Philippines',
                    value: 'ph',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '649',
                    text: 'Pitcairn Islands',
                    value: 'pn',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '48',
                    text: 'Poland',
                    tin_format: ['^\\d{10,11}$'],
                    value: 'pl',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '351',
                    text: 'Portugal',
                    tin_format: ['^\\d{9}$'],
                    value: 'pt',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1787',
                    text: 'Puerto Rico',
                    value: 'pr',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '974',
                    text: 'Qatar',
                    value: 'qa',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '262',
                    text: 'Reunion',
                    value: 're',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                        },
                    },
                    phone_idd: '40',
                    text: 'Romania',
                    tin_format: ['^\\d{13}$'],
                    value: 'ro',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '7',
                    text: 'Russia',
                    tin_format: ['^\\d{12}$'],
                    value: 'ru',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '250',
                    text: 'Rwanda',
                    value: 'rw',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '590',
                    text: 'Saint Barthelemy',
                    value: 'bl',
                },
                {
                    identity: {
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
                    },
                    phone_idd: '290',
                    text: 'Saint Helena',
                    value: 'sh',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1869',
                    text: 'Saint Kitts and Nevis',
                    value: 'kn',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1758',
                    text: 'Saint Lucia',
                    tin_format: ['^\\d{1,6}$'],
                    value: 'lc',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '590',
                    text: 'Saint Martin',
                    value: 'mf',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '508',
                    text: 'Saint Pierre and Miquelon',
                    value: 'pm',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '685',
                    text: 'Samoa',
                    value: 'ws',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '378',
                    text: 'San Marino',
                    tin_format: ['^\\d{8,9}$', '^[SsMm]\\d{5}$'],
                    value: 'sm',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '239',
                    text: 'Sao Tome and Principe',
                    value: 'st',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '966',
                    text: 'Saudi Arabia',
                    tin_format: ['^\\d{10}$'],
                    value: 'sa',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '221',
                    text: 'Senegal',
                    value: 'sn',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '381',
                    text: 'Serbia',
                    value: 'rs',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '248',
                    text: 'Seychelles',
                    tin_format: ['^\\d{2}[1-7]\\d{6}$'],
                    value: 'sc',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '232',
                    text: 'Sierra Leone',
                    value: 'sl',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '65',
                    text: 'Singapore',
                    tin_format: [
                        '^[SsTtFfGg]\\d{7}[A-Za-z]$',
                        '^[A-Za-z]{9,10}$',
                        '^[Ff]0000\\d{6}$',
                        '^[Ff]\\d{9}$',
                        '^([Ss]|[Tt][4])\\d{9}$',
                        '^[Aa]\\d{9}$',
                    ],
                    value: 'sg',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '1721',
                    text: 'Sint Maarten',
                    value: 'sx',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '421',
                    text: 'Slovakia',
                    tin_format: ['^\\d{9,10}$'],
                    value: 'sk',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '386',
                    text: 'Slovenia',
                    tin_format: ['^\\d{8}$'],
                    value: 'si',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '677',
                    text: 'Solomon Islands',
                    value: 'sb',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '252',
                    text: 'Somalia',
                    value: 'so',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    national_id: {
                                        display_name: 'National ID Number',
                                        format: '^[0-9]{13}$',
                                    },
                                },
                                has_visual_sample: 1,
                                is_country_supported: 1,
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '27',
                    text: 'South Africa',
                    tin_format: ['^[01239]\\d{3}\\/?\\d{3}\\/?\\d{3}$'],
                    value: 'za',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '500',
                    text: 'South Georgia & South Sandwich Islands',
                    value: 'gs',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '82',
                    text: 'South Korea',
                    tin_format: ['^\\d{13}$'],
                    value: 'kr',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '211',
                    text: 'South Sudan',
                    value: 'ss',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '34',
                    text: 'Spain',
                    tin_format: ['^[KkLlMmXxYyZz]\\d{7}[A-Za-z]$', '^\\d{8}[A-Za-z]$'],
                    value: 'es',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '94',
                    text: 'Sri Lanka',
                    value: 'lk',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1784',
                    text: 'St. Vincent & Grenadines',
                    tin_format: ['^\\d+$'],
                    value: 'vc',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '249',
                    text: 'Sudan',
                    value: 'sd',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '597',
                    text: 'Suriname',
                    value: 'sr',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '4779',
                    text: 'Svalbard and Jan Mayen',
                    value: 'sj',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '268',
                    text: 'Swaziland',
                    value: 'sz',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '46',
                    text: 'Sweden',
                    tin_format: ['^\\d{10}$', '^\\d{12}$'],
                    value: 'se',
                },
                {
                    identity: {
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
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '41',
                    text: 'Switzerland',
                    tin_format: [
                        '^756\\.[0-9]{4}\\.[0-9]{4}\\.[0-9]{2}$',
                        '^(CHE|che)-[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}$',
                    ],
                    value: 'ch',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                    },
                    phone_idd: '963',
                    text: 'Syria',
                    value: 'sy',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '886',
                    text: 'Taiwan',
                    value: 'tw',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '992',
                    text: 'Tajikistan',
                    value: 'tj',
                },
                {
                    identity: {
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
                                    voter_id: {
                                        display_name: 'Voter Id',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '255',
                    text: 'Tanzania',
                    value: 'tz',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '66',
                    text: 'Thailand',
                    value: 'th',
                },
                {
                    identity: {
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
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                },
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '670',
                    text: 'Timor-Leste',
                    value: 'tl',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '228',
                    text: 'Togo',
                    value: 'tg',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '690',
                    text: 'Tokelau',
                    value: 'tk',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '676',
                    text: 'Tonga',
                    value: 'to',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1868',
                    text: 'Trinidad and Tobago',
                    value: 'tt',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '216',
                    text: 'Tunisia',
                    value: 'tn',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '90',
                    text: 'Turkey',
                    tin_format: ['^\\d{10}$'],
                    value: 'tr',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '993',
                    text: 'Turkmenistan',
                    value: 'tm',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1649',
                    text: 'Turks and Caicos Islands',
                    value: 'tc',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '688',
                    text: 'Tuvalu',
                    value: 'tv',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    text: 'U.S. Outlying Islands',
                    value: 'um',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1340',
                    text: 'U.S. Virgin Islands',
                    value: 'vi',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    national_id_no_photo: {
                                        additional: {
                                            display_name: 'Card Number',
                                            format: '^[a-zA-Z0-9]+$',
                                        },
                                        display_name: 'National ID Number',
                                        format: '^[a-zA-Z0-9]{14}$',
                                    },
                                },
                                has_visual_sample: 1,
                                is_country_supported: 1,
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '256',
                    text: 'Uganda',
                    value: 'ug',
                },
                {
                    identity: {
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '380',
                    text: 'Ukraine',
                    value: 'ua',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                        },
                    },
                    phone_idd: '971',
                    text: 'United Arab Emirates',
                    value: 'ae',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    asylum_registration_card: {
                                        display_name: 'Asylum Registration Card',
                                    },
                                    driving_licence: {
                                        display_name: 'Driving Licence',
                                    },
                                    immigration_status_document: {
                                        display_name: 'Immigration Status Document',
                                    },
                                    national_health_insurance_card: {
                                        display_name: 'National Health Insurance Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                    residence_permit: {
                                        display_name: 'Residence Permit',
                                    },
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '44',
                    text: 'United Kingdom',
                    tin_format: ['^\\d{10}$', '^[A-Za-z]{2}\\d{6}[A-Za-z]$'],
                    value: 'gb',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                    visa: {
                                        display_name: 'Visa',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '1',
                    text: 'United States',
                    value: 'us',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '598',
                    text: 'Uruguay',
                    tin_format: ['^\\d{8,9}$', '^\\d{8}001\\d$'],
                    value: 'uy',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '998',
                    text: 'Uzbekistan',
                    value: 'uz',
                },
                {
                    disabled: 'DISABLED',
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '678',
                    text: 'Vanuatu',
                    value: 'vu',
                },
                {
                    identity: {
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
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '379',
                    text: 'Vatican City',
                    value: 'va',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '58',
                    text: 'Venezuela',
                    value: 've',
                },
                {
                    identity: {
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
                        },
                    },
                    phone_idd: '84',
                    text: 'Vietnam',
                    value: 'vn',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '681',
                    text: 'Wallis and Futuna',
                    value: 'wf',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {},
                                has_visual_sample: 0,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {},
                                is_country_supported: 0,
                            },
                        },
                    },
                    phone_idd: '21',
                    text: 'Western Sahara',
                    value: 'eh',
                },
                {
                    identity: {
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
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '967',
                    text: 'Yemen',
                    value: 'ye',
                },
                {
                    identity: {
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
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '260',
                    text: 'Zambia',
                    value: 'zm',
                },
                {
                    identity: {
                        services: {
                            idv: {
                                documents_supported: {
                                    national_id: {
                                        display_name: 'National ID Number',
                                        format: '^[0-9]{8,9}[a-zA-Z]{1}[0-9]{2}$',
                                    },
                                },
                                has_visual_sample: 1,
                                is_country_supported: 0,
                            },
                            onfido: {
                                documents_supported: {
                                    national_identity_card: {
                                        display_name: 'National Identity Card',
                                    },
                                    passport: {
                                        display_name: 'Passport',
                                    },
                                },
                                is_country_supported: 1,
                            },
                        },
                    },
                    phone_idd: '263',
                    text: 'Zimbabwe',
                    value: 'zw',
                },
            ],
        };
    }
}
