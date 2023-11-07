import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import { Jurisdiction, JURISDICTION_MARKET_TYPES } from '@deriv/shared';
import useMT5SVGEligibleToMigrate from '../useMT5SVGEligibleToMigrate';

describe('useMT5SVGEligibleToMigrate', () => {
    const mock_landing_company_short_code = Jurisdiction.SVG;

    it('should return all values of svg to bvi financial accounts in the hook', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        login: '123',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { [JURISDICTION_MARKET_TYPES.FINANCIAL]: Jurisdiction.BVI },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });

        expect(result.current.no_of_svg_accounts_to_migrate).toBe(1);
        expect(result.current.eligible_account_to_migrate_label.toLowerCase()).toBe(Jurisdiction.BVI);
        expect(result.current.has_svg_accounts_to_migrate).toBeTruthy();
        expect(result.current.eligible_svg_to_bvi_financial_accounts).toBeTruthy();
    });

    it('should return false for has_svg_accounts_to_migrate if show_eu_related_content is true', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        login: '123',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { [JURISDICTION_MARKET_TYPES.FINANCIAL]: Jurisdiction.BVI },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });

        expect(result.current.has_svg_accounts_to_migrate).toBeFalsy();
    });

    it('should return all values of svg to bvi derived accounts in the hook', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        login: '123',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { synthetic: Jurisdiction.BVI },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });

        expect(result.current.eligible_account_to_migrate_label.toLowerCase()).toBe(Jurisdiction.BVI);
        expect(result.current.eligible_svg_to_bvi_derived_accounts).toBeTruthy();
    });

    it('should return all values of svg to vanuatu financial accounts in the hook', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { [JURISDICTION_MARKET_TYPES.FINANCIAL]: Jurisdiction.VANUATU },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });
        expect(result.current.eligible_account_to_migrate_label.toLowerCase()).toBe(Jurisdiction.VANUATU);
        expect(result.current.eligible_svg_to_vanuatu_financial_accounts).toBeTruthy();
    });

    it('should return all values of svg to vanuatu derived accounts in the hook', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { synthetic: Jurisdiction.VANUATU },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });
        expect(result.current.eligible_account_to_migrate_label.toLowerCase()).toBe(Jurisdiction.VANUATU);
        expect(result.current.eligible_svg_to_vanuatu_derived_accounts).toBeTruthy();
    });

    it('should return all values of both svg to vanuatu derived accounts and svg to vanuatu financial accounts in the hook', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        login: '123',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { synthetic: Jurisdiction.VANUATU },
                    },
                    {
                        login: '456',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { [JURISDICTION_MARKET_TYPES.FINANCIAL]: Jurisdiction.VANUATU },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });

        expect(result.current.no_of_svg_accounts_to_migrate).toBe(2);
        expect(result.current.eligible_svg_to_bvi_derived_accounts).not.toBeTruthy();
        expect(result.current.eligible_svg_to_bvi_financial_accounts).not.toBeTruthy();
        expect(result.current.eligible_svg_to_vanuatu_derived_accounts).toBeTruthy();
        expect(result.current.eligible_svg_to_vanuatu_financial_accounts).toBeTruthy();
    });

    it('should return all values of both svg to vanuatu derived accounts and svg to vanuatu financial accounts in the hook', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [
                    {
                        login: '678',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { synthetic: Jurisdiction.BVI },
                    },
                    {
                        login: '789',
                        balance: 1000,
                        currency: 'USD',
                        landing_company_short: mock_landing_company_short_code,
                        eligible_to_migrate: { [JURISDICTION_MARKET_TYPES.FINANCIAL]: Jurisdiction.BVI },
                    },
                ],
            },
            traders_hub: {
                show_eu_related_content: false,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useMT5SVGEligibleToMigrate(), { wrapper });

        expect(result.current.no_of_svg_accounts_to_migrate).toBe(2);
        expect(result.current.eligible_svg_to_bvi_derived_accounts).toBeTruthy();
        expect(result.current.eligible_svg_to_bvi_financial_accounts).toBeTruthy();
        expect(result.current.eligible_svg_to_vanuatu_derived_accounts).not.toBeTruthy();
        expect(result.current.eligible_svg_to_vanuatu_financial_accounts).not.toBeTruthy();
    });
});
