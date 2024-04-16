import { useKycAuthStatus } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import { useManualForm } from '../useManualForm';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useKycAuthStatus: jest.fn(),
}));

describe('useManualForm', () => {
    it('should return false for expiry date if citizenship is ng and document is nimc slip', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({
            isLoading: false,
            kyc_auth_status: {
                identity: {
                    available_services: ['onfido', 'manual'],
                },
            },
        });
        const { result } = renderHook(() => useManualForm('ng', 'nimc_slip'));
        const { isExpiryDateRequired, poiService } = result.current;
        expect(isExpiryDateRequired).toBeFalsy();
        expect(poiService).toBe('manual');
    });

    it('should return true for expiry date if citizenship is ng and document is passport', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({
            isLoading: false,
            kyc_auth_status: {
                identity: {
                    available_services: ['onfido', 'manual'],
                },
            },
        });
        const { result } = renderHook(() => useManualForm('ng', 'passport'));
        const { isExpiryDateRequired, poiService } = result.current;
        expect(isExpiryDateRequired).toBeTruthy();
        expect(poiService).toBe('onfido');
    });

    it('should return manual as POI service if citizenship is in and document is passport', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({
            isLoading: false,
            kyc_auth_status: {
                identity: {
                    available_services: ['onfido', 'manual'],
                },
            },
        });
        const { result } = renderHook(() => useManualForm('in', 'passport'));
        const { isExpiryDateRequired, poiService } = result.current;
        expect(isExpiryDateRequired).toBeTruthy();
        expect(poiService).toBe('manual');
    });
});
