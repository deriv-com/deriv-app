import React from 'react';
import { APIProvider } from '@deriv/api';
import { P2PSettingsProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PSettings from '../useP2PSettings';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <P2PSettingsProvider>{children}</P2PSettingsProvider>
    </APIProvider>
);

describe('useP2PSettings', () => {
    it('should return an empty object if data is not available', () => {
        const { result } = renderHook(() => useP2PSettings(), { wrapper });
        expect(result.current.p2p_settings).toEqual({});
    });

    it('should return the correct data if data is available', () => {
        const mockData = {
            adverts_active_limit: 3,
            adverts_archive_period: 3,
            block_trade: {
                disabled: 1,
                maximum_advert_amount: 20000,
            },
            cancellation_block_duration: 24,
            cancellation_count_period: 24,
            cancellation_grace_period: 0,
            cancellation_limit: 300,
            cross_border_ads_enabled: 1,
            disabled: 0,
            feature_level: 2,
            fixed_rate_adverts: 'enabled',
            float_rate_adverts: 'disabled',
            float_rate_offset_limit: 10,
            local_currencies: [
                {
                    display_name: 'US Dollar',
                    has_adverts: 0,
                    symbol: 'USD',
                },
            ],
            maximum_advert_amount: 3000,
            maximum_order_amount: 1000,
            order_daily_limit: 300,
            order_payment_period: 15,
            payment_methods_enabled: 1,
            review_period: 24,
            supported_currencies: ['usd'],
            is_cross_border_ads_enabled: true,
            is_disabled: false,
            is_payment_methods_enabled: true,
            rate_type: 'fixed',
            float_rate_offset_limit_string: '10.00',
            reached_target_date: false,
            currency_list: [
                {
                    display_name: 'US Dollar',
                    has_adverts: 0,
                    is_default: 1,
                    text: 'USD',
                    value: 'USD',
                },
            ],
        };

        window.localStorage.setItem('p2p_settings', JSON.stringify(mockData));

        const { result } = renderHook(() => useP2PSettings(), { wrapper });
        const p2p_settings = result.current.p2p_settings;

        expect(p2p_settings?.adverts_active_limit).toBe(3);
        expect(p2p_settings?.adverts_archive_period).toBe(3);
        expect(p2p_settings?.block_trade?.disabled).toBe(1);
        expect(p2p_settings?.block_trade?.maximum_advert_amount).toBe(20000);
        expect(p2p_settings?.cancellation_block_duration).toBe(24);
        expect(p2p_settings?.cancellation_count_period).toBe(24);
        expect(p2p_settings?.cancellation_grace_period).toBe(0);
        expect(p2p_settings?.cancellation_limit).toBe(300);
        expect(p2p_settings?.cross_border_ads_enabled).toBe(1);
        expect(p2p_settings?.disabled).toBe(0);
        expect(p2p_settings?.feature_level).toBe(2);
        expect(p2p_settings?.fixed_rate_adverts).toBe('enabled');
        expect(p2p_settings?.float_rate_adverts).toBe('disabled');
        expect(p2p_settings?.float_rate_offset_limit).toBe(10);
        expect(p2p_settings?.local_currencies?.[0]?.display_name).toBe('US Dollar');
        expect(p2p_settings?.local_currencies?.[0]?.has_adverts).toBe(0);
        expect(p2p_settings?.local_currencies?.[0]?.symbol).toBe('USD');
        expect(p2p_settings?.maximum_advert_amount).toBe(3000);
        expect(p2p_settings?.maximum_order_amount).toBe(1000);
        expect(p2p_settings?.order_daily_limit).toBe(300);
        expect(p2p_settings?.order_payment_period).toBe(15);
        expect(p2p_settings?.payment_methods_enabled).toBe(1);
        expect(p2p_settings?.review_period).toBe(24);
        expect(p2p_settings?.supported_currencies).toEqual(['usd']);
        expect(p2p_settings?.is_cross_border_ads_enabled).toBe(true);
        expect(p2p_settings?.is_disabled).toBe(false);
        expect(p2p_settings?.is_payment_methods_enabled).toBe(true);
        expect(p2p_settings?.rate_type).toBe('fixed');
        expect(p2p_settings?.float_rate_offset_limit_string).toBe('10.00');
        expect(p2p_settings?.reached_target_date).toBe(false);
        expect(p2p_settings?.currency_list?.[0]?.display_name).toBe('US Dollar');
        expect(p2p_settings?.currency_list?.[0]?.has_adverts).toBe(0);
        expect(p2p_settings?.currency_list?.[0]?.is_default).toBe(1);
        expect(p2p_settings?.currency_list?.[0]?.text).toBe('USD');
        expect(p2p_settings?.currency_list?.[0]?.value).toBe('USD');
    });
});
