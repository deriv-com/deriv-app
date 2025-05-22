import { useCallback, useMemo } from 'react';

import { useQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useGetPhoneNumberList = () => {
    const { client } = useStore();
    const {
        account_settings,
        website_status: { clients_country },
        is_authorize,
    } = client;
    const {
        data,
        isLoading: isPhoneSettingLoading,
        refetch,
    } = useQuery('phone_settings', {
        options: { enabled: is_authorize },
    });

    const no_of_available_carriers = data?.phone_settings?.carriers && data?.phone_settings?.carriers.length;

    const is_global_sms_available = data?.phone_settings?.carriers?.includes('sms');

    const is_global_whatsapp_available = data?.phone_settings?.carriers?.includes('whatsapp');

    const is_carriers_supported = data?.phone_settings?.carriers && data.phone_settings.carriers.length > 0;

    const countries = data?.phone_settings?.countries?.sort((a, b) => a.display_name.localeCompare(b.display_name));

    const getSelectedPhoneCode = useCallback(() => {
        const country = countries?.find(c => c.country_code.toLowerCase() === clients_country);
        return country?.calling_country_code;
    }, [clients_country, countries]);

    const getSelectedCountryList = useCallback(() => {
        //@ts-expect-error calling_country_code is not defined in GetSettings
        const phone_code = account_settings?.calling_country_code;
        const country = phone_code
            ? countries?.find(c => c.calling_country_code === phone_code)
            : countries?.find(c => c.country_code.toLowerCase() === clients_country);
        return country;
    }, [clients_country, countries, account_settings]);

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

    const legacy_core_countries_list = useMemo(
        () =>
            countries?.map(country => ({
                text: `${country.display_name} (${country.calling_country_code})`,
                value: country.calling_country_code,
                id: `${country.calling_country_code}_${country.country_code}`,
                carriers: country.carriers,
                disabled: false,
            })) ?? [],
        [countries]
    );

    //@ts-expect-error will remove this once the account_settings is updated
    const selected_phone_code = account_settings?.calling_country_code || getSelectedPhoneCode();

    const selected_country_list = getSelectedCountryList();

    const short_code_selected = getShortCodeSelected() || clients_country;

    return {
        updatePhoneSettings: refetch,
        is_global_sms_available,
        is_global_whatsapp_available,
        no_of_available_carriers,
        is_carriers_supported,
        legacy_core_countries_list,
        formatted_countries_list,
        short_code_selected,
        selected_phone_code,
        selected_country_list,
        isLoading: isPhoneSettingLoading,
    };
};

export default useGetPhoneNumberList;
