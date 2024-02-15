import { useSettings } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useManualForm from '../useManualForm';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSettings: jest.fn(),
}));

describe('useManualForm', () => {
    it('should return false if citizenship is ng', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                citizen: 'ng',
                country_code: 'in',
            },
        });
        const { result } = renderHook(() => useManualForm());
        const { isExpiryDateRequired } = result.current;
        expect(isExpiryDateRequired).toBe(false);
    });

    it('should return true if citizenship and country code is not ng', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                citizen: 'au',
                country_code: 'au',
            },
        });
        const { result } = renderHook(() => useManualForm());
        const { isExpiryDateRequired } = result.current;
        expect(isExpiryDateRequired).toBe(true);
    });

    it('should return true if citizenship is not ng but country code is ng', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                citizen: 'in',
                country_code: 'ng',
            },
        });
        const { result } = renderHook(() => useManualForm());
        const { isExpiryDateRequired } = result.current;
        expect(isExpiryDateRequired).toBe(true);
    });
});
