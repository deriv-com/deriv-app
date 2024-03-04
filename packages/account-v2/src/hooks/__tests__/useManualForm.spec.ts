import { useKycAuthStatus } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useManualForm from '../useManualForm';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
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
        const { result } = renderHook(() => useManualForm('ng', 'nimcSlip'));
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
