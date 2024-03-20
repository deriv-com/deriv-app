import { Regulation } from '@/constants';
import { useUIContext } from '@/providers';
import { useActiveTradingAccount, useAuthorize, useIsDIELEnabled, useTradingAccountsList } from '@deriv/api-v2';
import { act, renderHook } from '@testing-library/react-hooks';
import useAccountSwitcher from '../useAccountSwitcher';

jest.mock('@deriv/api-v2', () => ({
    useActiveTradingAccount: jest.fn(),
    useAuthorize: jest.fn(),
    useIsDIELEnabled: jest.fn(),
    useTradingAccountsList: jest.fn(),
}));

jest.mock('@/providers', () => ({
    useUIContext: jest.fn(),
}));

describe('useAccountSwitcher', () => {
    beforeEach(() => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false } });
        (useAuthorize as jest.Mock).mockReturnValue({ switchAccount: jest.fn() });
        (useIsDIELEnabled as jest.Mock).mockReturnValue({ data: false });
        (useTradingAccountsList as jest.Mock).mockReturnValue({
            data: [
                { is_virtual: false, loginid: 'real1' },
                { is_virtual: true, loginid: 'demo1' },
            ],
        });
        (useUIContext as jest.Mock).mockReturnValue({ setUIState: jest.fn() });
    });

    it('should return the correct initial state', () => {
        const { result } = renderHook(() => useAccountSwitcher());
        expect(result.current.selectedAccount).toEqual({ label: 'Real', value: 'real' });
    });

    it('should switch account when setSelectedAccount is called', () => {
        const { result } = renderHook(() => useAccountSwitcher());
        act(() => {
            result.current.setSelectedAccount({ label: 'Demo', value: 'demo' });
        });
        expect(result.current.selectedAccount).toEqual({ label: 'Demo', value: 'demo' });
    });

    it('should call setUIState with the correct parameters when activeAccountType changes', () => {
        const setUIState = jest.fn();
        (useUIContext as jest.Mock).mockReturnValue({ setUIState });
        const { rerender } = renderHook(() => useAccountSwitcher());
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        rerender();
        expect(setUIState).toHaveBeenCalledWith({
            accountType: 'demo',
        });
    });

    it('should set regulation to NonEU when isDIEL is true and activeAccountType is demo', () => {
        const setUIState = jest.fn();
        (useUIContext as jest.Mock).mockReturnValue({ setUIState });
        (useIsDIELEnabled as jest.Mock).mockReturnValue({ data: true });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true } });
        renderHook(() => useAccountSwitcher());
        expect(setUIState).toHaveBeenCalledWith({
            regulation: Regulation.NonEU,
        });
    });

    it('should call switchAccount with firstRealLoginId when account value is not demo', () => {
        const switchAccount = jest.fn();
        (useAuthorize as jest.Mock).mockReturnValue({ switchAccount });
        const { result } = renderHook(() => useAccountSwitcher());
        act(() => {
            result.current.setSelectedAccount({ label: 'Real', value: 'real' });
        });
        expect(switchAccount).toHaveBeenCalledWith('real1');
    });
});
