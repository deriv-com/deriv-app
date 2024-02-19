import { renderHook } from '@testing-library/react-hooks';
import useShowEffortlessLoginModal from '../useShowEffortlessLoginModal';
import useIsPasskeySupported from '../useIsPasskeySupported';
import useGetPasskeysList from '../useGetPasskeysList';

jest.mock('../useIsPasskeySupported');
jest.mock('../useGetPasskeysList');

describe('useShowEffortlessLoginModal', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should return false when passkey is not supported', () => {
        (useIsPasskeySupported as jest.Mock).mockReturnValue({
            is_passkey_supported: false,
            is_passkey_support_checking: false,
        });
        (useGetPasskeysList as jest.Mock).mockReturnValue({ passkeys_list: [], is_passkeys_list_loading: false });

        const { result } = renderHook(() => useShowEffortlessLoginModal());
        expect(result.current).toBe(false);
    });

    it('should return false when passkeys list is not empty', () => {
        (useIsPasskeySupported as jest.Mock).mockReturnValue({
            is_passkey_supported: true,
            is_passkey_support_checking: false,
        });
        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: ['passkey1'],
            is_passkeys_list_loading: false,
        });

        const { result } = renderHook(() => useShowEffortlessLoginModal());
        expect(result.current).toBe(false);
    });

    it('should return true when passkey is supported and passkeys list is empty', () => {
        (useIsPasskeySupported as jest.Mock).mockReturnValue({
            is_passkey_supported: true,
            is_passkey_support_checking: false,
        });
        (useGetPasskeysList as jest.Mock).mockReturnValue({ passkeys_list: [], is_passkeys_list_loading: false });
        localStorage.setItem('show_effortless_login_modal', JSON.stringify(true));

        const { result } = renderHook(() => useShowEffortlessLoginModal());
        expect(result.current).toBe(true);
    });
});
