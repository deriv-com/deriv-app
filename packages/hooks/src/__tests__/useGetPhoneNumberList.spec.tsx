import React from 'react';

import { useQuery } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

import useGetPhoneNumberList from '../useGetPhoneNumberList';
import useSettings from '../useSettings';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

jest.mock('../useSettings');

describe('useGetPhoneNumberList', () => {
    const mockPhoneSettings = {
        phone_settings: {
            carriers: ['sms', 'whatsapp'],
            countries: [
                {
                    display_name: 'Malaysia',
                    country_code: 'MY',
                    calling_country_code: '+60',
                    carriers: ['sms', 'whatsapp'],
                },
                {
                    display_name: 'Brazil',
                    country_code: 'BR',
                    calling_country_code: '+55',
                    carriers: ['whatsapp'],
                },
            ],
        },
    };

    const mock = mockStore({});

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    beforeEach(() => {
        (useQuery as jest.Mock).mockReturnValue({ data: mockPhoneSettings });
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                calling_country_code: '+60',
            },
        });
    });

    it('should return formatted countries list', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.formatted_countries_list).toEqual([
            {
                name: 'Brazil',
                short_code: 'BR',
                phone_code: '+55',
                carriers: ['whatsapp'],
            },
            {
                name: 'Malaysia',
                short_code: 'MY',
                phone_code: '+60',
                carriers: ['sms', 'whatsapp'],
            },
        ]);
    });

    it('should return formatted countries list for core', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.legacy_core_countries_list).toEqual([
            {
                text: 'Brazil (+55)',
                value: '+55',
                id: '+55_BR',
                carriers: ['whatsapp'],
                disabled: false,
            },
            {
                text: 'Malaysia (+60)',
                value: '+60',
                id: '+60_MY',
                carriers: ['sms', 'whatsapp'],
                disabled: false,
            },
        ]);
    });

    it('should return correct clients_country code if calling_country_code is empty', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                calling_country_code: '',
            },
        });
        mock.client.website_status.clients_country = 'br';
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.selected_phone_code).toBe('+55');
    });

    it('should return correct short code selected', () => {
        mock.client.website_status.clients_country = 'my';
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.short_code_selected).toBe('MY');
    });

    it('should return correct selected country list', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.selected_country_list).toEqual({
            display_name: 'Malaysia',
            country_code: 'MY',
            calling_country_code: '+60',
            carriers: ['sms', 'whatsapp'],
        });
    });

    it('should return true for is_global_sms_available', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.is_global_sms_available).toBe(true);
    });

    it('should return true for is_global_whatsapp_available', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.is_global_whatsapp_available).toBe(true);
    });

    it('should return false for is_global_sms_available when sms is not supported', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { phone_settings: { carriers: ['whatsapp'] } } });
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.is_global_sms_available).toBe(false);
    });

    it('should return false for is_global_whatsapp_available when whatsapp is not supported', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { phone_settings: { carriers: ['sms'] } } });

        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.is_global_whatsapp_available).toBe(false);
    });

    it('should return true for is_carriers_supported', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.is_carriers_supported).toBe(true);
    });

    it('should return false for is_carriers_supported when carriers is empty', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { phone_settings: { carriers: [] } } });
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.is_carriers_supported).toBe(false);
    });
});
