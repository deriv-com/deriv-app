import { useStore } from '@deriv/stores';
import { useCallback, useMemo } from 'react';

const useGetPhoneNumberList = () => {
    const countries = useMemo(
        () => [
            {
                calling_country_code: '+1',
                display_name: 'United States',
                carriers: ['sms', 'whatsapp'],
                country_code: 'US',
            },
            {
                calling_country_code: '+44',
                display_name: 'United Kingdom',
                carriers: ['sms', 'whatsapp'],
                country_code: 'GB',
            },
            {
                calling_country_code: '+33',
                display_name: 'France',
                carriers: ['sms', 'whatsapp'],
                country_code: 'FR',
            },
            {
                calling_country_code: '+60',
                display_name: 'Malaysia',
                carriers: ['sms', 'whatsapp'],
                country_code: 'MY',
            },
            {
                calling_country_code: '+55',
                display_name: 'Brazil',
                carriers: ['whatsapp'],
                country_code: 'BR',
            },
        ],
        []
    );

    const { client } = useStore();
    const {
        website_status: { clients_country },
    } = client;

    const getSelectedPhoneCode = useCallback(() => {
        const country = countries.find(c => c.country_code.toLowerCase() === clients_country);
        return country?.calling_country_code;
    }, [clients_country, countries]);

    const getSelectedCountryList = useCallback(() => {
        const country = countries.find(c => c.country_code.toLowerCase() === clients_country);
        return country;
    }, [clients_country, countries]);

    const formatted_countries_list = countries.map(country => ({
        name: country.display_name,
        short_code: country.country_code,
        phone_code: country.calling_country_code,
        carriers: country.carriers,
    }));

    const formatted_countries_list_for_core = countries.map(country => ({
        text: `${country.display_name} (${country.calling_country_code})`,
        value: country.calling_country_code,
        disabled: false,
    }));

    const selected_phone_code = getSelectedPhoneCode();

    const selected_country_list = getSelectedCountryList();

    return {
        formatted_countries_list_for_core,
        formatted_countries_list,
        short_code_selected: clients_country,
        selected_phone_code,
        selected_country_list,
    };
};

export default useGetPhoneNumberList;
