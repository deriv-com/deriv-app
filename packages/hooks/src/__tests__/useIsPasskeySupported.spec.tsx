import { renderHook } from '@testing-library/react-hooks';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import useIsPasskeySupported from '../useIsPasskeySupported';

jest.mock('@simplewebauthn/browser', () => ({
    platformAuthenticatorIsAvailable: jest.fn(),
}));

describe('useIsPasskeySupported', () => {
    it('sets state correctly when passkey is supported', async () => {
        (platformAuthenticatorIsAvailable as jest.Mock).mockResolvedValue(true);

        const { result, waitForNextUpdate } = renderHook(() => useIsPasskeySupported());

        expect(result.current.is_loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.is_loading).toBe(false);
        expect(result.current.is_passkey_supported).toBe(true);
    });
    it('sets state correctly when passkey is not supported', async () => {
        (platformAuthenticatorIsAvailable as jest.Mock).mockResolvedValue(false);

        const { result, waitForNextUpdate } = renderHook(() => useIsPasskeySupported());

        expect(result.current.is_loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.is_loading).toBe(false);
        expect(result.current.is_passkey_supported).toBe(false);
    });
});
