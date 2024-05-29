import { GetSettings, ResidenceList } from '@deriv/api-types';
import {
    filterDisabledPositions,
    formatPortfolioPosition,
    isVerificationServiceSupported,
    formatIDVError,
    formatOnfidoError,
} from '../format-response';
import { LocalStore } from '../../storage';
import { CONTRACT_TYPES } from '../../contract';
import { IDV_ERROR_STATUS, STATUS_CODES, getContractTypeFeatureFlag } from '../../constants';

jest.mock('../../constants', () => ({
    ...jest.requireActual('../../constants'),
    getContractTypeFeatureFlag: jest.fn(() => 'rise_fall'),
}));
jest.mock('../../storage', () => ({
    ...jest.requireActual('../../storage'),
    LocalStore: {
        getObject: jest.fn(() => ({ data: { rise_fall: false } })),
    },
}));

describe('format-response', () => {
    const mock_active_symbols = [{ display_name: 'Volatility 25 Index', symbol: 'R_25' }];
    const portfolio_pos = {
        buy_price: 2500.5,
        contract_id: 1234,
        contract_type: CONTRACT_TYPES.ASIAN.UP,
        longcode: 'test \n test \n test',
        payout: 3500.1,
        symbol: 'R_25',
        shortcode: 'ASIANU_R_25_',
        transaction_id: 5678,
    };

    const get_settings: GetSettings = {
        account_opening_reason: '',
        address_city: 'MUDGEERABA',
        address_line_1: "29 Ross Street, .'",
        address_line_2: ".'",
        address_postcode: '111',
        address_state: '',
        allow_copiers: 0,
        citizen: '',
        client_tnc_status: 'Version 4.2.0 2020-08-07',
        country: 'Singapore',
        country_code: 'sg',
        date_of_birth: 984960000,
        email: 'mock@gmail.com',
        email_consent: 1,
        feature_flag: {
            wallet: 0,
        },
        first_name: 'deriv',
        has_secret_answer: 1,
        immutable_fields: ['residence'],
        is_authenticated_payment_agent: 0,
        last_name: 'am',
        non_pep_declaration: 1,
        phone: '+651213456',
        place_of_birth: null,
        preferred_language: 'EN',
        request_professional_status: 0,
        residence: 'Singapore',
        salutation: '',
        tax_identification_number: null,
        tax_residence: null,
        user_hash: 'mock_hash',
    };

    const residence_list: ResidenceList = [
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
    ];

    it('should return an object with values in object passed as argument to formatPortfolioPosition', () => {
        expect(formatPortfolioPosition(portfolio_pos, mock_active_symbols)).toEqual({
            details: 'test <br /> test <br /> test',
            display_name: 'Volatility 25 Index',
            id: 1234,
            indicative: 0,
            payout: 3500.1,
            contract_update: undefined,
            purchase: 2500.5,
            reference: +5678,
            type: CONTRACT_TYPES.ASIAN.UP,
            contract_info: portfolio_pos,
        });
    });
    it('should return true if residence is in the list of supported countries for onfido', () => {
        expect(isVerificationServiceSupported(residence_list, get_settings, 'onfido')).toBeTruthy();
    });

    describe('filterDisabledPositions', () => {
        const position = {
            contract_type: 'CALL',
            shortcode: 'CALL_1HZ100V_19.53_1695913929_5T_S0P_0',
        };
        it('should return false if a feature flag for position.contract_type is disabled', () => {
            (LocalStore.getObject as jest.Mock).mockReturnValueOnce({ data: { rise_fall: false } });
            expect(filterDisabledPositions(position)).toBeFalsy();
        });
        it('should return true if a feature flag for position.contract_type is enabled', () => {
            (LocalStore.getObject as jest.Mock).mockReturnValueOnce({ data: { rise_fall: true } });
            expect(filterDisabledPositions(position)).toBeTruthy();
        });
        it('should return true if a feature flag for position.contract_type is not defined', () => {
            (getContractTypeFeatureFlag as jest.Mock).mockReturnValueOnce(undefined);
            expect(filterDisabledPositions(position)).toBeTruthy();
        });
        it(`should return true if a feature flag for transaction contract category is enabled
            based on shortcode when contract_type property is missing`, () => {
            const transaction = {
                shortcode: 'CALL_1HZ100V_19.53_1695913929_5T_S0P_0',
            };
            (LocalStore.getObject as jest.Mock).mockReturnValueOnce({ data: { rise_fall: true } });
            expect(filterDisabledPositions(transaction)).toBeTruthy();
        });
    });

    describe('formatIDVError', () => {
        it('should return null as error if no errors are present and status is NONE', () => {
            expect(formatIDVError([], STATUS_CODES.NONE)).toBeNull();
        });

        it('should return null as error if no errors are present and status is NONE even for high risk client', () => {
            expect(formatIDVError([], STATUS_CODES.NONE, true)).toBeNull();
        });

        it('should return null as error if no errors are present and status is VERIFIED', () => {
            expect(formatIDVError([], STATUS_CODES.VERIFIED)).toBeNull();
        });

        it('should return HighRisk error code if no errors are present and status is VERIFIED', () => {
            expect(formatIDVError([], STATUS_CODES.VERIFIED, true)).toBe(IDV_ERROR_STATUS.HighRisk.code);
        });

        it('should return Expired error code if status is Expired', () => {
            expect(formatIDVError([], STATUS_CODES.EXPIRED)).toBe(IDV_ERROR_STATUS.Expired.code);
        });

        it('should return NameMismatch error code if errors array contains NameMismatch', () => {
            expect(formatIDVError(['NameMismatch'], STATUS_CODES.REJECTED)).toBe(IDV_ERROR_STATUS.NameMismatch.code);
        });

        it('should return DobMismatch error code if errors array contains DobMismatch', () => {
            expect(formatIDVError(['DobMismatch'], STATUS_CODES.REJECTED)).toBe(IDV_ERROR_STATUS.DobMismatch.code);
        });

        it('should return NameDobMismatch error code if errors array contains DobMismatch and NameMismatch', () => {
            expect(formatIDVError(['DobMismatch', 'NameMismatch'], STATUS_CODES.REJECTED)).toBe(
                IDV_ERROR_STATUS.NameDobMismatch.code
            );
        });

        it('should return ReportNotAvailable error code if errors array contains DobMismatch or NameMismatchand and is_report_not_available  ', () => {
            expect(formatIDVError(['DobMismatch', 'NameMismatch'], STATUS_CODES.REJECTED, undefined, true)).toBe(
                IDV_ERROR_STATUS.ReportNotAvailable.code
            );
        });

        it('should return DobMismatch error code if errors array contains DobMismatch and is_report_not_available is false', () => {
            expect(formatIDVError(['DobMismatch'], STATUS_CODES.REJECTED, undefined, false)).toBe(
                IDV_ERROR_STATUS.DobMismatch.code
            );
        });

        it('should return Failed error code if errors array contains DobMismatch and Failed', () => {
            expect(formatIDVError(['DobMismatch', 'Failed'], STATUS_CODES.REJECTED)).toBe(IDV_ERROR_STATUS.Failed.code);
        });

        it('should return Underage error code if errors array contains Underage', () => {
            expect(formatIDVError(['Underage'], STATUS_CODES.REJECTED)).toBe(IDV_ERROR_STATUS.Underage.code);
        });

        it('should return first error code from the error of error codes if errors array exists', () => {
            expect(formatIDVError(['Expired', 'Underage'], STATUS_CODES.EXPIRED)).toBe(IDV_ERROR_STATUS.Expired.code);
        });
    });

    describe('formatOnfidoError', () => {
        it('should return Expired error code along with the rest of error codes if status is Expired', () => {
            expect(formatOnfidoError(STATUS_CODES.EXPIRED, ['SelfieRejected'])).toHaveLength(2);
        });

        it('should return the rest of error codes if status is not Expired', () => {
            expect(
                formatOnfidoError(STATUS_CODES.REJECTED, [
                    'SelfieRejected',
                    'ImageIntegrityImageQuality',
                    'DataValidationExpiryDate',
                ])
            ).toHaveLength(3);
        });

        it('should return the rest of error codes if status is not Expired', () => {
            expect(formatOnfidoError(STATUS_CODES.REJECTED, ['DuplicatedDocument'])).toHaveLength(1);
        });
    });
});
