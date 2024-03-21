import { Regulation } from '@/constants';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api-v2';
import { act, renderHook } from '@testing-library/react-hooks';
import useRegulationSwitcher from '../useRegulationSwitcher';

jest.mock('@deriv/api-v2', () => ({
    useActiveTradingAccount: jest.fn(),
    useAuthorize: jest.fn(),
    useTradingAccountsList: jest.fn(),
    useIsEuRegion: jest.fn().mockReturnValue({ isEUCountry: true }),
    useLandingCompany: jest.fn().mockReturnValue({ data: { gaming_company: { shortcode: 'maltainvest' } } }),
}));

jest.mock('@/providers', () => ({
    useUIContext: jest.fn(),
}));

describe('useRegulationSwitcher', () => {
    beforeEach(() => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { loginid: 'CR1234' } });
        (useAuthorize as jest.Mock).mockReturnValue({ switchAccount: jest.fn() });
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [{ loginid: 'CR1234' }, { loginid: 'MF1234' }],
        });
        (useUIContext as jest.Mock).mockReturnValue({ setUIState: jest.fn(), uiState: { regulation: Regulation.EU } });
    });

    it('should return the correct initial state', () => {
        const { result } = renderHook(() => useRegulationSwitcher());
        expect(result.current.buttons).toEqual([{ label: Regulation.NonEU }, { label: Regulation.EU }]);
    });

    it('should switch regulation when handleButtonClick is called', () => {
        const setUIState = jest.fn();
        (useUIContext as jest.Mock).mockReturnValue({ setUIState, uiState: { regulation: Regulation.EU } });
        const { result } = renderHook(() => useRegulationSwitcher());
        act(() => {
            result.current.handleButtonClick(Regulation.NonEU);
        });
        expect(setUIState).toHaveBeenCalledWith({ regulation: Regulation.NonEU });
    });

    it('should set regulation based on active trading account', () => {
        const setUIState = jest.fn();
        (useUIContext as jest.Mock).mockReturnValue({ setUIState, uiState: { regulation: Regulation.EU } });
        renderHook(() => useRegulationSwitcher());
        expect(setUIState).toHaveBeenCalledWith({ regulation: Regulation.NonEU });
    });

    it('should set regulation to EU when active trading account starts with MF', () => {
        const setUIState = jest.fn();
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { loginid: 'MF1234' } });
        (useUIContext as jest.Mock).mockReturnValue({ setUIState, uiState: { regulation: Regulation.NonEU } });
        renderHook(() => useRegulationSwitcher());
        expect(setUIState).toHaveBeenCalledWith({ regulation: Regulation.EU });
    });

    it('should set regulation to NonEU and switch account when label is NonEU and realCRAccount is not empty', () => {
        const setUIState = jest.fn();
        const switchAccount = jest.fn();
        (useUIContext as jest.Mock).mockReturnValue({ setUIState, uiState: { regulation: Regulation.EU } });
        (useAuthorize as jest.Mock).mockReturnValue({ switchAccount });
        const { result } = renderHook(() => useRegulationSwitcher());
        act(() => {
            result.current.handleButtonClick(Regulation.NonEU);
        });
        expect(setUIState).toHaveBeenCalledWith({ regulation: Regulation.NonEU });
        expect(switchAccount).toHaveBeenCalledWith('CR1234');
    });
});
