import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useCFDAssets from '../useCFDAssets';
import usePlatformAssets from '../usePlatformAssets';
import useTotalAssets from '../useTotalAssets';

jest.mock('@/providers', () => ({
    useUIContext: jest.fn(),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveTradingAccount: jest.fn(),
    useAuthorize: jest.fn(),
}));

jest.mock('../useCFDAssets', () => jest.fn());
jest.mock('../usePlatformAssets', () => jest.fn());

describe('useTotalAssets', () => {
    it('should return expected data and success status', () => {
        (useUIContext as jest.Mock).mockReturnValue({ uiState: { regulation: 'test' } });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
        (useAuthorize as jest.Mock).mockReturnValue({ data: { preferred_language: 'en' }, isSuccess: true });
        (useCFDAssets as jest.Mock).mockReturnValue({
            calculatedDemoBalance: 0,
            calculatedRealBalance: 100,
            isSuccess: true,
        });
        (usePlatformAssets as jest.Mock).mockReturnValue({
            demoAccountBalance: 0,
            totalRealPlatformBalance: 200,
            isSuccess: true,
        });

        const { result } = renderHook(() => useTotalAssets());
        expect(result.current.data).toBe('300.00 USD');
        expect(result.current.isSuccess).toBe(true);
    });

    it('should handle failure in useAuthorize', () => {
        (useUIContext as jest.Mock).mockReturnValue({ uiState: { regulation: 'test' } });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: false });
        (useCFDAssets as jest.Mock).mockReturnValue({
            calculatedDemoBalance: 0,
            calculatedRealBalance: 100,
            isSuccess: true,
        });
        (usePlatformAssets as jest.Mock).mockReturnValue({
            demoAccountBalance: 0,
            totalRealPlatformBalance: 200,
            isSuccess: true,
        });

        const { result } = renderHook(() => useTotalAssets());
        expect(result.current.isSuccess).toBe(false);
    });

    it('should handle virtual account', () => {
        (useUIContext as jest.Mock).mockReturnValue({ uiState: { regulation: 'test' } });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        (useAuthorize as jest.Mock).mockReturnValue({ data: { preferred_language: 'en' }, isSuccess: true });
        (useCFDAssets as jest.Mock).mockReturnValue({
            calculatedDemoBalance: 100,
            calculatedRealBalance: 0,
            isSuccess: true,
        });
        (usePlatformAssets as jest.Mock).mockReturnValue({
            demoAccountBalance: 200,
            totalRealPlatformBalance: 0,
            isSuccess: true,
        });

        const { result } = renderHook(() => useTotalAssets());
        expect(result.current.data).toBe('300.00 USD');
        expect(result.current.isSuccess).toBe(true);
    });
});
