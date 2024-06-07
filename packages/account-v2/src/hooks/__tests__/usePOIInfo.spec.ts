import { useKycAuthStatus } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import { usePOIInfo } from '../usePOIInfo';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useKycAuthStatus: jest.fn(),
}));

describe('usePOIInfo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockResponse = {
        isLoading: false,
        kyc_auth_status: {
            identity: {
                available_services: ['onfido', 'manual'],
                status: 'none',
            },
        },
    };

    it('should return KYC auth status response', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue(mockResponse);

        const { result } = renderHook(() => usePOIInfo({ country: 'in' }));
        const { kycAuthStatus } = result.current;
        expect(kycAuthStatus).toEqual(mockResponse.kyc_auth_status);
    });

    it('should prefer manual as available service for Nigeria when IDV is unavailable', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue(mockResponse);

        const { result } = renderHook(() => usePOIInfo({ country: 'ng' }));
        const { kycAuthStatus } = result.current;
        expect(kycAuthStatus?.identity?.available_services).toEqual(['manual', 'onfido']);
    });

    it('should return kycAuthStatus as undefined if isLoading is true', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({ ...mockResponse, isLoading: true });

        const { result } = renderHook(() => usePOIInfo({ country: 'in' }));
        const { kycAuthStatus } = result.current;
        expect(kycAuthStatus).toBeUndefined();
    });
});
