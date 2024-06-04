import { useCFDAccountsList } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useCFDAssets from '../useCFDAssets';

jest.mock('@deriv/api-v2', () => ({
    useCFDAccountsList: jest.fn(),
}));

describe('useCFDAssets', () => {
    it('should calculate sample balances correctly', () => {
        (useCFDAccountsList as jest.Mock).mockReturnValue({
            data: {
                mt5: [
                    { is_virtual: true, converted_balance: 100, landing_company_short: 'maltainvest' },
                    { is_virtual: false, converted_balance: 200, landing_company_short: 'maltainvest' },
                ],
                dxtrade: [
                    { is_virtual: true, converted_balance: 300 },
                    { is_virtual: false, converted_balance: 400 },
                ],
                ctrader: [
                    { is_virtual: true, converted_balance: 500 },
                    { is_virtual: false, converted_balance: 600 },
                ],
            },
            isSuccess: true,
        });

        const { result } = renderHook(() => useCFDAssets('EU'));

        expect(result.current.calculatedDemoBalance).toBe(100);
        expect(result.current.calculatedRealBalance).toBe(200);
        expect(result.current.isSuccess).toBe(true);
    });

    it('should handle no accounts', () => {
        (useCFDAccountsList as jest.Mock).mockReturnValue({
            data: {
                mt5: [],
                dxtrade: [],
                ctrader: [],
            },
            isSuccess: true,
        });

        const { result } = renderHook(() => useCFDAssets('EU'));

        expect(result.current.calculatedDemoBalance).toBe(0);
        expect(result.current.calculatedRealBalance).toBe(0);
        expect(result.current.isSuccess).toBe(true);
    });

    it('should handle API failure', () => {
        (useCFDAccountsList as jest.Mock).mockReturnValue({
            data: null,
            isSuccess: false,
        });

        const { result } = renderHook(() => useCFDAssets('EU'));

        expect(result.current.calculatedDemoBalance).toBe(0);
        expect(result.current.calculatedRealBalance).toBe(0);
        expect(result.current.isSuccess).toBe(false);
    });
    it('should filter mt5 accounts correctly for EU regulation', () => {
        (useCFDAccountsList as jest.Mock).mockReturnValue({
            data: {
                mt5: [
                    { is_virtual: true, converted_balance: 100, landing_company_short: 'maltainvest' },
                    { is_virtual: false, converted_balance: 200, landing_company_short: 'maltainvest' },
                    { is_virtual: false, converted_balance: 300, landing_company_short: 'svg' },
                ],
                dxtrade: [],
                ctrader: [],
            },
            isSuccess: true,
        });

        const { result } = renderHook(() => useCFDAssets('EU'));

        expect(result.current.calculatedRealBalance).toBe(200);
    });

    it('should filter mt5 accounts correctly for non-EU regulation', () => {
        (useCFDAccountsList as jest.Mock).mockReturnValue({
            data: {
                mt5: [
                    { is_virtual: true, converted_balance: 100, landing_company_short: 'maltainvest' },
                    { is_virtual: false, converted_balance: 200, landing_company_short: 'maltainvest' },
                    { is_virtual: false, converted_balance: 300, landing_company_short: 'svg' },
                ],
                dxtrade: [],
                ctrader: [],
            },
            isSuccess: true,
        });

        const { result } = renderHook(() => useCFDAssets('non-EU'));

        expect(result.current.calculatedRealBalance).toBe(300);
    });
});
