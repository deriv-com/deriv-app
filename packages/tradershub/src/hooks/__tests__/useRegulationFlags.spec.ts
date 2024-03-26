import { Regulation } from '@/constants';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useIsEuRegion, useLandingCompany, useTradingAccountsList } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useRegulationFlags from '../useRegulationFlags';

jest.mock('@deriv/api-v2', () => ({
    useActiveTradingAccount: jest.fn(),
    useIsEuRegion: jest.fn(),
    useLandingCompany: jest.fn(),
    useTradingAccountsList: jest.fn(),
}));

jest.mock('@/providers', () => ({
    useUIContext: jest.fn(),
}));

describe('useRegulationFlags', () => {
    beforeEach(() => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false }, isSuccess: true });
        (useIsEuRegion as jest.Mock).mockReturnValue({ isEUCountry: true });
        (useLandingCompany as jest.Mock).mockReturnValue({
            data: {
                financial_company: { shortcode: 'svg' },
                gaming_company: { shortcode: 'svg' },
            },
            isSuccess: true,
        });
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [{ broker: 'CR' }, { broker: 'MF' }],
            isSuccess: true,
        });
        (useUIContext as jest.Mock).mockReturnValue({ uiState: { accountType: 'real', regulation: Regulation.EU } });
    });

    it('should return correct regulation flags', () => {
        const { result } = renderHook(() => useRegulationFlags());
        expect(result.current).toEqual({
            hasActiveDerivAccount: true,
            isEU: true,
            isEURealAccount: true,
            isHighRisk: true,
            isNonEU: true,
            isNonEURealAccount: true,
            isSuccess: true,
            noRealCRNonEUAccount: false,
            noRealMFEUAccount: false,
        });
    });

    it('should return isEU as false when isEUCountry and regulation are not EU', () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({ isEUCountry: false });
        (useUIContext as jest.Mock).mockReturnValue({ uiState: { regulation: Regulation.NonEU } });
        const { result } = renderHook(() => useRegulationFlags());
        expect(result.current.isEU).toBe(false);
    });

    it('should return isNonEU as false when isHighRisk is false and regulation is not NonEU', () => {
        (useLandingCompany as jest.Mock).mockReturnValue({
            data: {
                financial_company: { shortcode: 'maltainvest' },
                gaming_company: { shortcode: 'malta' },
            },
            isSuccess: true,
        });
        (useUIContext as jest.Mock).mockReturnValue({ uiState: { regulation: Regulation.EU } });
        const { result } = renderHook(() => useRegulationFlags());
        expect(result.current.isNonEU).toBe(false);
    });

    it('should return isHighRisk as false when financial_company shortcode is not svg', () => {
        (useLandingCompany as jest.Mock).mockReturnValue({
            data: {
                financial_company: { shortcode: 'maltainvest' },
                gaming_company: { shortcode: 'svg' },
            },
            isSuccess: true,
        });
        const { result } = renderHook(() => useRegulationFlags());
        expect(result.current.isHighRisk).toBe(false);
    });

    it('should return noRealCRNonEUAccount as true when broker is not CR', () => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [{ broker: 'MF' }],
            isSuccess: true,
        });
        const { result } = renderHook(() => useRegulationFlags());
        expect(result.current.noRealCRNonEUAccount).toBe(true);
    });

    it('should return noRealMFEUAccount as true when broker is not MF', () => {
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [{ broker: 'CR' }],
            isSuccess: true,
        });
        const { result } = renderHook(() => useRegulationFlags());
        expect(result.current.noRealMFEUAccount).toBe(true);
    });
});
