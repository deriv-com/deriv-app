import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import useSettings from '../useSettings';
import useGetPhoneNumberList from '../useGetPhoneNumberList';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

jest.mock('../useSettings');

describe('useGetPhoneNumberList', () => {
    const mockPhoneSettings = {
        phone_settings: {
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
                name: 'Malaysia',
                short_code: 'MY',
                phone_code: '+60',
                carriers: ['sms', 'whatsapp'],
            },
            {
                name: 'Brazil',
                short_code: 'BR',
                phone_code: '+55',
                carriers: ['whatsapp'],
            },
        ]);
    });

    it('should return formatted countries list for core', () => {
        const { result } = renderHook(() => useGetPhoneNumberList(), {
            wrapper,
        });

        expect(result.current.formatted_countries_list_for_core).toEqual([
            {
                text: 'Malaysia (+60)',
                value: '+60',
                id: '+60_MY',
                disabled: false,
            },
            {
                text: 'Brazil (+55)',
                value: '+55',
                id: '+55_BR',
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
});
