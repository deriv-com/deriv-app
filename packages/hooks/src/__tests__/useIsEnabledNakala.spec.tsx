import React from 'react';
import axios from 'axios';

import { mockStore, StoreProvider } from '@deriv/stores';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useGrowthbookGetFeatureValue from '../useGrowthbookGetFeatureValue';
import useIsEnabledNakala from '../useIsEnabledNakala';

jest.mock('axios');
jest.mock('../useGrowthbookGetFeatureValue');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseGrowthbookGetFeatureValue = useGrowthbookGetFeatureValue as jest.MockedFunction<
    typeof useGrowthbookGetFeatureValue
>;

// Mock console.error to avoid error logs in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('useIsEnabledNakala', () => {
    const mock_store = mockStore({
        traders_hub: {
            is_demo: false,
        },
    });

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockClear();

        // Default mock for feature flag
        mockedUseGrowthbookGetFeatureValue.mockReturnValue([false]);
    });

    type AccountsProps = {
        accounts: Array<{
            landing_company_name?: string;
            landing_company_short?: string;
            display_login?: string;
        }>;
    };

    const wrapper: React.FC<React.PropsWithChildren<AccountsProps>> = ({ children }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    afterEach(() => {
        delete process.env.NODE_ENV;
    });

    describe('getMT5Account prioritization', () => {
        it('should prioritize svg account', () => {
            const accounts = [
                { landing_company_name: 'bvi', display_login: 'BVI123' },
                { landing_company_name: 'svg', display_login: 'SVG123' },
                { landing_company_name: 'vanuatu', display_login: 'VU123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('SVG123');
        });

        it('should prioritize vanuatu account when svg is not available', () => {
            const accounts = [
                { landing_company_name: 'bvi', display_login: 'BVI123' },
                { landing_company_name: 'vanuatu', display_login: 'VU123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('VU123');
        });

        it('should prioritize bvi account when svg and vanuatu are not available', () => {
            const accounts = [
                { landing_company_name: 'other', display_login: 'OTHER123' },
                { landing_company_name: 'bvi', display_login: 'BVI123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('BVI123');
        });

        it('should use landing_company_short when landing_company_name is not available', () => {
            const accounts = [
                { landing_company_short: 'svg', display_login: 'SVG123' },
                { landing_company_short: 'bvi', display_login: 'BVI123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('SVG123');
        });

        it('should fallback to first account when no priority match is found', () => {
            const accounts = [
                { landing_company_name: 'other1', display_login: 'OTHER1' },
                { landing_company_name: 'other2', display_login: 'OTHER2' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('OTHER1');
        });

        it('should return empty loginId when accounts array is empty', () => {
            const { result } = renderHook(() => useIsEnabledNakala([]), { wrapper });

            expect(result.current.loginId).toBe('');
        });

        it('should return empty loginId when accounts array is null/undefined', () => {
            const { result } = renderHook(() => useIsEnabledNakala(null as unknown as never[]), { wrapper });

            expect(result.current.loginId).toBe('');
        });

        it('should handle accounts with undefined display_login', () => {
            const accounts = [{ landing_company_name: 'svg', display_login: undefined }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('');
        });
    });

    describe('feature flag integration', () => {
        it('should return IsEnabledNakala as true when feature flag is enabled', () => {
            mockedUseGrowthbookGetFeatureValue.mockReturnValue([true]);
            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.IsEnabledNakala).toBe(true);
        });

        it('should return IsEnabledNakala as false when feature flag is disabled', () => {
            mockedUseGrowthbookGetFeatureValue.mockReturnValue([false]);
            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.IsEnabledNakala).toBe(false);
        });

        it('should call useGrowthbookGetFeatureValue with correct feature flag', () => {
            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(mockedUseGrowthbookGetFeatureValue).toHaveBeenCalledWith({
                featureFlag: 'is_nakala_enabled',
            });
        });
    });

    describe('Nakala server info API calls', () => {
        it('should make API call to staging URL in non-production environment', async () => {
            process.env.NODE_ENV = 'development';
            mockedAxios.get.mockResolvedValue({ data: { server_name: 'test-server' } });

            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            await waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalledWith(
                    'https://staging-api-gateway.deriv.com/nakala/v1/nakala-servers?mt5_login_id=SVG123'
                );
            });

            expect(result.current.nakalaServerInfo).toBe('test-server');
        });

        it('should handle API error gracefully', async () => {
            const error = new Error('Network error');
            mockedAxios.get.mockRejectedValue(error);

            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            await waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalled();
            });

            expect(result.current.nakalaServerInfo).toBe(null);
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching Nakala server info:', error);
        });

        it('should not make API call when loginId is empty', () => {
            const accounts: never[] = [];

            renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(mockedAxios.get).not.toHaveBeenCalled();
        });

        it('should make new API call when loginId changes', async () => {
            mockedAxios.get.mockResolvedValue({ data: { server_name: 'server1' } });

            const initialAccounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];
            const { rerender } = renderHook((props: AccountsProps) => useIsEnabledNakala(props.accounts), {
                initialProps: { accounts: initialAccounts },
                wrapper,
            });

            await waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalledWith(
                    'https://staging-api-gateway.deriv.com/nakala/v1/nakala-servers?mt5_login_id=SVG123'
                );
            });

            // Change accounts
            mockedAxios.get.mockResolvedValue({ data: { server_name: 'server2' } });
            const newAccounts = [{ landing_company_name: 'bvi', display_login: 'BVI456' }];

            rerender({ accounts: newAccounts });

            await waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalledWith(
                    'https://staging-api-gateway.deriv.com/nakala/v1/nakala-servers?mt5_login_id=BVI456'
                );
            });

            expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        });

        it('should handle response without server_name', async () => {
            mockedAxios.get.mockResolvedValue({ data: {} });

            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            await waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalled();
            });

            expect(result.current.nakalaServerInfo).toBe(undefined);
        });

        it('should handle response with null data', async () => {
            mockedAxios.get.mockResolvedValue({ data: null });

            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            await waitFor(() => {
                expect(mockedAxios.get).toHaveBeenCalled();
            });

            expect(result.current.nakalaServerInfo).toBe(undefined);
        });
    });

    describe('return values', () => {
        it('should return correct structure with all properties', () => {
            mockedUseGrowthbookGetFeatureValue.mockReturnValue([true]);
            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current).toHaveProperty('IsEnabledNakala');
            expect(result.current).toHaveProperty('nakalaServerInfo');
            expect(result.current).toHaveProperty('loginId');
            expect(typeof result.current.IsEnabledNakala).toBe('boolean');
            expect(typeof result.current.loginId).toBe('string');
        });

        it('should initialize nakalaServerInfo as null', () => {
            const accounts = [{ landing_company_name: 'svg', display_login: 'SVG123' }];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.nakalaServerInfo).toBe(null);
        });
    });

    describe('case sensitivity', () => {
        it('should handle lowercase landing_company_name', () => {
            const accounts = [
                { landing_company_name: 'svg', display_login: 'SVG123' },
                { landing_company_name: 'bvi', display_login: 'BVI123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('SVG123');
        });

        it('should handle uppercase landing_company_name', () => {
            const accounts = [
                { landing_company_name: 'SVG', display_login: 'SVG123' },
                { landing_company_name: 'BVI', display_login: 'BVI123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('SVG123');
        });

        it('should handle mixed case landing_company_name', () => {
            const accounts = [
                { landing_company_name: 'Svg', display_login: 'SVG123' },
                { landing_company_name: 'Bvi', display_login: 'BVI123' },
            ];

            const { result } = renderHook(() => useIsEnabledNakala(accounts), { wrapper });

            expect(result.current.loginId).toBe('SVG123');
        });
    });
});
