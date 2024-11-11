import { useQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';
import { useCallback } from 'react';
import useSettings from './useSettings';

const useGetPhoneNumberList = () => {
    const { client } = useStore();
    const { data: account_settings } = useSettings();
    const {
        website_status: { clients_country },
        is_authorize,
    } = client;
    const { data } = useQuery('phone_settings', { options: { enabled: is_authorize } });
    const countries = data?.phone_settings?.countries;

    const getSelectedPhoneCode = useCallback(() => {
        const country = countries?.find(c => c.country_code.toLowerCase() === clients_country);
        return country?.calling_country_code;
    }, [clients_country, countries]);

    const getSelectedCountryList = useCallback(() => {
        const country = countries?.find(c => c.country_code.toLowerCase() === clients_country);
        return country;
    }, [clients_country, countries]);

    const getShortCodeSelected = useCallback(() => {
        //@ts-expect-error calling_country_code is not defined in GetSettings
        const phone_code = account_settings?.calling_country_code;
        // Assuming you have access to the residency_list or a similar data structure
        const country = countries?.find(country => country.calling_country_code === phone_code);
        return country?.country_code || '';
    }, [account_settings, countries]);

    const formatted_countries_list = countries?.map(country => ({
        name: country.display_name,
        short_code: country.country_code,
        phone_code: country.calling_country_code,
        carriers: country.carriers,
    }));

    const formatted_countries_list_for_core = countries?.map(country => ({
        text: `${country.display_name} (${country.calling_country_code})`,
        value: country.calling_country_code,
        id: `${country.calling_country_code}_${country.country_code}`,
        disabled: false,
    }));

    //@ts-expect-error will remove this once the account_settings is updated
    const selected_phone_code = account_settings?.calling_country_code || getSelectedPhoneCode();

    const selected_country_list = getSelectedCountryList();

    const short_code_selected = getShortCodeSelected() || clients_country;

    return {
        formatted_countries_list_for_core,
        formatted_countries_list,
        short_code_selected,
        selected_phone_code,
        selected_country_list,
    };
};

export default useGetPhoneNumberList;
