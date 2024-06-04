import * as React from 'react';
import { APIProvider, AuthProvider, p2p, useAuthentication, useAuthorize, useSettings } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useAdvertiserStats from '../useAdvertiserStats';

const mockUseSettings = useSettings as jest.MockedFunction<typeof useSettings>;
const mockUseAuthentication = useAuthentication as jest.MockedFunction<typeof useAuthentication>;
const mockUseAdvertiserInfo = p2p.advertiser.useGetInfo as jest.MockedFunction<typeof p2p.advertiser.useGetInfo>;
const mockUseAuthorize = useAuthorize as jest.MockedFunction<typeof useAuthorize>;

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({
                data: {
                    currency: 'USD',
                },
                isLoading: false,
                subscribe: jest.fn(),
                unsubscribe: jest.fn(),
            }),
        },
    },
    useAuthentication: jest.fn().mockReturnValue({
        data: {
            currency: 'USD',
        },
        isLoading: false,
        isSuccess: true,
    }),
    useAuthorize: jest.fn().mockReturnValue({
        isSuccess: false,
    }),
    useSettings: jest.fn().mockReturnValue({
        data: {
            currency: 'USD',
        },
        isLoading: false,
        isSuccess: true,
    }),
}));

describe('useAdvertiserStats', () => {
    test('should not return data when useSettings and useAuthentication is still fetching', () => {
        (mockUseAuthentication as jest.Mock).mockReturnValueOnce({
            ...mockUseAuthentication,
            isSuccess: false,
        });
        (mockUseSettings as jest.Mock).mockReturnValueOnce({
            ...mockUseSettings,
            isSuccess: false,
        });
        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            ...mockUseAdvertiserInfo,
            data: {},
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        const { result } = renderHook(() => useAdvertiserStats(), { wrapper });

        expect(result.current.data).toBe(undefined);
    });
    test('should return the correct information', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        (mockUseAuthorize as jest.Mock).mockReturnValueOnce({
            isSuccess: true,
        });
        (mockUseSettings as jest.Mock).mockReturnValueOnce({
            data: {
                first_name: 'Jane',
                has_submitted_personal_details: false,
                last_name: 'Doe',
            },
        });

        jest.useFakeTimers('modern').setSystemTime(new Date('2024-02-20'));

        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            ...mockUseAdvertiserInfo('2'),
            data: {
                buy_orders_count: 10,
                created_time: 1698034883,
                partner_count: 1,
                sell_orders_count: 5,
            },
        });
        const { result } = renderHook(() => useAdvertiserStats('2'), { wrapper });

        expect(result?.current?.data?.fullName).toBe('Jane Doe');
        expect(result?.current?.data?.tradePartners).toBe(1);
        expect(result?.current?.data?.buyOrdersCount).toBe(10);
        expect(result?.current?.data?.sellOrdersCount).toBe(5);
        expect(result?.current?.data?.daysSinceJoined).toBe(120);
    });
    test('should return the correct total count and lifetime', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            ...mockUseAdvertiserInfo,
            data: {
                buy_orders_amount: '10',
                buy_orders_count: 10,
                partner_count: 1,
                sell_orders_amount: '50',
                sell_orders_count: 5,
                total_orders_count: 30,
                total_turnover: '100',
            },
        });
        const { result } = renderHook(() => useAdvertiserStats(), { wrapper });

        expect(result?.current?.data?.totalOrders).toBe(15);
        expect(result?.current?.data?.totalOrdersLifetime).toBe(30);
        expect(result?.current?.data?.tradeVolume).toBe(60);
        expect(result?.current?.data?.tradeVolumeLifetime).toBe(100);
    });
    test('should return the correct rates and limits', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            data: {
                buy_completion_rate: 1.4,
                daily_buy: '10',
                daily_buy_limit: '100',
                daily_sell: '40',
                daily_sell_limit: '50',
                sell_completion_rate: 2.4,
                upgradable_daily_limits: {
                    max_daily_buy: '1000',
                    max_daily_sell: '1000',
                },
            },
        });
        const { result } = renderHook(() => useAdvertiserStats(), { wrapper });

        expect(result?.current?.data?.buyCompletionRate).toBe(1.4);
        expect(result?.current?.data?.sellCompletionRate).toBe(2.4);
        expect(result?.current?.data?.dailyAvailableBuyLimit).toBe(90);
        expect(result?.current?.data?.dailyAvailableSellLimit).toBe(10);
        expect(result?.current?.data?.isEligibleForLimitUpgrade).toBe(true);
    });
    test('should return the correct buy/release times', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            data: {
                buy_time_avg: 150,
                release_time_avg: 40,
            },
        });
        const { result } = renderHook(() => useAdvertiserStats(), { wrapper });

        expect(result?.current?.data?.averagePayTime).toBe(3);
        expect(result?.current?.data?.averageReleaseTime).toBe(1);
    });
    test('should return the correct verification statuses', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );
        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            data: {
                has_full_verification: false,
                is_approved_boolean: false,
            },
        });
        (mockUseAuthentication as jest.Mock).mockReturnValueOnce({
            data: {
                document: {
                    status: 'verified',
                },
                identity: {
                    status: 'pending',
                },
            },
        });
        const { result } = renderHook(() => useAdvertiserStats(), { wrapper });

        expect(result?.current?.data?.isAddressVerified).toBe(true);
        expect(result?.current?.data?.isIdentityVerified).toBe(false);

        (mockUseAdvertiserInfo as jest.Mock).mockReturnValueOnce({
            data: {
                has_full_verification: true,
                is_approved_boolean: true,
            },
        });
        (mockUseAuthentication as jest.Mock).mockReturnValueOnce({
            data: {
                document: {
                    status: 'verified',
                },
                identity: {
                    status: 'pending',
                },
            },
        });
        const { result: verifiedResult } = renderHook(() => useAdvertiserStats(), { wrapper });

        expect(verifiedResult?.current?.data?.isAddressVerified).toBe(true);
        expect(verifiedResult?.current?.data?.isIdentityVerified).toBe(undefined);
    });
});
