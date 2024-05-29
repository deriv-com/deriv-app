import {
    useActiveTradingAccount,
    useAuthentication,
    useGetAccountStatus,
    useIsEuRegion,
    useResidenceList,
    useSettings,
    useStatesList,
} from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import { useCurrentLandingCompany } from '../useCurrentLandingCompany';
import { usePersonalDetails } from '../usePersonalDetails';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveTradingAccount: jest.fn(),
    useAuthentication: jest.fn(),
    useGetAccountStatus: jest.fn(),
    useIsEuRegion: jest.fn(),
    useResidenceList: jest.fn(),
    useSettings: jest.fn(),
    useStatesList: jest.fn(),
}));

jest.mock('../useCurrentLandingCompany', () => ({
    ...jest.requireActual('../useCurrentLandingCompany'),
    useCurrentLandingCompany: jest.fn(),
}));

const mockResidenceList = [
    {
        identity: {
            services: {
                onfido: {
                    documents_supported: {
                        driving_licence: { display_name: 'Driving Licence' },
                        passport: { display_name: 'Passport' },
                    },
                    is_country_supported: true,
                },
            },
        },
        value: 'US',
    },
];

beforeEach(() => {
    (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
    (useAuthentication as jest.Mock).mockReturnValue({ data: { poa_status: 'verified', poi_status: 'verified' } });
    (useGetAccountStatus as jest.Mock).mockReturnValue({ data: { status: ['social_signup'] } });
    (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
    (useResidenceList as jest.Mock).mockReturnValue(mockResidenceList);
    (useSettings as jest.Mock).mockReturnValue({
        data: {
            country_code: 'US',
        },
    });
    (useStatesList as jest.Mock).mockReturnValue({ data: { text: 'US', value: 'United States' } });
    (useCurrentLandingCompany as jest.Mock).mockReturnValue({ data: { support_professional_client: 1 } });
});

describe('usePOAInfo', () => {
    it('should return the correct values', () => {
        const { result } = renderHook(() => usePersonalDetails());
        const { accountAuthStatus, data, initialValues, isSocialSignup } = result.current;

        expect(isSocialSignup).toBe(true);
        expect(initialValues).toStrictEqual({
            addressCity: undefined,
            addressLine1: undefined,
            addressLine2: '',
            addressPostcode: '',
            addressState: '',
            dateOfBirth: undefined,
            email: undefined,
            emailConsent: 0,
            firstName: undefined,
            lastName: undefined,
            phone: undefined,
            residence: undefined,
            taxIdentificationNumber: '',
        });
        expect(accountAuthStatus.isAccountVerified).toBe(true);
        expect(accountAuthStatus.isPoaVerified).toBe(true);
        expect(accountAuthStatus.isPoiVerified).toBe(true);
        expect(data.isEu).toBe(true);
        expect(data.isSupportProfessionalClient).toBe(true);
        expect(data.isVirtual).toBe(false);
    });

    it('should return isAccountVerified as false if poi_status or poa_status is not verified', () => {
        (useAuthentication as jest.Mock).mockReturnValue({ data: { poa_status: 'none', poi_status: 'verified' } });
        const { result } = renderHook(() => usePersonalDetails());
        const { accountAuthStatus } = result.current;

        expect(accountAuthStatus.isAccountVerified).toBe(false);
        expect(accountAuthStatus.isPoaVerified).toBe(false);
        expect(accountAuthStatus.isPoiVerified).toBe(true);
    });

    it('should return isVirtual as true', () => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        const { result } = renderHook(() => usePersonalDetails());
        const { data } = result.current;

        expect(data.isVirtual).toBe(true);
    });

    it('should return isEu as false', () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        const { result } = renderHook(() => usePersonalDetails());
        const { data } = result.current;

        expect(data.isEu).toBe(false);
    });

    it('should return isSupportProfessionalClient as false', () => {
        (useCurrentLandingCompany as jest.Mock).mockReturnValue({ data: { support_professional_client: 0 } });
        const { result } = renderHook(() => usePersonalDetails());
        const { data } = result.current;

        expect(data.isSupportProfessionalClient).toBe(false);
    });

    it('should return isSocialSignup as false', () => {
        (useGetAccountStatus as jest.Mock).mockReturnValue({ data: { status: [] } });
        const { result } = renderHook(() => usePersonalDetails());
        const { isSocialSignup } = result.current;

        expect(isSocialSignup).toBe(false);
    });

    it('should return initialValue base on returning data from useSettings', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                address_city: 'New York',
                address_line_1: '125 Main St',
                address_line_2: 'Apt 4B',
                address_postcode: '10001',
                address_state: 'NY',
                country_code: 'US',
                email: 'Johndoe@gmail.com',
                emailConsent: 0,
                phone: '0123356789',
                residence: 'us',
                taxIdentificationNumber: '',
            },
        });
        const { result } = renderHook(() => usePersonalDetails());
        const { initialValues } = result.current;

        expect(initialValues).toStrictEqual({
            addressCity: 'New York',
            addressLine1: '125 Main St',
            addressLine2: 'Apt 4B',
            addressPostcode: '10001',
            addressState: 'NY',
            dateOfBirth: undefined,
            email: 'Johndoe@gmail.com',
            emailConsent: 0,
            firstName: undefined,
            lastName: undefined,
            phone: '0123356789',
            residence: 'us',
            taxIdentificationNumber: '',
        });
    });
});
