import * as React from 'react';
import { StoreProvider } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useNeedFinancialAssessment from '../useNeedFinancialAssessment';

describe('useNeedFinancialAssessment', () => {
    test('should be false if is_financial_account, is_financial_information_incomplete and is_trading_experience_incomplete all are false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_financial_account and is_trading_experience_incomplete are false and is_financial_information_incomplete is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_financial_account and is_financial_information_incomplete are false and is_trading_experience_incomplete is true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: true,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_financial_account is false but is_financial_information_incomplete and is_trading_experience_incomplete both are true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: false,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: true,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be false if is_financial_account is true but is_financial_information_incomplete and is_trading_experience_incomplete both are false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if is_financial_account and is_financial_information_incomplete are true and is_trading_experience_incomplete is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: false,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_financial_account and is_trading_experience_incomplete are true and is_financial_information_incomplete is false', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: true,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_financial_account, is_financial_information_incomplete and is_trading_experience_incomplete all are true', async () => {
        const mockRootStore: DeepPartial<TStores> = {
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: true,
                is_trading_experience_incomplete: true,
            },
        };

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useNeedFinancialAssessment(), { wrapper });

        expect(result.current).toBe(true);
    });
});
