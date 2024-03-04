import { renderHook } from '@testing-library/react-hooks';
import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';
import useGrowthbookFeatureFlag from '../useGrowthbookFeatureFlag';
import useIsPasskeySupported from '../useIsPasskeySupported';

jest.mock('@simplewebauthn/browser', () => ({
    platformAuthenticatorIsAvailable: jest.fn(),
}));
jest.mock('../useGrowthbookFeatureFlag', () => jest.fn());

const mockUseGrowthbookFeatureFlag = useGrowthbookFeatureFlag as jest.MockedFunction<typeof useGrowthbookFeatureFlag>;

describe('useIsPasskeySupported', () => {
    it('sets state correctly when passkey is supported', async () => {
        (platformAuthenticatorIsAvailable as jest.Mock).mockResolvedValue(true);
        mockUseGrowthbookFeatureFlag.mockReturnValue(true);

        const { result, waitForNextUpdate } = renderHook(() => useIsPasskeySupported());

        expect(result.current.is_passkey_support_checking).toBe(true);
        await waitForNextUpdate();
        expect(result.current.is_passkey_support_checking).toBe(false);
        expect(result.current.is_passkey_supported).toBe(true);
    });
    it('does not support passkey when growthbook feature flag is true and authenticator is not supported', async () => {
        (platformAuthenticatorIsAvailable as jest.Mock).mockResolvedValue(false);
        mockUseGrowthbookFeatureFlag.mockReturnValue(true);

        const { result, waitForNextUpdate } = renderHook(() => useIsPasskeySupported());

        expect(result.current.is_passkey_support_checking).toBe(true);
        await waitForNextUpdate();
        expect(result.current.is_passkey_support_checking).toBe(false);
        expect(result.current.is_passkey_supported).toBe(false);
    });
    it('does not support passkey when growthbook feature flag is false and authenticator is not supported', async () => {
        (platformAuthenticatorIsAvailable as jest.Mock).mockResolvedValue(false);
        mockUseGrowthbookFeatureFlag.mockReturnValue(false);

        const { result, waitForNextUpdate } = renderHook(() => useIsPasskeySupported());

        expect(result.current.is_passkey_support_checking).toBe(true);
        await waitForNextUpdate();
        expect(result.current.is_passkey_support_checking).toBe(false);
        expect(result.current.is_passkey_supported).toBe(false);
    });
    it('does not support passkey when growthbook feature flag is false and authenticator is supported', async () => {
        (platformAuthenticatorIsAvailable as jest.Mock).mockResolvedValue(false);
        mockUseGrowthbookFeatureFlag.mockReturnValue(false);

        const { result, waitForNextUpdate } = renderHook(() => useIsPasskeySupported());

        expect(result.current.is_passkey_support_checking).toBe(true);
        await waitForNextUpdate();
        expect(result.current.is_passkey_support_checking).toBe(false);
        expect(result.current.is_passkey_supported).toBe(false);
    });
});
